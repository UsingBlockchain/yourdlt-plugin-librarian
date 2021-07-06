/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
import { OperationRestrictionFlag } from 'symbol-sdk';

// internal dependencies
import { Generator } from './Generator';
 
/**
 * @class {AccountOperationRestriction}
 * @description This class defines rules for natural language
 * generators depending on ACCOUNT OPERATION RESTRICTION transactions.
 */
export class AccountOperationRestriction extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return `Operation filters`;
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
        const addedTypes = this.transaction.restrictionAdditions.map(
            a => a //XXX transaction types are number => use generator for "descriptor"?
        );

        const deletedTypes = this.transaction.restrictionDeletions.map(
            a => a //XXX transaction types are number => use generator for "descriptor"?
        );

        let messageParts = []
        switch (this.transaction.restrictionFlags) {
        case OperationRestrictionFlag.AllowOutgoingTransactionType:
            if (addedTypes.length) {
                messageParts.push(`added transaction type(s) ${addedTypes.join(', ')} to the operations whitelist`);
            }
            if (deletedTypes.length) {
                messageParts.push(`removed transaction type(s) ${deletedTypes.join(', ')} from the operations whitelist`);
            }
            break;
        case OperationRestrictionFlag.BlockOutgoingTransactionType:
            if (addedTypes.length) {
                messageParts.push(`added transaction type(s) ${addedTypes.join(', ')} to the operations blacklist`);
            }
            if (deletedTypes.length) {
                messageParts.push(`removed transaction type(s) ${deletedTypes.join(', ')} from the operations blacklist`);
            }
            break;
        }

        return messageParts.join('; ');
    }
    /// end-region abstract methods
}