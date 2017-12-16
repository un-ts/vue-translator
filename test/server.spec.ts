import { createLocalVue } from 'vue-test-utils'

import VueTranslator, { createTranslator } from '../lib'

process.env.VUE_ENV = 'server'

const Vue = createLocalVue()

Vue.use(VueTranslator, 'zh')

describe('work on server', () => {
  const app = new Vue() as any
  const ssrContext: any = {}

  app.$vnode = {
    ssrContext,
  }

  test('fallback to default translator', () => {
    expect(app.$t).toBe(Vue.translator)
  })

  test('should respect context translator', () => {
    const translator = createTranslator('zh')
    ssrContext.translator = translator
    expect(app.$t).toBe(translator)
  })

  afterAll(() => {
    delete process.env.VUE_ENV
  })
})
