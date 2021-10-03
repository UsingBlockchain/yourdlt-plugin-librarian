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
        :disable-rows-grid="true"
        :key="entriesTimestamp"
      >
        <template v-slot:table-title>
          <h1 class="section-title">
            {{ 'Entries' }}
          </h1>
        </template>
        <template v-slot:empty>
          <h2 class="empty-list">No transactions were found for your account.</h2>
        </template>
        <template v-slot:rows="props">
          <GenericTableRow
            v-for="(rowValues, index) in props.items"
            :key="index"
            :row-values="rowValues"
            @on-remove="$emit('on-remove', rowValues)"
            @click="onClickEntry(rowValues.index)"
          />
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
          :items="listedBooklets"
          :fields="bookletFields"
          :page-size="10"
          :disable-headers="false"
          :disable-single-page-links="true"
          :disable-rows-grid="true"
          :key="bookletsTimestamp"
        >
          <template v-slot:table-title>
            <h1 class="section-title">
              {{ 'Booklets' }}
            </h1>
          </template>
          <template v-slot:rows="props">
            <GenericTableRow
              v-for="(rowValues, index) in props.items"
              :key="index"
              :row-values="rowValues"
              @on-remove="$emit('on-remove', rowValues)"
              @click="onClickBooklet(rowValues.name)"
            />
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

    <ModalFolderizeForm
      v-if="showFolderizeFormModal"
      :visible="showFolderizeFormModal"
      :title="'Move transaction to a Booklet'"
      :booklets="listedBooklets"
      :transaction="currentTransaction"
      @confirmed="moveToBooklet"
      @close="showFolderizeFormModal = false"
    />

    <ModalBookletViewer
      v-if="showBookletViewerModal"
      :visible="showBookletViewerModal"
      :title="'Booklet information'"
      :booklet="currentBooklet"
      :transactions="getLinkedTransactions(currentBooklet)"
      @close="showBookletViewerModal = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { GenericTableDisplay, GenericTableRow, IconButton } from '@dhealth/wallet-components';

// internal dependencies
import { BookletService, FormattedBooklet, FormattedRelationship } from '../../services/BookletService';
import { TransactionService, FormattedTransaction } from '../../services/TransactionService';

// internal child components
import ModalBookletForm from '../ModalBookletForm/ModalBookletForm.vue';
import ModalFolderizeForm from '../ModalFolderizeForm/ModalFolderizeForm.vue';
import ModalBookletViewer from '../ModalBookletViewer/ModalBookletViewer.vue';

type ListedTransaction = {
  index: number,
  operation: string,
  description: string
};

type ListedBooklet = {
  name: string,
};

@Component({
  components: {
    GenericTableDisplay,
    GenericTableRow,
    IconButton,
    ModalBookletForm,
    ModalFolderizeForm,
    ModalBookletViewer,
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
   * @var {FormattedBooklet[]}
   */
  public allBooklets: FormattedBooklet[];

  /**
   * Filtered/modified list of booklets
   * @var {ListedBooklet[]}
   */
  public listedBooklets: ListedBooklet[];

  /**
   * Unfiltered list of relationships
   * @var {FormattedRelationship[]}
   */
  public allRelationships: FormattedRelationship[];

  /**
   * Whether currently displaying the FORM modal box
   * @var {boolean}
   */
  public showBookletFormModal: boolean = false;

  /**
   * Whether currently displaying the MOVE modal box
   * @var {boolean}
   */
  public showFolderizeFormModal: boolean = false;

  /**
   * Whether currently displaying the VIEW modal box
   * @var {boolean}
   */
  public showBookletViewerModal: boolean = false;

  /**
   * The current active transaction (after click)
   * @var {FormattedTransaction}
   */
  protected currentTransaction: FormattedTransaction;

  /**
   * The current active booklet (after click)
   * @var {FormattedBooklet}
   */
  protected currentBooklet: FormattedBooklet;

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
      { name: 'bookletName', label: 'Booklet' },
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

    await this.refreshBooklets();
    await this.refreshTransactions();
  }

  public onClickBooklet(name) {
    console.log('Clicked booklet name: ', name);
    this.currentBooklet = this.allBooklets.find(b => b.name === name);
    this.showBookletViewerModal = true;
  }

  public onClickEntry(index) {
    console.log('Clicked entry index: ', index);
    this.currentTransaction = this.allTransactions.find(t => t.index === index);
    this.showFolderizeFormModal = true;
  }

  public async saveBooklet(formItems: any) {
    // Uses IPC to store data in app database (localStorage)
    await new BookletService().createBooklet(formItems);

    // Updates view
    await this.refreshBooklets();
    this.showBookletFormModal = false;
  }

  public async moveToBooklet(formItems: any) {
    // Uses IPC to store data in app database (localStorage)
    await new BookletService().linkTransactionToBooklet(
      this.currentTransaction,
      formItems.bookletName,
    );

    // Updates view
    await this.refreshBooklets();
    await this.refreshTransactions();

    this.showFolderizeFormModal = false;
  }

  public getLinkedTransactions(
    booklet: FormattedBooklet,
  ): FormattedTransaction[] {
    const relations = this.allRelationships.filter(r => r.bookletId === booklet.id);
    const hashes = relations.map(r => r.transactionHash);

    return this.allTransactions.filter(
      t => hashes.includes(t.transactionHash)
    );
  }

  public getLinkedBookletName(
    transaction: FormattedTransaction,
  ): string {
    const relation = this.allRelationships.find(
      r => r.transactionHash === transaction.transactionHash
    );

    if (!! relation) {
      const bookletId = relation.bookletId;
      const booklet = this.allBooklets.find(b => b.id === bookletId);
      return booklet.name;
    }

    return 'Uncategorized';
  }
  /// end-region component methods

  /// region private API
  private async refreshBooklets() {
    const bkService = new BookletService();

    // Uses IPC to get data from app database (localStorage)
    this.allBooklets = await bkService.getBooklets();
    this.allRelationships = await bkService.getRelationships();

    // Formats listed booklets
    this.listedBooklets = this.allBooklets.map(b => ({
      name: b.name,
    }));
    this.lastUpdatedBooklets = new Date().valueOf();
  }

  private async refreshTransactions() {
    // defers main functionality internally
    const txService = new TransactionService();

    // Uses IPC to get data from app Store (Vuex)
    this.allTransactions = (await txService.getTransactions()).reduce(
      (acc, transaction) => acc.concat(transaction), []
    ).map((t, index) => ({ ...t, index }));

    // Listed transactions are structured under their parent
    this.listedTransactions = txService.sortByParent(this.allTransactions).map(t => ({
      index: t.index,
      operation: t.operation,
      description: t.description,
      bookletName: this.getLinkedBookletName(t)
    }));
    this.lastUpdatedEntries = new Date().valueOf();
  }
  /// end-region private API
}
</script>

<style lang="less" scoped>
@import "./Library.less";
</style>