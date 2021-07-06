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
 * @class {AddressAlias}
 * @description This class defines rules for natural language
 * generators depending on ADDRESS ALIAS transactions.
 */
export class AddressAlias extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return 'Identity tags';
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
        const address = AddressShortener(this.transaction.address.address);
        const namespaceId = UInt64Parser(this.transaction.namespaceId.id);
        return `tagged identity ${address} with namespace ${namespaceId.toHex()}`;
    }
    /// end-region abstract methods
}