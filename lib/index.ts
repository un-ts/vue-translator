// tslint:disable-next-line no-unused-variable
import VUE, { VueConstructor } from 'vue'

import {
  Translations,
  Translator,
  TranslatorOptions,
  createTranslator,
} from './translator'

// tslint:disable no-shadowed-variable
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
    translator: Translator
    util: {
      defineReactive: (obj: object, key: string, val: any) => void
      warn: (msg: string) => void
    }
  }
}
// tslint:enable no-shadowed-variable

export * from './translator'

export type VueTranslatorOptions = TranslatorOptions & {
  merge?: (prev: Translations, next: Translations) => Translations
}

const mergedCache: string[] = []

export default (
  $Vue: VueConstructor,
  options: string | VueTranslatorOptions,
) => {
  if (typeof options === 'string') {
    options = {
      locale: options,
    }
  }

  const { defaultLocale, locale, merge, translations = {} } = options

  const defaultTranslator = createTranslator({
    locale,
    translations,
    defaultLocale,
  })

  $Vue.translator = defaultTranslator

  const { warn } = $Vue.util

  $Vue.mixin({
    beforeCreate() {
      const { name, translator } = this.$options

      if (!translator || mergedCache.includes(name)) {
        return
      }

      if (!merge) {
        if (process.env.NODE_ENV === 'development') {
          warn(
            'VueTranslator will not help you to merge translations, please pass your own merge strategy, `lodash.merge` for example',
          )
        }
        return
      }

      merge(translations, translator)

      if (name) {
        mergedCache.push(name)
      } else if (process.env.NODE_ENV === 'development') {
        warn('you should define a unique component name for better cache')
      }
    },
  })

  Object.defineProperty(
    $Vue.prototype,
    '$t',
    process.env.VUE_ENV === 'server'
      ? {
          get() {
            const { translator } = this.$ssrContext

            if (process.env.NODE_ENV === 'development' && !translator) {
              $Vue.util.warn(
                'there is no translator instance on ssrContext, you should register it manually',
              )
            }

            return translator || defaultTranslator
          },
          configurable: process.env.NODE_ENV === 'development',
        }
      : {
          value: defaultTranslator,
          writable: process.env.NODE_ENV === 'development',
        },
  )
}
