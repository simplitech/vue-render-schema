const template = `
  <component
    v-if="isComponent"
    :is="is"
    v-model="computedModel"
    v-bind="vBind"
    v-on="vOn"
    @input="$emit('innerInput', $event)"
    ref="innerComponent"
  >
    <slot :builtSchema="vBind"></slot>
  </component>
  <div v-else-if="fieldContent !== undefined && fieldContent !== null" v-html="fieldContent"></div>
`

import { Component, Prop, Vue, Inject } from 'vue-property-decorator'
import { FieldComponent, Schema } from '@simpli/meta-schema'

@Component({ template })
export class RenderSchema extends Vue {
  @Prop({ type: Object, required: true })
  value!: any

  @Prop({ type: Object, required: true })
  schema!: Schema

  @Prop({ type: String, required: true })
  field!: string

  @Inject({ from: 'validator', default: null })
  validator: any

  get computedModel() {
    const { converter } = this.vBind
    if (converter && converter.from) {
      return converter.from(this.value[this.fieldName])
    }

    return this.value[this.fieldName]
  }

  set computedModel(val: any) {
    const { converter } = this.vBind
    if (converter && converter.to) {
      this.value[this.fieldName] = converter.to(val, this.value[this.fieldName])
    } else {
      this.value[this.fieldName] = val
    }
  }

  get fieldContent() {
    const { value, schema, field, attrs, listeners } = this

    return schema.build(value, field, attrs, listeners).get()
  }

  get isComponent() {
    return typeof this.fieldContent === 'object'
  }

  get is() {
    if (this.isComponent) {
      const fieldContent = this.fieldContent as FieldComponent
      return fieldContent.is
    }
  }

  get fieldName(): string {
    if (this.isComponent) {
      const fieldContent = this.fieldContent as FieldComponent
      return fieldContent.name || this.field
    } else {
      return ''
    }
  }

  get vBind() {
    if (this.isComponent) {
      const fieldContent = this.fieldContent as FieldComponent
      return Object.assign({}, fieldContent.bind, this.attrs)
    }
  }

  get vOn() {
    if (this.isComponent) {
      const fieldContent = this.fieldContent as FieldComponent
      return Object.assign({}, fieldContent.on, this.listeners)
    }
  }

  get attrs() {
    return { ...this.$attrs }
  }

  get listeners() {
    const listeners = { ...this.$listeners }
    delete listeners.input
    return listeners
  }

  public get innerComponent() {
    return this.$refs.innerComponent
  }
}
