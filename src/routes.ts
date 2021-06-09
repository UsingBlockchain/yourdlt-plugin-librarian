/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
import { AppRoute } from "@yourdlt/wallet-api-bridge";

export const YOURDLT_PLUGIN_ROUTES: AppRoute[] = [
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
];
