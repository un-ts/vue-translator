import Vue from 'vue'

import { createTranslator } from '../lib'

Vue.config.productionTip = false
const mockFn = (Vue.config.warnHandler = jest.fn())

test('should warn on no translations', () => {
  createTranslator('zh')
  expect(mockFn).toBeCalled()
})
