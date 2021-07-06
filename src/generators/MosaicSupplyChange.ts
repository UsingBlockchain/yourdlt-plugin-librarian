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
import { UInt64Parser } from '../Helpers'
 
/**
 * @class {MosaicSupplyChange}
 * @description This class defines rules for natural language
 * generators depending on MOSAIC DEFINITION transactions.
 */
export class MosaicSupplyChange extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        const action = this.transaction.action === 0 ? 'burn' : 'issuance';
        return `Asset ${action}`;
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
        const mosaicId = UInt64Parser(this.transaction.mosaicId.id);
        const delta = UInt64Parser(this.transaction.delta);
        const action = this.transaction.action === 0 ? 'removed' : 'issued new';
        return `${action} assets ${mosaicId.toHex()} with a delta of ${delta.compact()}`;
    }
    /// end-region abstract methods
}