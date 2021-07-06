/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
import { Address } from 'symbol-sdk';

// internal dependencies
import { Generator } from './Generator';
import { AddressShortener } from '../Helpers';
 
/**
 * @class {AccountKeyLink}
 * @description This class defines rules for natural language
 * generators depending on ACCOUNT KEY LINK transactions.
 */
export class AccountKeyLink extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return 'Stake delegation';
    }

    /**
     * Generate one or more natural language sentences
     * depending on the transaction type as stored in
     * the property `transaction`.
     *
     * @param   {any}   transaction
     * @returns {string} 
     */
    public getSentence(): string {
        const address = AddressShortener(Address.createFromPublicKey(this.transaction.linkedPublicKey, this.transaction.networkType).plain());
        const action = this.transaction.linkAction === 0 ? 'disabled delegation of' : 'delegated';
        return `${action} its stake to ${address}`;
    }
    /// end-region abstract methods
}