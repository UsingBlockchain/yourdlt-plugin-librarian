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
 * @class {Transfer}
 * @description This class defines rules for natural language
 * generators depending on TRANSFER transactions.
 */
export class Transfer extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return 'Asset Transfer';
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
        let contentParts = [],
            messageParts = [];

        console.log("Transfer generator got mosaics: ", this.transaction.mosaics);

        // first read the mosaics part
        if ('mosaics' in this.transaction && this.transaction.mosaics.length) {
            const assetEntry = this.transaction.mosaics[0];
            const assetAmount = UInt64Parser(assetEntry.amount);
            const assetId = UInt64Parser(assetEntry.id.id);

            contentParts.push(`sent ${assetAmount.compact()} ${assetId.toHex()}`);
        }

        // then read *message*
        if ('message' in this.transaction
         && 'payload' in this.transaction.message
         && this.transaction.message.payload.length) {
            const messageEntry = this.transaction.message.payload;
            contentParts.push(`attached a message payload of ${messageEntry.length} characters`)
        }

        // catch emptiness
        if (!contentParts.length) {
            contentParts.push(`sent an empty transaction`);
        }

        // and finally recipient
        const recipient = AddressShortener(this.transaction.recipientAddress.address);

        // build the sentence
        messageParts.push(contentParts.join(' and '))
        messageParts.push(`to ${recipient}`);
        return messageParts.join(' ');
    }
    /// end-region abstract methods
} 