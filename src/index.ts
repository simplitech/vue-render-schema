import Vue from 'vue'
import { RenderSchema } from './RenderSchema'
import { Render } from './Render'
import { RenderAnchor } from './RenderAnchor'
import { RenderImage } from './RenderImage'

export default class AwaitWrapper {
  static install() {
    Vue.component('RenderSchema', RenderSchema)
  }
}

export { RenderSchema, Render, RenderAnchor, RenderImage }
