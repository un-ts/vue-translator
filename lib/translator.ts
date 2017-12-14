import Vue from 'vue'

export interface Translator<Locale = string> {
  (key: string, params?: object): string
  locale?: Locale
  create?(DEFAULT_LOCALE?: Locale): Translator
}

export interface StrObj {
  [key: string]: string
}

export interface Translations {
  [locale: string]: StrObj
}

const LOCALE = 'locale'

let translations: Translations

export const createTranslator = (
  instanceLocale: string,
  instanceTranslations?: Translations,
) => {
  if (instanceTranslations) {
    if (process.env.NODE_ENV === 'development' && translations) {
      Vue.util.warn('translations should only be injected once!')
    } else {
      translations = instanceTranslations
    }
  } else if (process.env.NODE_ENV === 'development' && !translations) {
    Vue.util.warn('translations has not be injected, translator will not work!')
  }

  const instance: Translator = (key: string, params?: StrObj) => {
    let value = translations && translations[instance.locale][key]
    value =
      value && value.replace(/{([^{}]+)}/g, (matched, $0) => params[$0.trim()])
    return value == null ? key : value
  }

  instance.create = createTranslator

  Vue.util.defineReactive(instance, LOCALE, instanceLocale)

  return instance
}
