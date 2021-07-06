/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
// internal dependencies
import { Generator } from './Generator';
import { AddressShortener, UInt64Parser } from '../Helpers';
 
/**
 * @class {AccountMetadata}
 * @description This class defines rules for natural language
 * generators depending on ACCOUNT METADATA transactions.
 */
export class AccountMetadata extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return 'Identity metadata';
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
        const address = AddressShortener(this.transaction.targetAddress.address);
        const scopedKey = UInt64Parser(this.transaction.scopedMetadataKey);
        const value = this.transaction.value;
        return `attached metadata "${scopedKey.toHex()}" to identity ${address} with a value of "${value}"`;
    }
    /// end-region abstract methods
}