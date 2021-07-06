/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
/**
 * @class {Generator}
 * @description This abstract class defines rules for natural
 * language generators depending on transaction type.
 */
export abstract class Generator {
    /// region public API
    /**
     * Construct a generator around a \a transaction
     * object.
     *
     * @param {any} transaction
     */
    public constructor(protected readonly transaction: any) {}
    /// end-region public API

    /**
     * Generate one natural language prefix.
     * The prefix will be filled if the optional
     * \a aggregateHash is non-empty.
     *
     * @param   {string}    aggregateHash
     * @returns {string} 
     */
    public getPrefix(aggregateHash?: string): string {
        return !!aggregateHash && aggregateHash.length ? '(Embedded) ' : '';
    }

    /**
     * Generate one natural language topic.
     * Optionally, an aggregate hash can be
     * passed in \a aggregateHash to prefix
     * the topic with a marker.
     *
     * @param   {string}    aggregateHash
     * @returns {string} 
     */
    public getDescriptor(aggregateHash?: string): string {
        return this.getPrefix(aggregateHash) + this.topic;
    }

    /// region abstract methods
    /**
     * Generate one natural language topic.
     *
     * @returns {string} 
     */
    public abstract get topic(): string;

    /**
     * Generate one or more natural language sentences
     * depending on the transaction type as stored in
     * the property `transaction`.
     *
     * @returns {string} 
     */
    public abstract getSentence(): string;
    /// end-region abstract methods
} 