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
import { PluginBridge, RandomIdGenerator } from '@dhealth/wallet-api-bridge';

// internal dependencies
import { FormattedTransaction } from './TransactionService';

/**
 * @type {FormattedBooklet}
 * @description This interface describes the basic information used to
 * specialize the view of a booklet.
 */
 export interface FormattedBooklet {
    id: string;
    name: string;
    tags?: string;
}

/**
 * @type {FormattedRelationship}
 * @description This interface describes the basic information used to
 * specialize the view of a booklet to transaction relationship.
 */
 export interface FormattedRelationship {
    id: string;
    bookletId: string;
    transactionHash: string;
}

/**
 * @class {BookletService}
 * @description This service class provides methods to handle booklets
 * storage and state changes.
 */
export class BookletService {
    /// region public API
    /**
     * Construct a booklet service around an optional \a $app
     * Vue component/parent component.
     *
     * @param {Vue} $app
     */
    public constructor(protected readonly $app?: Vue) {}

    /**
     * This method reads booklets from the local cache and returns
     * unique booklet entries by `id`.
     *
     * @async
     * @returns {Promise<any[]>}
     */
    public async getBooklets(): Promise<any[]> {
        // use IPC to get data from app database (localStorage)
        const storeBus = await PluginBridge.StoreActionRequest(
            '@yourdlt/plugin-librarian',
            PluginBridge.PluginPermissionType.Action,
            'db/SELECT',
            {
                table: 'librarian.booklets',
                operation: 'select',
                data: { /* no-filter */ }
            }
        )

        console.log(`[DEBUG][BookletService.ts] Booklets received: `, storeBus);

        // handles emptiness
        if (! ('response' in storeBus) || !storeBus.response || !storeBus.response.length) {
            return [];
        }

        // sort by name (alphabetically)
        return storeBus.response.map(b => b.values).sort(
            (a, b) => a.name.localeCompare(b.name)
        );
    }

    /**
     * This method reads transaction booklet relationships from the
     * local cache.
     *
     * @async
     * @returns {Promise<any[]>}
     */
    public async getRelationships(): Promise<any[]> {
        // use IPC to get data from app database (localStorage)
        const storeBus = await PluginBridge.StoreActionRequest(
            '@yourdlt/plugin-librarian',
            PluginBridge.PluginPermissionType.Action,
            'db/SELECT',
            {
                table: 'librarian.transactionInBooklet',
                operation: 'select',
                data: { /* no-filter */ } 
            }
        )

        console.log(`[DEBUG][BookletService.ts] Relationships received: `, storeBus);

        // handles emptiness
        if (! ('response' in storeBus) || !storeBus.response || !storeBus.response.length) {
            return [];
        }

        // sort by name (alphabetically)
        return storeBus.response.map(b => b.values).sort(
            (a, b) => a.id.localeCompare(b.id)
        );
    }

    /**
     * This method inserts a new booklet entry in the local cache.
     *
     * @async
     * @param   {any}               formItems
     * @returns {BookletService}
     */
    public async createBooklet(
        formItems: any,
    ): Promise<BookletService> {
        // generates a random id
        const autoId = RandomIdGenerator(8)

        // use IPC to save data in app database (localStorage)
        await PluginBridge.StoreActionRequest(
            '@yourdlt/plugin-librarian',
            PluginBridge.PluginPermissionType.Action,
            'db/INSERT',
            {
                table: 'librarian.booklets',
                operation: 'insert',
                data: {
                    id: autoId,
                    ...formItems
                } 
            }
        );

        return this;
    }

    /**
     * This method organizes a transaction in a booklet.
     *
     * @async
     * @param   {FormattedTransaction}  transaction
     * @param   {string}                bookletName
     * @return  {Promise<BookletService>}
     */
    public async linkTransactionToBooklet(
        transaction: FormattedTransaction,
        bookletName: string,
    ): Promise<BookletService> {
        // reads booklet instance
        const booklets = await this.getBooklets();
        const relations = await this.getRelationships();
        const booklet = booklets.find(b => b.name === bookletName);

        // remove previous relationship if any
        if (relations.find(
            r => r.transactionHash === transaction.transactionHash
        )) {
            await this.unlinkTransactionFromBooklet(transaction);
        }

        // generates a random id
        const autoId = RandomIdGenerator(8)

        // use IPC to save data in app database (localStorage)
        await PluginBridge.StoreActionRequest(
            '@yourdlt/plugin-librarian',
            PluginBridge.PluginPermissionType.Action,
            'db/INSERT',
            {
                table: 'librarian.transactionInBooklet',
                operation: 'insert',
                data: {
                    id: autoId,
                    bookletId: booklet.id,
                    transactionHash: transaction.transactionHash,
                    createdAt: new Date().valueOf()
                }
            }
        );

        return this;
    }

    /**
     * This method removes a transaction from a booklet by
     * removing the librarian.transactionInBooklet relation
     * entry.
     *
     * @async
     * @param   {FormattedTransaction}  transaction
     * @return  {Promise<BookletService>}
     */
    public async unlinkTransactionFromBooklet(
        transaction: FormattedTransaction,
    ): Promise<BookletService> {
        // reads relation instance
        const relations = await this.getRelationships();
        const relation = relations.find(
            r => r.transactionHash === transaction.transactionHash
        );

        // use IPC to delete data from app database (localStorage)
        await PluginBridge.StoreActionRequest(
            '@yourdlt/plugin-librarian',
            PluginBridge.PluginPermissionType.Action,
            'db/DELETE',
            {
                table: 'librarian.transactionInBooklet',
                operation: 'delete',
                data: { ...relation }
            }
        );

        return this;
    }
    /// end-region public API
}

