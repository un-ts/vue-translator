import { createLocalVue } from '@vue/test-utils'
import _Vue from 'vue'

import VueTranslator from '../lib'

_Vue.config.productionTip = false

const Vue = createLocalVue()

Vue.use(VueTranslator, {
  locale: 'zh',
  filter: true,
})

it('should define filter translate', () => {
  expect(Vue.filter('translate')).toBe(Vue.translator)
})
