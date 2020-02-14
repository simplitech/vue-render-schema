# Vue-Render-Schema

Vue component to conditionally apply the behaviour described by [Meta-Schema](https://github.com/simplitech/meta-schema)

# Install
```
npm i @simpli/vue-render-schema @simpli/meta-schema
```

## Import
```typescript
import Vue from 'vue'
import VueRenderSchema from '@simpli/vue-render-schema'

Vue.use(VueRenderSchema)
```

## Usage
```html
<render-schema
  v-model="myModel"
  :schema="mySchema"
  field="title"
/>
```
On code:
```typescript
data() {
  return {
    myModel = new MyModel()
    mySchema = new MySchema()
  }
}
```
And as documented on [Meta-Schema](https://github.com/simplitech/meta-schema), define your model and schema like this:
```typescript
class MyModel {
  title: string | null = null
  description: string | null = null
}

class MySchema extends Schema {
  // create a function to translate your field names, 
  // my translation only put it on uppercase
  translateFrom = (fieldName: string) => fieldName.toUpperCase()

  // declare the fieldSet
  readonly fieldSet: FieldSet<MyModel> = {
    // our first field is 'title', is a FieldComponent
    title: (schema): FieldComponent => ({
      // on "is" you may put the component class to render the fieldset
      is: MyComponent,
      // on "bind" you can put any prop
      bind: {
        label: this.translateFrom(schema.fieldName),
        class: 'my-class',
      },
    }),
  }
}
```
Then the component will be rendered like this:
```html
<my-component label="TITLE" class="my-class" />
```
