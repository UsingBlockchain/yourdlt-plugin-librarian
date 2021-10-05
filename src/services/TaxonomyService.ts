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
import { Transaction } from '@dhealth/wallet-api-bridge';
import { Address } from '@dhealth/sdk';

// internal dependencies
import { AddressShortener } from '../Helpers';
import { Generator } from '../generators/Generator';
import { BasicGenerator } from '../generators/BasicGenerator';
import { Transfer as TransferGenerator } from '../generators/Transfer';
import { NamespaceRegistration as NamespaceRegistrationGenerator } from '../generators/NamespaceRegistration';
import { NamespaceMetadata as NamespaceMetadataGenerator } from '../generators/NamespaceMetadata';
import { MosaicDefinition as MosaicDefinitionGenerator } from '../generators/MosaicDefinition';
import { MosaicSupplyChange as MosaicSupplyChangeGenerator } from '../generators/MosaicSupplyChange';
import { MosaicAlias as MosaicAliasGenerator } from '../generators/MosaicAlias';
import { MosaicMetadata as MosaicMetadataGenerator } from '../generators/MosaicMetadata';
import { AccountMetadata as AccountMetadataGenerator } from '../generators/AccountMetadata';
import { AddressAlias as AddressAliasGenerator } from '../generators/AddressAlias';
import { AggregateComplete as AggregateCompleteGenerator } from '../generators/AggregateComplete';
import { AggregateBonded as AggregateBondedGenerator } from '../generators/AggregateBonded';
import { MultisigAccountModification as MultisigAccountModificationGenerator } from '../generators/MultisigAccountModification';
import { HashLock as HashLockGenerator } from '../generators/HashLock';
import { SecretLock as SecretLockGenerator } from '../generators/SecretLock';
import { SecretProof as SecretProofGenerator } from '../generators/SecretProof';
import { AccountAddressRestriction as AccountAddressRestrictionGenerator } from '../generators/AccountAddressRestriction';
import { AccountMosaicRestriction as AccountMosaicRestrictionGenerator } from '../generators/AccountMosaicRestriction';
import { AccountOperationRestriction as AccountOperationRestrictionGenerator } from '../generators/AccountOperationRestriction';
import { MosaicAddressRestriction as MosaicAddressRestrictionGenerator } from '../generators/MosaicAddressRestriction';
import { MosaicGlobalRestriction as MosaicGlobalRestrictionGenerator } from '../generators/MosaicGlobalRestriction';
import { AccountKeyLink as AccountKeyLinkGenerator } from '../generators/AccountKeyLink';
import { VrfKeyLink as VrfKeyLinkGenerator } from '../generators/VrfKeyLink';
import { VotingKeyLink as VotingKeyLinkGenerator } from '../generators/VotingKeyLink';
import { NodeKeyLink as NodeKeyLinkGenerator } from '../generators/NodeKeyLink';

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
        return this.getGenerator(transaction).getDescriptor(aggregateHash);
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
        console.log("Sending tx through generator: ", transaction);
        return this.getGenerator(transaction).getSentence();
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
    /// end-region public API

    /// region protected API
    protected getGenerator(transaction: any): Generator {
        if (Transaction.Transfer === transaction.type) return new TransferGenerator(transaction);
        else if (Transaction.NamespaceRegistration === transaction.type) return new NamespaceRegistrationGenerator(transaction);
        else if (Transaction.AddressAlias === transaction.type) return new AddressAliasGenerator(transaction);
        else if (Transaction.MosaicAlias === transaction.type) return new MosaicAliasGenerator(transaction);
        else if (Transaction.MosaicDefinition === transaction.type) return new MosaicDefinitionGenerator(transaction);
        else if (Transaction.MosaicSupplyChange === transaction.type) return new MosaicSupplyChangeGenerator(transaction);
        else if (Transaction.MosaicMetadata === transaction.type) return new MosaicMetadataGenerator(transaction);
        else if (Transaction.AccountMetadata === transaction.type) return new AccountMetadataGenerator(transaction);
        else if (Transaction.NamespaceMetadata === transaction.type) return new NamespaceMetadataGenerator(transaction);
        else if (Transaction.AggregateComplete === transaction.type) return new AggregateCompleteGenerator(transaction);
        else if (Transaction.AggregateBonded === transaction.type) return new AggregateBondedGenerator(transaction);
        else if (Transaction.MultisigAccountModification === transaction.type) return new MultisigAccountModificationGenerator(transaction);
        else if (Transaction.HashLock === transaction.type) return new HashLockGenerator(transaction);
        else if (Transaction.SecretLock === transaction.type) return new SecretLockGenerator(transaction);
        else if (Transaction.SecretProof === transaction.type) return new SecretProofGenerator(transaction);
        else if (Transaction.AccountAddressRestriction === transaction.type) return new AccountAddressRestrictionGenerator(transaction);
        else if (Transaction.AccountMosaicRestriction === transaction.type) return new AccountMosaicRestrictionGenerator(transaction);
        else if (Transaction.AccountOperationRestriction === transaction.type) return new AccountOperationRestrictionGenerator(transaction);
        else if (Transaction.MosaicAddressRestriction === transaction.type) return new MosaicAddressRestrictionGenerator(transaction);
        else if (Transaction.MosaicGlobalRestriction === transaction.type) return new MosaicGlobalRestrictionGenerator(transaction);
        else if (Transaction.AccountKeyLink === transaction.type) return new AccountKeyLinkGenerator(transaction);
        else if (Transaction.VrfKeyLink === transaction.type) return new VrfKeyLinkGenerator(transaction);
        else if (Transaction.VotingKeyLink === transaction.type) return new VotingKeyLinkGenerator(transaction);
        else if (Transaction.NodeKeyLink === transaction.type) return new NodeKeyLinkGenerator(transaction);

        return new BasicGenerator(transaction);
    }
    /// end-region protected API
}

 