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
        :items="listedTransactions"
        :fields="entryFields"
        :page-size="10"
        :disable-headers="false"
        :disable-single-page-links="true"
        :key="entriesTimestamp"
        @on-clicked-row="onClickEntry"
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
        <IconButton
          :icon="'md-add-circle'"
          :disabled="false"
          size="28"
          @click="showBookletFormModal = true" />
      </div>
      <div class="plugin-information">
        <GenericTableDisplay
          class="table-section"
          :items="myBooklets"
          :fields="bookletFields"
          :page-size="10"
          :disable-headers="false"
          :disable-single-page-links="true"
          :key="bookletsTimestamp"
          @on-clicked-row="onClickBooklet"
        >
          <template v-slot:table-title>
            <h1 class="section-title">
              {{ 'Booklets' }}
            </h1>
          </template>
        </GenericTableDisplay>
      </div>
    </div>

    <ModalBookletForm
      v-if="showBookletFormModal"
      :visible="showBookletFormModal"
      :title="'Add a new Booklet'"
      @confirmed="saveBooklet"
      @cancelled="showBookletFormModal = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { GenericTableDisplay, IconButton } from '@yourdlt/wallet-components';

// internal dependencies
import { BookletService } from '../../services/BookletService';
import { TransactionService, FormattedTransaction } from '../../services/TransactionService';

// internal child components
import ModalBookletForm from '../ModalBookletForm/ModalBookletForm.vue';

type ListedTransaction = {
  index: number,
  operation: string,
  description: string
};

@Component({
  components: {
    GenericTableDisplay,
    IconButton,
    ModalBookletForm,
  }
})
export default class Library extends Vue {

  /**
   * Unfiltered list of transactions
   * @var {any[]}
   */
  public allTransactions: FormattedTransaction[];

  /**
   * Filtered/modified list of transactions
   * @var {any[]}
   */
  public listedTransactions: ListedTransaction[];

  /**
   * Unfiltered list of booklets
   * @var {any[]}
   */
  public myBooklets: any[];

  /**
   * Whether currently displaying the modal box
   * @var {boolean}
   */
  public showBookletFormModal: boolean = false;

  /**
   * Timestamp of the last update of entries.
   * @var {number}
   */
  protected lastUpdatedEntries: number = new Date().valueOf();

  /**
   * Timestamp of the last update of booklets.
   * @var {number}
   */
  protected lastUpdatedBooklets: number = new Date().valueOf();

  /// region computed properties
  public get bookletFields(): any[] {
    return [
      { name: 'name', label: 'Name' },
    ];
  }

  public get entryFields(): any[] {
    return [
      { name: 'index', label: '#' },
      { name: 'operation', label: 'Operation' },
      { name: 'description', label: 'Description' },
    ];
  }

  public get entriesTimestamp(): number {
    return this.lastUpdatedEntries;
  }

  public get bookletsTimestamp(): number {
    return this.lastUpdatedBooklets;
  }
  /// end-region computed properties

  /// region component methods
  public async created() {
    console.log("Librarian created");

    const service = new TransactionService();

    // Uses IPC to get data from app Store (Vuex)
    this.allTransactions = (await service.getTransactions()).reduce(
      (acc, transactions) => acc.concat(transactions), []
    );

    // Listed transactions are structured under their parent
    this.listedTransactions = service.sortByParent(this.allTransactions).map(t => ({
      index: t.index,
      operation: t.operation,
      description: t.description,
    }));
    this.lastUpdatedEntries = new Date().valueOf();

    // Uses IPC to get data from app database (localStorage)
    this.myBooklets = (await new BookletService().getBooklets()).map(b => ({
      name: b.name,
    }));
    this.lastUpdatedBooklets = new Date().valueOf();
  }

  public onClickBooklet(index) {
    console.log('Clicked booklet index: ', index);
  }

  public onClickEntry(index) {
    console.log('Clicked entry index: ', index);
  }

  public async saveBooklet(formItems: any) {
    // Uses IPC to store data in app database (localStorage)
    await new BookletService().createBooklet(formItems);
    this.showBookletFormModal = false;
    this.lastUpdatedBooklets = new Date().valueOf();
  }
  /// end-region component methods
}
</script>

<style lang="less" scoped>
@import "./Library.less";
</style>