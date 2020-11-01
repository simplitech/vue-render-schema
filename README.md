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

## Overriding
You can always override a property on `render-schema` declaration. So following the previous example, if you declare your render-schema like this:
```html
<render-schema
  v-model="myModel"
  :schema="mySchema"
  field="title"
  label="overriding label"
  anotherProp="something here"
/>
```
The output component will be this:
```html
<my-component v-model="myModel.title" label="overriding label" class="my-class" anotherProp="something here" />
```

## Using converters
To avoid having to make the same getters/setters or computed properties multiple times you can declare a special property
for conversion. Just make a converter object like this: 
```javascript
myConverter = {
  from: function(val) {
    return String(val)
  },
  to: function(val) {
    return Number(val)
  }
}
```

And use it on schema:
```javascript
class MySchema extends Schema {
  readonly fieldSet: FieldSet<MyModel> = {
    age: (schema): FieldComponent => ({
      is: MyComponent,
      bind: {
        converter: myConverter,
        class: 'my-class',
      },
    }),
  }
}
```
The output component will be something like this:
```html
<my-component :value="myConverter.from(myModel.title)" @input="myModel.title = myConverter.to($event)" label="TITLE" class="my-class" />
```
