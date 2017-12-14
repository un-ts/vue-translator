import { Translator } from '../lib/translator'

declare module 'vue/types/vue' {
  interface Vue {
    $t: Translator
  }

  interface VueConstructor {
    util: {
      defineReactive: (obj: object, key: string, val: any) => void
      warn: (msg: string) => void
    }
  }
}
