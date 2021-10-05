/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
import { UInt64 } from '@dhealth/sdk';

// internal dependencies
import { Generator } from './Generator';
import { AddressShortener, UInt64Parser } from '../Helpers';

/**
* @class {SecretLock}
* @description This class defines rules for natural language
* generators depending on SECRET LOCK transactions.
*/
export class SecretLock extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return 'Secret lock';
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
        const assetEntry = this.transaction.mosaic
        const assetAmount = UInt64Parser(assetEntry.amount);
        const assetId = UInt64Parser(assetEntry.id.id);

        const recipient = AddressShortener(this.transaction.recipientAddress.address);
        const duration = UInt64Parser(this.transaction.duration);
        return `locked ${assetAmount.compact()} ${assetId.toHex()} for recipient ${recipient} behind a secret with a duration of ${duration.compact()} block(s)`;
    }
    /// end-region abstract methods
} 