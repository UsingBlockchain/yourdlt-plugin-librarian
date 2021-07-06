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
import { UInt64Parser } from '../Helpers';
 
/**
 * @class {MosaicMetadata}
 * @description This class defines rules for natural language
 * generators depending on MOSAIC METADATA transactions.
 */
export class MosaicMetadata extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return 'Asset metadata';
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
        const mosaicId = UInt64Parser(this.transaction.targetMosaicId.id);
        const scopedKey = UInt64Parser(this.transaction.scopedMetadataKey);
        const value = this.transaction.value;
        return `attached metadata "${scopedKey.toHex()}" to asset ${mosaicId.toHex()} with a value of "${value}"`;
    }
    /// end-region abstract methods
}