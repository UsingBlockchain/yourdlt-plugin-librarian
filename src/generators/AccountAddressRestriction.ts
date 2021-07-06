/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
import { AddressRestrictionFlag } from 'symbol-sdk';

// internal dependencies
import { Generator } from './Generator';
import { AddressShortener } from '../Helpers';
 
/**
 * @class {AccountAddressRestriction}
 * @description This class defines rules for natural language
 * generators depending on ACCOUNT ADDRESS RESTRICTION transactions.
 */
export class AccountAddressRestriction extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return `Co-contractor filters`;
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
        const addedAddresses = this.transaction.restrictionAdditions.map(
            a => AddressShortener(a.address)
        );

        const deletedAddresses = this.transaction.restrictionDeletions.map(
            a => AddressShortener(a.address)
        );

        let messageParts = []
        switch (this.transaction.restrictionFlags) {
        case AddressRestrictionFlag.AllowIncomingAddress:
            if (addedAddresses.length) {
                messageParts.push(`added address(es) ${addedAddresses.join(', ')} to the whitelist for incoming transactions`);
            }
            if (deletedAddresses.length) {
                messageParts.push(`removed address(es) ${deletedAddresses.join(', ')} from the whitelist for incoming transactions`);
            }
            break;
        case AddressRestrictionFlag.AllowOutgoingAddress:
            if (addedAddresses.length) {
                messageParts.push(`added address(es) ${addedAddresses.join(', ')} to the whitelist for outgoing transactions`);
            }
            if (deletedAddresses.length) {
                messageParts.push(`removed address(es) ${deletedAddresses.join(', ')} from the whitelist for outgoing transactions`);
            }
            break;
        case AddressRestrictionFlag.BlockIncomingAddress:
            if (addedAddresses.length) {
                messageParts.push(`added address(es) ${addedAddresses.join(', ')} to the blacklist for incoming transactions`);
            }
            if (deletedAddresses.length) {
                messageParts.push(`removed addresses ${deletedAddresses.join(', ')} from the blacklist for incoming transactions`);
            }
            break;
        case AddressRestrictionFlag.BlockOutgoingAddress:
            if (addedAddresses.length) {
                messageParts.push(`added address(es) ${addedAddresses.join(', ')} to the blacklist for outgoing transactions`);
            }
            if (deletedAddresses.length) {
                messageParts.push(`removed addresses ${deletedAddresses.join(', ')} from the blacklist for outgoing transactions`);
            }
            break;
        }

        return messageParts.join('; ');
    }
    /// end-region abstract methods
}