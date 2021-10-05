/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
import Vue from 'vue';
import { DeterministicIdGenerator, PluginBridge, Transaction } from '@dhealth/wallet-api-bridge';
import { AggregateTransaction, TransactionMapping } from '@dhealth/sdk';

// internal dependencies
import { TaxonomyService } from './TaxonomyService';

/**
 * @type {FormattedTransaction}
 * @description This interface describes the basic information used to
 * specialize the view of a transaction.
 */
export interface FormattedTransaction {
    index?: number;
    id: string;
    operation: string;
    description: string;
    transactionHash: string;
    type: Transaction,
    aggregateHash?: string;
    /* other fields are not specified here */
}

/**
 * @class {TransactionService}
 * @description This service class provides methods to handle transaction
 * storage and description or grouping.
 */
export class TransactionService {
    /**
     * Known types of aggregate transactions.
     * @var {number[]}
     */
    public static aggregateTypes = [
        Transaction.AggregateComplete,
        Transaction.AggregateBonded,
    ];

    /// region public API
    /**
     * Construct a plugin service around an optional \a $app
     * Vue component/parent component.
     *
     * @param {Vue} $app
     */
    public constructor(protected readonly $app?: Vue) {}

    /**
     * This method reads transactions from the local cache using the IPC
     * communication.
     *
     * In case of aggregate transactions, it will query transaction details
     * to be able to find out about children transactions.
     *
     * @async
     * @returns {Promise<FormattedTransaction[]>}
     */
    public async getTransactions(): Promise<FormattedTransaction[]> {
        // use IPC to get data from app store (Vuex)
        const transactionBus = await PluginBridge.StoreActionRequest(
            '@yourdlt/plugin-librarian',
            PluginBridge.PluginPermissionType.Getter,
            'transaction/serializedTransactions',
        );

        // handles emptiness
        if (!transactionBus || !('response' in transactionBus) || !transactionBus.response) {
            return new Promise(resolve => resolve([]));
        }

        console.log("[DEBUG][Librarian/TransactionService.ts] Transactions received: ", transactionBus);

        // parse transaction payloads to objects
        const response = transactionBus.response;
        const transactions = Object.keys(response).filter(h => h in response && !!response[h]).map(
            h => this.formatTransaction(response[h], h)
        )

        // aggregate transactions do not include children yet
        const aggregates = transactions.filter(
            tx => TransactionService.aggregateTypes.includes(tx.type)
        );

        // no need to wait more
        if (!aggregates.length) {
            return new Promise(resolve => resolve(transactions));
        }

        // resolve aggregate transaction children on top
        // of unwrapped transactions.
        let promises: Promise<any>[] = [Promise.resolve(transactions)];
        for (let i = 0; i < aggregates.length; i++) {
            // uses IPC to get data using app store (Vuex)
            promises.push(this.getTransactionDetails(aggregates[i]));
        }

        return Promise.all(promises);
    }

    /**
     * This method reads transaction details from REST using the
     * local cache that is accessed with the IPC communications.
     *
     * In case of aggregate transactions, it will query transaction details
     * to be able to find out about children transactions.
     *
     * @async
     * @param   {FormattedTransaction}  transaction
     * @returns {Promise<FormattedTransaction[]>}
     */
    public async getTransactionDetails(transaction: FormattedTransaction): Promise<FormattedTransaction[]> {
        return new Promise(async (resolve, reject) => {
            // use IPC to get data from app store (Vuex)
            const detailsBus = await PluginBridge.StoreActionRequest(
                '@yourdlt/plugin-librarian',
                PluginBridge.PluginPermissionType.Action,
                'transaction/LOAD_TRANSACTION_DETAILS',
                {
                    group: 'confirmed',
                    transactionHash: transaction.transactionHash,
                }
            );

            console.log("[DEBUG][Librarian/TransactionService.ts] Transaction Details received: ", detailsBus);

            // handles emptiness (no details here)
            if (!('response' in detailsBus) || !('transaction' in detailsBus.response)) {
                return resolve([]);
            }

            // resolves formatted children (if any)
            if ('transactions' in detailsBus.response.transaction) {
                const aggregate = TransactionMapping.createFromDTO(detailsBus.response) as AggregateTransaction;
                const formatted = aggregate.innerTransactions.map(i => this.formatTransaction(i.serialize(), undefined, transaction.transactionHash));
                return resolve(formatted);
            }

            // resolves formatted transaction content
            const specialized = TransactionMapping.createFromDTO(detailsBus.response);
            return resolve([this.formatTransaction(specialized.serialize())]);
        });
    }

    /**
     * This method augments a transaction object to better
     * describe it with a sentence about the main action and
     * its participants.
     *
     * @param   {string}    payload 
     * @param   {string}    hash
     * @returns {FormattedTransaction}
     */
    public formatTransaction(payload: string, hash?: string, aggregateHash?: string): FormattedTransaction {
        // defer description to taxonomy module
        const service = new TaxonomyService(this.$app);

        // parse transaction payload with sdk
        const transaction = TransactionMapping.createFromPayload(payload);

        // generates a deterministic id for this transaction
        const autoId = DeterministicIdGenerator(transaction);

        let operation: string = `Digital contract`,
            description: string = `Unknown digital contract`;
        try {
            operation = service.getOperation(transaction, aggregateHash);
            description = service.getDescription(transaction, aggregateHash);
        }
        catch (e) {}

        // augment transaction object with required fields
        return {
            id: autoId.identifier,
            operation,
            description,
            transactionHash: hash,
            aggregateHash,
            ...transaction
        };
    }

    /**
     * This method sorts a transaction list by shifting children
     * transactions *after* their respective parent.
     *
     * @param   {FormattedTransaction[]}    transactions
     * @returns {FormattedTransaction[]}
     */
    public sortByParent(transactions: FormattedTransaction[]): FormattedTransaction[] {
        // index all transactions
        const indexedTransactions: FormattedTransaction[] = transactions.map((t, i) => ({
            index: i,
            ...t
        }));

        // take only transactions without children
        const parentTransactions: FormattedTransaction[] = indexedTransactions.filter(
            t => !t.aggregateHash
        );

        // sort transaction *under* parent (if any)
        let sortedTransactions: FormattedTransaction[] = []
        for (let i = 0; i < parentTransactions.length; i++) {
            const aggregate = parentTransactions[i];

            // first-level "parent" row
            sortedTransactions.push(aggregate);

            // and children rows
            sortedTransactions = sortedTransactions.concat(indexedTransactions.filter(
                c => !!c.aggregateHash && c.aggregateHash === aggregate.transactionHash
            ))
        }

        return sortedTransactions;
    }
    /// end-region public API
}
