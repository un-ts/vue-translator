// tslint:disable-next-line no-unused-variable
import Vue, { VueConstructor } from 'vue'

import { Translations, createTranslator } from './translator'

export * from './translator'

export interface TranslatorOptions {
  locale: string
  translations: Translations
}

export default ($Vue: VueConstructor, options: TranslatorOptions) => {
  const defaultTranslator = createTranslator(
    options.locale,
    options.translations,
  )

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
