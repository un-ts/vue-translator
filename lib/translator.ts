import Vue from 'vue'

export interface Translator<Locale = string> {
  (key: string, params?: object): string
  defaultLocale?: Locale
  locale?: Locale
}

export interface StrObj {
  [key: string]: string
}

export interface Translation {
  [key: string]: string | Translation
}

export interface Translations {
  [locale: string]: Translation
}

const LOCALE = 'locale'
const DEFAULT_LOCALE = 'defaultLocale'

const { defineReactive, warn } = Vue.util

let translations: Translations

const getTransitionValue = (transition: Translation, key: string): string => {
  key = key.replace(/\[(\d+)\]/g, '.$1')
  let value: string | Translation = transition

  key.split('.').some(k => {
    if (!value || typeof value !== 'object') {
      return true
    }

    value = value[k]
  })

  if (typeof value === 'object') {
    if (process.env.NODE_ENV === 'development' && value !== null) {
      warn('you are trying to get non-literal value')
    }
    return value && value.toString()
  }

  return value
}

export const createTranslator = ({
  locale: instanceLocale,
  translations: instanceTranslations,
  defaultLocale: instanceDefaultLocale,
}: {
  locale: string
  translations?: Translations
  defaultLocale?: string
}) => {
  if (instanceTranslations) {
    if (!translations) {
      translations = instanceTranslations
    } else if (process.env.NODE_ENV === 'development') {
      warn('translations should only be injected once!')
    }
  } else if (process.env.NODE_ENV === 'development' && !translations) {
    warn('translations has not be injected, translator will not work!')
  }

  const instance: Translator = (
    key: string,
    params?: StrObj,
    ignoreNonExist?: boolean,
  ) => {
    const { locale } = instance
    const translation = translations[locale]

    let value = getTransitionValue(translation, key)

    if (value === undefined) {
      const { defaultLocale } = instance

      if (defaultLocale && defaultLocale !== locale) {
        const defaultTranslation = translations[defaultLocale]
        value = getTransitionValue(defaultTranslation, key)
      }

      if (
        process.env.NODE_ENV === 'development' &&
        value === undefined &&
        !ignoreNonExist
      ) {
        warn(
          `your are trying to get nonexistent key \`${key}\` without default locale fallback`,
        )
      }
    }

    value =
      value && value.replace(/{([^{}]+)}/g, (matched, $0) => params[$0.trim()])
    return value == null ? key : value
  }

  defineReactive(instance, LOCALE, instanceLocale)
  defineReactive(instance, DEFAULT_LOCALE, instanceDefaultLocale)

  return instance
}
