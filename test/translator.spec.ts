import Vue from 'vue'

import { createTranslator } from '../lib'

Vue.config.productionTip = false
const mockFn = (Vue.config.warnHandler = jest.fn())

describe('translator instance', () => {
  const translator = createTranslator({
    locale: 'zh',
    translations: {
      zh: {
        obj_param: '{ a } 加 { b } 等于 { sum }',
        nested: {
          content: '嵌套内容',
        },
      },
      en: {
        fallback: 'Fallback',
        obj_param: '{ a } plus { b } equals { sum }',
        nested: {
          content: 'Nested Content',
        },
      },
    },
    defaultLocale: 'en',
  })

  it('should fallback to default locale', () => {
    expect(translator('fallback')).toBe('Fallback')
    expect(translator('nonexist', null)).toBe('nonexist')
    expect(mockFn).toBeCalled()
  })

  it('should work with object param', () => {
    const objParam = { a: 1, b: 2, sum: 3 }
    expect(translator('obj_param', objParam)).toBe('1 加 2 等于 3')
    translator.locale = 'en'
    expect(translator('obj_param', objParam)).toBe('1 plus 2 equals 3')
  })

  it('should work with nested param', () => {
    expect(translator('nested.content')).toBe('Nested Content')
    translator.locale = 'zh'
    expect(translator('nested.content')).toBe('嵌套内容')
  })

  it('should return string value', () => {
    expect(translator('nested')).toBe('[object Object]')
    expect(mockFn).toBeCalled()
  })
})
