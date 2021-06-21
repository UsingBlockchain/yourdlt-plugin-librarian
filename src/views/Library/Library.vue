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
        :items="getEntries()"
        :fields="getEntryFields()"
        :page-size="10"
        :disable-headers="false"
        :disable-single-page-links="true"
        @on-clicked-row="handleEntryClick"
      >
        <template v-slot:table-title>
          <h1 class="section-title">
            {{ 'Entries' }}
          </h1>
        </template>
      </GenericTableDisplay>
    </div>
    <div class="dashboard-right-container">
      <div class="title">
        <span class="title_txt">{{ 'Plugin details' }}</span>
      </div>
      <div class="plugin-information">
        <GenericTableDisplay
          class="table-section"
          :items="getBooklets()"
          :fields="getBookletFields()"
          :page-size="10"
          :disable-headers="false"
          :disable-single-page-links="true"
          @on-clicked-row="handleBookletClick"
        >
          <template v-slot:table-title>
            <h1 class="section-title">
              {{ 'Booklets' }}
            </h1>
          </template>
        </GenericTableDisplay>
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

  public mounted() {
    console.log("Librarian mounted");
  }

  public created() {
    console.log("Librarian created");
  }

  public handleBookletClick(index) {
    console.log('Clicked booklet index: ', index);
  }

  public handleEntryClick(index) {
    console.log('Clicked entry index: ', index);
  }

  public getBooklets(): any[] {
    return [
      {name: 'Bob Coleman', children: 1},
      {name: 'Carol Wiley', children: 1},
      {name: 'Personal data', children: 2}
    ].sort((a, b) => a.name.localeCompare(b.name));
  }

  public getBookletFields(): any[] {
    return [
      { name: 'name', label: 'Name' },
      { name: 'children', label: 'Entries #' },
    ];
  }

  public getEntries(): any[] {
    return [
      {id: 1, operation: 'Asset Transfer', description: 'Alice sent Bob 3 dhealth.dhp'},
      {id: 2, operation: 'Asset Creation', description: 'Alice created 39560015 ninja tokens'},
      {id: 3, operation: 'Block Creation', description: 'Alice harvested block 123'},
      {id: 4, operation: 'Asset Transfer', description: 'Alice sent Carol 5 dhealth.dhp'},
    ].sort((a, b) => b.id - a.id); // sort DESC
  }

  public getEntryFields(): any[] {
    return [
      { name: 'id', label: '#' },
      { name: 'operation', label: 'Operation' },
      { name: 'description', label: 'Description' },
    ];
  }
}
</script>

<style lang="less" scoped>
@import "./Library.less";
</style>