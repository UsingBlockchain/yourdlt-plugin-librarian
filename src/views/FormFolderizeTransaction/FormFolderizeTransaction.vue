<template>
  <div>
    <FormWrapper ref="observer" class="folderize-transaction-form-wrapper" :whitelisted="true" slim>
      <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
        <form class="form-container mt-3" onsubmit="event.preventDefault()" autocomplete="off">
          <FormRow>
            <template v-slot:label> {{ 'Booklet' }}: </template>
            <template v-slot:inputs>
              <ValidationProvider
                v-slot="{ errors }"
                mode="lazy"
                vid="bookletName"
                :name="'bookletName'"
                :rules="validationRules.bookletName"
                tag="div"
                class="inputs-container items-container"
              >
                <ErrorTooltip :errors="errors">
                  <select name="bookletName" v-model="formItems.bookletName">
                    <option value="">Please select</option>
                    <option
                      v-for="(booklet, index) in booklets"
                      :key="index"
                      :value="booklet.name"
                    >{{ booklet.name }}</option>
                  </select>
                </ErrorTooltip>
              </ValidationProvider>
            </template>
          </FormRow>
          <FormRow>
            <template v-slot:inputs>
              <div class="align-right">
                <button
                    class="button-style inverted-button pl-2 pr-2"
                    type="submit"
                    :disabled="isButtonDisabled"
                    @click="handleSubmit(onSubmit)"
                >
                  {{ 'Save' }}
                </button>
              </div>
            </template>
          </FormRow>
        </form>
      </ValidationObserver>
    </FormWrapper>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { Filters } from '@dhealth/wallet-api-bridge';
import { ErrorTooltip, FormRow, FormWrapper } from '@dhealth/wallet-components';

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    ErrorTooltip,
    FormWrapper,
    FormRow,
  },
})
export default class FormFolderizeTransaction extends Vue {

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
   * Validation rules
   * @var {[key: string]: {required: boolean, regex: string}}
   */
  public validationRules = {
    bookletName: {
      required: true,
      regex: '^(?!\\s*$).+',
    },
  };

  /**
   * Form fields
   * @var {[key:string]: any}
   */
  public formItems = {
    bookletName: '',
    transactionIndex: -1
  };

  /**
   * Type the ValidationObserver refs
   * @type {{observer: InstanceType<typeof ValidationObserver>}}
   */
  public $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
  }

  /**
   * Whether the submit button is disabled.
   * @var {boolean}
   */
  public get isButtonDisabled(): boolean {
    return !this.formItems.bookletName.trim() || this.formItems.transactionIndex < 0;
  }

  /// region component methods
  public async created() {
    this.formItems.transactionIndex = this.transaction.index;
  }

  /**
   * Submit action forward emitted
   * @return {void}
   */
  public onSubmit() {
    this.$emit('submit', this.formItems);
  }

  /**
   * Helper method to strip HTML tags (sanitize) from inputs.
   * @return {void}
   */
  public stripTagsInputs() {
    this.formItems.bookletName = Filters.stripTags(this.formItems.bookletName);
  }
}
</script>

<style lang="less" scoped>
@import './FormFolderizeTransaction.less';
</style>
