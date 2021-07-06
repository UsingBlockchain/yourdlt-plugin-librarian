/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
import { MosaicRestrictionFlag } from 'symbol-sdk';

// internal dependencies
import { Generator } from './Generator';
import { UInt64Parser } from '../Helpers';
 
/**
 * @class {AccountMosaicRestriction}
 * @description This class defines rules for natural language
 * generators depending on ACCOUNT MOSAIC RESTRICTION transactions.
 */
export class AccountMosaicRestriction extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return `Asset filters`;
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
        const addedMosaics = this.transaction.restrictionAdditions.map(
            a => UInt64Parser(a.id).toHex()
        );

        const deletedMosaics = this.transaction.restrictionDeletions.map(
            a => UInt64Parser(a.id).toHex()
        );

        let messageParts = []
        switch (this.transaction.restrictionFlags) {
        case MosaicRestrictionFlag.AllowMosaic:
            if (addedMosaics.length) {
                messageParts.push(`added asset(s) ${addedMosaics.join(', ')} to the assets whitelist`);
            }
            if (deletedMosaics.length) {
                messageParts.push(`removed asset(s) ${deletedMosaics.join(', ')} from the assets whitelist`);
            }
            break;
        case MosaicRestrictionFlag.BlockMosaic:
            if (addedMosaics.length) {
                messageParts.push(`added asset(s) ${addedMosaics.join(', ')} to the assets blacklist`);
            }
            if (deletedMosaics.length) {
                messageParts.push(`removed asset(s) ${deletedMosaics.join(', ')} from the assets blacklist`);
            }
            break;
        }

        return messageParts.join('; ');
    }
    /// end-region abstract methods
}