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
 * @class {MosaicAlias}
 * @description This class defines rules for natural language
 * generators depending on MOSAIC ALIAS transactions.
 */
export class MosaicAlias extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return 'Asset tags';
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
        const namespaceId = UInt64Parser(this.transaction.namespaceId.id);
        return `tagged the asset ${mosaicId.toHex()} with namespace ${namespaceId.toHex()}`;
    }
    /// end-region abstract methods
}