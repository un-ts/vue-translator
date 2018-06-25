import Vue from 'vue'

export interface Translator<Locale = string> {
  (key: string, params?: any, ignoreNonExist?: boolean): string
  defaultLocale?: Locale
  locale?: Locale
}

export interface Translations {
  [locale: string]: any
}

const LOCALE = 'locale'
const DEFAULT_LOCALE = 'defaultLocale'

const { defineReactive } = Vue.util

let translations: Translations

const getValue = (input: any, key: string): string => {
  key = key.replace(/\[(\d+)\]/g, '.$1')
  let value = input

  key.split('.').some(k => {
    if (!value || typeof value !== 'object') {
      return true
    }

    value = value[k]
  })

  if (typeof value === 'object') {
    // istanbul ignore next
    if (process.env.NODE_ENV === 'development' && value !== null) {
      Vue.util.warn('you are trying to get non-literal value')
    }
    return value && value.toString()
  }

  return value
}

export interface TranslatorOptions {
  locale: string
  translations?: Translations
  defaultLocale?: string
}

export const createTranslator = (
  translatorOptions: string | TranslatorOptions,
): Translator => {
  if (typeof translatorOptions === 'string') {
    translatorOptions = { locale: translatorOptions }
  }

  const {
    locale: instanceLocale,
    translations: instanceTranslations,
    defaultLocale: instanceDefaultLocale,
  } = translatorOptions

  if (instanceTranslations) {
    if (!translations) {
      translations = instanceTranslations
    }
    // istanbul ignore next
    else if (
      process.env.NODE_ENV === 'development' &&
      translations !== instanceTranslations
    ) {
      Vue.util.warn('translations should only be injected once!')
    }
  } else if (process.env.NODE_ENV === 'development' && !translations) {
    Vue.util.warn('translations has not be injected, translator will not work!')
  }

  const instance: Translator = (
    key: string,
    params?: any,
    ignoreNonExist?: boolean,
  ) => {
    const { locale } = instance
    const translation = translations[locale]

    let value = getValue(translation, key)

    if (value === undefined) {
      const { defaultLocale } = instance

      if (defaultLocale && defaultLocale !== locale) {
        const defaultTranslation = translations[defaultLocale]
        value = getValue(defaultTranslation, key)
      }

      if (
        process.env.NODE_ENV === 'development' &&
        value === undefined &&
        !ignoreNonExist
      ) {
        Vue.util.warn(
          `your are trying to get nonexistent key \`${key}\` without default locale fallback`,
        )
      }
    }

    value =
      value &&
      value.replace(/{([^{}]+)}/g, (matched, $0) => getValue(params, $0.trim()))
    return value == null ? key : value
  }

  defineReactive(instance, LOCALE, instanceLocale)
  defineReactive(instance, DEFAULT_LOCALE, instanceDefaultLocale)

  return instance
}
