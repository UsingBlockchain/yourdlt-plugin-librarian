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
  <div class="yourdlt-plugin-librarian-container">
    <div class="dashboard-left-container">
      <GenericTableDisplay
        class="table-section"
        :items="[{name: "Greg's first booklet"}, {name: "A random second booklet"}]"
        :fields="[{ name: 'name', label: 'Name' }]"
        :page-size="10"
        :disable-headers="false"
        :disable-single-page-links="true"
        @on-clicked-row="handleClick"
      >
        <template v-slot:table-title>
          <h1 class="section-title">
            {{ $t('Booklets') }}
          </h1>
        </template>
      </GenericTableDisplay>
    </div>
    <div class="dashboard-right-container">
      <div class="title">
        <span class="title_txt">{{ $t('sidebar_title_plugin_details') }}</span>
      </div>
      <div class="plugin-information">
        <span>Sidebar here</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { GenericTableDisplay } from '@yourdlt/wallet-components';

@Component({
  components: {
    GenericTableDisplay,
  }
})
export default class Library extends Vue {

  public greeting: string = "Hello, Librarian";

  public mounted() {
    console.log("Librarian mounted");
  }

  public created() {
    console.log("Librarian created");
  }

  public handleClick(index) {
      console.log('Clicked index: ', index);
  }
}
</script>

<style lang="less" scoped>
@import "./Library.less";
</style>