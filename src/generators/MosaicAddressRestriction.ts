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
 * @class {MosaicAddressRestriction}
 * @description This class defines rules for natural language
 * generators depending on MOSAIC ADDRESS RESTRICTION transactions.
 */
export class MosaicAddressRestriction extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return `Asset holder filters`;
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
        const scopedKey = UInt64Parser(this.transaction.restrictionKey);
        const scopedVal = UInt64Parser(this.transaction.newRestrictionValue);
        const target = AddressShortener(this.transaction.targetAddress.address);
        return `attached restriction key "${scopedKey.toHex()}" to asset ${mosaicId.toHex()} with a value of "${scopedVal.toHex()} for address ${target}"`;
    }
    /// end-region abstract methods
}