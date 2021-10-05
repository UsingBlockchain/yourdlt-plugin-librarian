/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
import { Address } from '@dhealth/sdk';

// internal dependencies
import { Generator } from './Generator';
import { AddressShortener } from '../Helpers';
 
/**
 * @class {NodeKeyLink}
 * @description This class defines rules for natural language
 * generators depending on VOTING KEY LINK transactions.
 */
export class NodeKeyLink extends Generator {
    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public get topic(): string {
        return 'Node delegation';
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
        console.log("linkedPublicKey: ", this.transaction.linkedPublicKey);
        console.log("NodeKeyLink tx: ", this.transaction);
        const address = AddressShortener(Address.createFromPublicKey(this.transaction.linkedPublicKey, this.transaction.networkType).plain());
        const action = this.transaction.linkAction === 0 ? 'disabled' : 'activated';
        return `${action} harvesting capacity for node ${address}`;
    }
    /// end-region abstract methods
}