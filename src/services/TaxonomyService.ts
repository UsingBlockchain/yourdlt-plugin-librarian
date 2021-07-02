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
import { Transaction } from '@yourdlt/wallet-api-bridge';
import { Address } from 'symbol-sdk';

// internal dependencies
import { AddressShortener } from '../Helpers';

/**
 * @class {TaxonomyService}
 * @description This service class provides methods to handle transaction
 * groups and descriptions.
 */
export class TaxonomyService {
    /// region public API
    /**
     * Construct a taxonomy service around an optional \a $app
     * Vue component/parent component.
     *
     * @param {Vue} $app
     */
    public constructor(protected readonly $app?: Vue) {}

    /**
     * This method returns a human readable operation descriptor
     * depending on the \a transaction type.
     *
     * @param   {any}   transaction 
     * @returns {string}
     */
    public getOperation(transaction: any, aggregateHash?: string): string {
        const prefix = !!aggregateHash ? '(Embedded) ' : '';

        switch (transaction.type) {
        case Transaction.Transfer: return prefix + 'Asset Transfer';
        case Transaction.NamespaceRegistration: return prefix + 'Distributed Name Creation';
        case Transaction.AddressAlias: return prefix + 'Address Tag';
        case Transaction.MosaicAlias: return prefix + 'Asset Tag'
        case Transaction.MosaicDefinition: return prefix + 'Asset Creation';
        case Transaction.MosaicSupplyChange: return prefix + 'Asset Issuance';
        case Transaction.MosaicMetadata: return prefix + 'Asset metadata';
        case Transaction.AccountMetadata: return prefix + 'Identity metadata';
        case Transaction.NamespaceMetadata: return prefix + 'Distributed name metadata';
        case Transaction.AggregateComplete: return prefix + 'Multiparty Contract';
        case Transaction.AggregateBonded: return prefix + 'Multiparty Contract';
        case Transaction.MultisigAccountModification: return prefix + 'Multiparty Contract';
        case Transaction.HashLock: return prefix + 'Asset Lock (Anti-SPAM)';
        case Transaction.SecretLock: return prefix + 'Asset Lock (Secret)';
        case Transaction.SecretProof: return prefix + 'Asset Claim (Proof)';
        case Transaction.AccountAddressRestriction: return prefix + 'Collaborators whitelist/blacklist';
        case Transaction.AccountMosaicRestriction: return prefix + 'Account assets whitelist/blacklist';
        case Transaction.AccountOperationRestriction: return prefix + 'Operations whitelist/blacklist';
        case Transaction.MosaicAddressRestriction: return prefix + 'Asset holders whitelist/blacklist';
        case Transaction.MosaicGlobalRestriction: return prefix + 'Asset conditional whitelist/blacklist';
        case Transaction.AccountKeyLink: return prefix + 'Staking key delegation';
        case Transaction.VrfKeyLink: return prefix + 'Cryptographic key delegation';
        case Transaction.VotingKeyLink: return prefix + 'Finalization key delegation';
        case Transaction.NodeKeyLink: return prefix + 'Node key delegation';
        default: return prefix + 'Unknown action';
        }
    }

    /**
     * This method returns a human readabale sentence describing
     * the content of the transaction.
     *
     * @param   {any}   transaction 
     * @returns {string}
     */
    public getDescription(transaction: any, aggregateHash?: string): string {
        // 1. describing main actor ("transaction signer")
        const actor = this.getMainActor(transaction);

        // 2. describing action(s) with transaction content
        const action = this.getMainAction(transaction);

        // 3. describing optional information
        const optionals = this.getOptionalDetails(transaction);

        // join all into a sentence
        return [
            actor,
            action,
            optionals,
        ].join(' ');
    }

    /**
     * This method tries to identify the main actor of a transaction
     * and returns a shortened version of an address.
     *
     * @param   {any}   transaction 
     * @returns {string}
     */
    public getMainActor(transaction: any): string {
        const address = Address.createFromPublicKey(
            transaction.signer.publicKey,
            transaction.networkType,
        ).plain();

        return AddressShortener(address)
    }

    /**
     * This method determines the main action that is executed with
     * a \a transaction.
     *
     * @param   {any}   transaction 
     * @returns {string}
     */
    public getMainAction(transaction: any): string {
        if (Transaction.Transfer === transaction.type) {
            const assetEntry = transaction.mosaics[0];
            const recipient = this.getParticipants(transaction).join('');
            return `sent ${assetEntry.amount} ${assetEntry.id} to ${recipient}`;
        }

       return `signed a digital contract`;
    }

    /**
     * This method determines the main action that is executed with
     * a \a transaction.
     *
     * @param   {any}   transaction 
     * @returns {string}
     */
    public getOptionalDetails(transaction: any): string {
       return '';
    }

    /**
     * This method determines the main action that is executed with
     * a \a transaction.
     *
     * @param   {any}   transaction 
     * @returns {string}
     */
    public getParticipants(transaction: any): string[] {
        if (Transaction.Transfer === transaction.type) {
            return [AddressShortener(transaction.recipientAddress.address)];
        }

        return [];
    }
    /// end-region public API
}

 