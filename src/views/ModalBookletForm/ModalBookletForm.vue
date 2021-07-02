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
  <div class="modal-booklet-form-wrapper">
    <Modal v-model="show" :title="title" :transfer="false" :footer-hide="true">
      <div class="container">
        <div class="body-text">
          <p>Use the form below to describe your new booklet. The tags field can hold a comma-separated list of tags.</p>
        </div>
        <hr class="separator" />
        <div class="body-text">
          <FormBookletCreation @submit="confirm" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// internal child components
import FormBookletCreation from '../FormBookletCreation/FormBookletCreation.vue';

@Component({
  components: { FormBookletCreation }
})
export default class ModalBookletForm extends Vue {
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
@import './ModalBookletForm.less';
</style>
