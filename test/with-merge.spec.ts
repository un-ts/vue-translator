import { merge } from 'lodash'
import _Vue from 'vue'
import { createLocalVue, mount } from 'vue-test-utils'

import VueTranslator from '../lib'

_Vue.config.productionTip = false
const mockFn = (_Vue.config.warnHandler = jest.fn())

const Vue = createLocalVue()

Vue.use(VueTranslator, {
  locale: 'zh',
  merge,
})

test('merge with no component name', () => {
  const wrapper = mount(
    {
      template: `<div>{{ $t('with_merge') }}</div>`,
      translator: {
        zh: {
          with_merge: '使用合并选项',
        },
        en: {
          with_merge: 'With Merge',
        },
      },
    },
    {
      localVue: Vue,
    },
  )

  expect(mockFn).toBeCalled()
  expect(wrapper.element.innerHTML).toBe('使用合并选项')
  Vue.translator.locale = 'en'
  wrapper.update()
  expect(wrapper.element.innerHTML).toBe('With Merge')
})
