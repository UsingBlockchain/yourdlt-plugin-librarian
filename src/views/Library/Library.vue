<!--
/**
 * This file is part of YourDLT Wallet Plugins shared under LGPL-3.0
 * Copyright (C) 2021 Using Blockchain Ltd, Reg No.: 12658136, United Kingdom
 *
 * @package     YourDLT Wallet Plugins
 * @subpackage  Librarian
 * @author      Grégory Saive for Using Blockchain Ltd <greg@ubc.digital>
 * @license     LGPL-3.0
 */
-->
<template>
  <span>library placeholder</span>
</template>

<script>
export default {
  data() {
    return {
      greeting: "Hello, Librarian",
    };
  },

  mounted() {
    console.log("Librarian mounted");
  },

  created() {
    console.log("Librarian created");
  },
};
</script>

<style lang="css" scoped>
span {
  font-weight: 800;
  text-decoration: underline;
}
</style>
