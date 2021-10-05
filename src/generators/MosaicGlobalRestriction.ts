/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
import { MosaicRestrictionType } from '@dhealth/sdk';

// internal dependencies
import { Generator } from './Generator';
import { UInt64Parser } from '../Helpers';

/**
 * @class {MosaicGlobalRestriction}
 * @description This class defines rules for natural language
 * generators depending on MOSAIC GLOBAL RESTRICTION transactions.
 */
export class MosaicGlobalRestriction extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return `Asset conditions`;
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
        const referenceId = UInt64Parser(this.transaction.referenceMosaicId.id);
        const scopedKey = UInt64Parser(this.transaction.restrictionKey);
        const scopedVal = UInt64Parser(this.transaction.newRestrictionValue);
        let operator = '';
        switch (this.transaction.newRestrictionType) {
        case MosaicRestrictionType.EQ: operator = '='; break;
        case MosaicRestrictionType.NE: operator = '!='; break;
        case MosaicRestrictionType.LT: operator = '<'; break;
        case MosaicRestrictionType.LE: operator = '<='; break;
        case MosaicRestrictionType.GT: operator = '>'; break;
        case MosaicRestrictionType.GE: operator = '>='; break;
        }

        return `restricted asset ${mosaicId.toHex()} with reference to ${referenceId.toHex()} using a formula of: "${scopedKey.toHex()} ${operator} ${scopedVal.compact()}"`;
    }
    /// end-region abstract methods
}