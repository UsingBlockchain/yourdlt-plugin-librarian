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
  <div class="modal-folderize-form-wrapper">
    <Modal v-model="show" :title="title" :transfer="false" :footer-hide="true">
      <div class="container">
        <div class="body-text">
          <p>Use the form below to organize transactions in booklets. Please, select a booklet and the transaction will be added to it.</p>
        </div>
        <hr class="separator" />
        <div class="body-text">
          <FormFolderizeTransaction
            :booklets="booklets"
            :transaction="transaction"
            @submit="confirm" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// internal child components
import FormFolderizeTransaction from '../FormFolderizeTransaction/FormFolderizeTransaction.vue';

@Component({
  components: { FormFolderizeTransaction }
})
export default class ModalFolderizeForm extends Vue {
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
   * The transaction being organized
   * @type {any}
   */
  @Prop({ default: undefined }) transaction: any;

  /**
   * The available booklets
   * @type {any[]}
   */
  @Prop({ default: [] }) booklets: any[];

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

  public async confirm(formItems: any) {
    if (this.performingUpdate) {
      return;
    }

    this.performingUpdate = true;

    return await new Promise((resolve, reject) => {
      this.$emit('confirmed', formItems);
      this.closeModal();
      return resolve(true);
    }).finally(() => (this.performingUpdate = false));
  }

  public cancel() {
    this.$emit('cancelled');
    this.closeModal();
  }

  private closeModal() {
    this.show = false;
  }
}
</script>

<style lang="less" scoped>
@import './ModalFolderizeForm.less';
</style>
