/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
import Vue, { VueConstructor } from "vue";

// vee-validate extension
import { extend } from 'vee-validate';
import { digits, excluded, integer, is, is_not, max_value, max, min_value, min, regex, required } from 'vee-validate/dist/rules';
extend('digits', digits);
extend('excluded', excluded);
extend('integer', integer);
extend('is', is);
extend('is_not', is_not);
extend('max_value', max_value);
extend('max', max);
extend('min_value', min_value);
extend('min', min);
extend('regex', regex);
extend('required', required);

// internal dependencies
// child components
import Library from "./views/Library/Library.vue";

/// region components library
const components: { [s: string]: VueConstructor } = {
  Library,
};

export const registerComponents = (): { [s: string]: VueConstructor } => {
  Object.keys(components).forEach((k) => Vue.component(k, components[k]));
  return components;
};
/// end-region components library

/// region installable plugin
export default {
  view: "Library",

  routes: [
    {
      path: "/librarian",
      name: "librarian.dashboard",
      meta: {
        protected: true,
        title: "My libraries",
        hideFromMenu: true,
      },
      // @ts-ignore
      props: false,
      // no-component
    },
  ],

  components,

  storages: [
    {
      storageKey: "librarian.booklets",
      primaryKey: 'id',
      description: "Stores individual booklets to hold tagged entities.",
    },
    {
      storageKey: "librarian.transactionInBooklet",
      primaryKey: 'id',
      description: "Stores transaction to booklet relationships.",
    },
  ],

  settings: [{ enableNotifications: true }],

  permissions: [
    {
      name: "librarian.readBooklets",
      type: "action",
      target: "db/SELECT",
      description:
        "This permission is requested to read booklets for the active account.",
    },
    {
      name: "librarian.createBooklets",
      type: "action",
      target: "db/INSERT",
      description:
        "This permission is requested to store booklets for the active account.",
    },
    {
      name: "librarian.updateBooklets",
      type: "action",
      target: "db/UPDATE",
      description:
        "This permission is requested to update information about booklets for the active account.",
    },
    {
      name: "librarian.deleteBooklets",
      type: "action",
      target: "db/DELETE",
      description:
        "This permission is requested to delete existing booklets for the active account.",
    },
    {
      name: "librarian.readTransactions",
      type: "getter",
      target: "transaction/serializedTransactions",
      description:
        "This permission is requested to fetch transactions for the active account.",
    },
    {
      name: "librarian.readTransactionDetails",
      type: "action",
      target: "transaction/LOAD_TRANSACTION_DETAILS",
      description:
        "This permission is requested to fetch transaction details like embedded transactions.",
    },
    {
      name: "librarian.readMosaics",
      type: "getter",
      target: "mosaic/holdMosaics",
      description:
        "This permission is requested to fetch mosaic balances for the active account.",
    },
  ],
};
/// end-region installable plugin
