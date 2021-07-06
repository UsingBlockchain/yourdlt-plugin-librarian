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
import { AddressShortener } from '../Helpers';
 
/**
 * @class {MultisigAccountModification}
 * @description This class defines rules for natural language
 * generators depending on MULTISIG MODIFICATION transactions.
 */
export class MultisigAccountModification extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return 'Multiparty rules';
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
        const addedCosigners = this.transaction.addressAdditions.map(
            a => AddressShortener(a.address)
        );

        const deletedCosigners = this.transaction.addressDeletions.map(
            a => AddressShortener(a.address)
        );

        return `updated multiparty rules adding ${addedCosigners.length} cosigner(s) and removing ${deletedCosigners.length} cosigner(s)`;
    }
    /// end-region abstract methods
}