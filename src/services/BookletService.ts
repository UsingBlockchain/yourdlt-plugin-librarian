/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
import Vue from 'vue';
import { PluginBridge, RandomIdGenerator } from '@yourdlt/wallet-api-bridge';

/**
 * @class {BookletService}
 * @description This service class provides methods to handle booklets
 * storage and state changes.
 */
export class BookletService {
    /// region public API
    /**
     * Construct a booklet service around an optional \a $app
     * Vue component/parent component.
     *
     * @param {Vue} $app
     */
    public constructor(protected readonly $app?: Vue) {}

    /**
     * This method reads booklets from the local cache and returns
     * unique booklet entries by `id`.
     *
     * @async
     * @returns {Promise<any[]>}
     */
    public async getBooklets(): Promise<any[]> {
        // use IPC to get data from app database (localStorage)
        const storeBus = await PluginBridge.StoreActionRequest(
            '@yourdlt/plugin-librarian',
            'action',
            'db/SELECT',
            {
                table: 'librarian.booklets',
                operation: 'select',
                data: { /* no-filter */ } 
            }
        )

        console.log("booklets: ", storeBus.response);

        // sort by name (alphabetically)
        return storeBus.response.map(b => b.values).sort(
            (a, b) => a.name.localeCompare(b.name)
        );
    }

    /**
     * This method inserts a new booklet entry in the local cache.
     *
     * @async
     * @param   {any}               formItems
     * @returns {BookletService}
     */
    public createBooklet(formItems: any): BookletService {
        // generates a random id
        const autoId = RandomIdGenerator(8)

        // use IPC to save data in app database (localStorage)
        PluginBridge.StoreActionRequest(
            '@yourdlt/plugin-librarian',
            'action',
            'db/INSERT',
            {
                table: 'librarian.booklets',
                operation: 'insert',
                data: {
                    id: autoId,
                    ...formItems
                } 
            }
        );

        return this;
    }
    /// end-region public API
}

