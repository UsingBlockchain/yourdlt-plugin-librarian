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
  <div class="modal-booklet-view-wrapper">
    <Modal v-model="show" :title="title" :transfer="false" :footer-hide="true">
      <div class="container">
        <div class="body-text">
          <p>Displaying information about booklet: "<strong>{{ booklet.name }}</strong>".</p>
        </div>
        <hr class="separator" />
        <div class="body-text">
          <p>ID: {{ booklet.id }}</p>
          <p>Name: {{ booklet.name }}</p>
          <p>Tags: {{ tags }}</p>
          <p>Transactions: {{ transactions.length }}</p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// internal dependencies
import { FormattedBooklet } from '../../services/BookletService';
import { FormattedTransaction } from '../../services/TransactionService';

@Component({
  components: {}
})
export default class ModalBookletViewer extends Vue {
  /**
    * Modal title
    * @type {string}
    */
  @Prop({ default: '' }) title: string;

  /**
    * Modal visibility state from parent
    * @type {string}
    */
  @Prop({ default: false }) visible: boolean;

  /**
   * The available booklets
   * @type {FormattedBooklet}
   */
  @Prop({ default: null }) booklet: FormattedBooklet;

  /**
   * The available transactions
   * @type {FormattedTransaction[]}
   */
  @Prop({ default: [] }) transactions: FormattedTransaction[];

  /**
   * Whether currently performing an update or not.
   * @var {boolean}
   */
  private performingUpdate: boolean = false;

  /**
   * Internal visibility state
   * @type {boolean}
   */
  public get show(): boolean {
    return this.visible;
  }

  /**
   * Emits close event
   */
  public set show(val) {
    if (!val) {
      this.$emit('close');
    }
  }

  /**
   * Getter for the booklet tags.
   *
   * @var {string}
   */
  public get tags(): string {
    if (! this.booklet || ! this.booklet.tags || ! this.booklet.tags.length) {
      return '';
    }

    return this.booklet.tags;
  }
}
</script>

<style lang="less" scoped>
@import './ModalBookletViewer.less';
</style>
