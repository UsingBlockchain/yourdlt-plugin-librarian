/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
import Vue, { VueConstructor } from 'vue';

// internal dependencies
import { BookletModel } from "./models/BookletModel";

// child components
// @ts-ignore
import Library from "@/views/Library/Library.vue";

/// region components library
const components: { [s: string]: VueConstructor } = {
  Library,
};

export const registerComponents = (): { [s: string]: VueConstructor } => {
  Object.keys(components).forEach((k) => Vue.component(k, components[k]));
  return components;
}

// export {
//   Library,
// };
/// end-region components library

/// region installable plugin
export default {

  routes: [
    {
      path: "/librarian",
      name: "librarian.dashboard",
      meta: {
        protected: true,
        title: "My libraries",
      },
      // @ts-ignore
      component: () => import("@/views/Library/Library.vue"),
      props: false,
    },
  ],

  components,

  storages: [
    {
      storageKey: "librarian.booklets",
      model: BookletModel,
      description: "Stores individual booklets to hold tagged entities.",
    },
  ],

  settings: [{ enableNotifications: true }],

  permissions: [
    {
      name: "librarian.readTransactions",
      type: "getter",
      target: "transaction/transactions",
      description:
        "This permissions is requested to fetch transactions for the active account.",
    },
    {
      name: "librarian.readMosaics",
      type: "getter",
      target: "mosaic/holdMosaics",
      description:
        "This permissions is requested to fetch mosaic balances for the active account.",
    },
  ]
};
/// end-region installable plugin
