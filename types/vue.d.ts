import VUE from 'vue'

import { Translations, Translator } from '../lib/translator'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends VUE> {
    translator?: Translations
  }
}

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
