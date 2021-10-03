<template>
  <div>
    <FormWrapper ref="observer" class="booklet-creation-form-wrapper" :whitelisted="true" slim>
      <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
        <form class="form-container mt-3" onsubmit="event.preventDefault()" autocomplete="off">
          <FormRow>
            <template v-slot:label> {{ 'Name' }}: </template>
            <template v-slot:inputs>
              <ValidationProvider
                v-slot="{ errors }"
                mode="lazy"
                vid="name"
                :name="'name'"
                :rules="validationRules.bookletName"
                tag="div"
                class="inputs-container items-container"
              >
                <ErrorTooltip :errors="errors">
                  <input
                    v-model="formItems.name"
                    type="text"
                    name="name"
                    class="input-size input-style"
                    @input="stripTagsInputs"
                  />
                </ErrorTooltip>
              </ValidationProvider>
            </template>
          </FormRow>
          <FormRow>
            <template v-slot:label> {{ 'Tags' }}: </template>
            <template v-slot:inputs>
              <ValidationProvider
                v-slot="{ errors }"
                mode="lazy"
                vid="tags"
                :name="'tags'"
                :rules="validationRules.tags"
                tag="div"
                class="inputs-container items-container"
              >
                <ErrorTooltip :errors="errors">
                  <input
                    v-model="formItems.tags"
                    type="text"
                    name="tags"
                    class="input-size input-style"
                    @input="stripTagsInputs"
                  />
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
import { Component, Vue } from 'vue-property-decorator';
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
export default class FormBookletCreation extends Vue {
  /**
   * Validation rules
   * @var {[key: string]: {required: boolean, regex: string}}
   */
  public validationRules = {
    bookletName: {
      required: true,
      regex: '^(?!\\s*$).+',
    },
    tags: {
      required: true,
      regex: '^(?!\\s*$).+',
    },
  };

  /**
   * Form fields
   * @var {[key:string]: any}
   */
  public formItems = {
    name: '',
    tags: '',
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
    return !this.formItems.name.trim() || !this.formItems.tags.trim();
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
    this.formItems.name = Filters.stripTags(this.formItems.name);
    this.formItems.tags = Filters.stripTags(this.formItems.tags);
  }
}
</script>

<style lang="less" scoped>
@import './FormBookletCreation.less';
</style>
