import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

const pkg = require('./package.json')

const NODE_ENV = process.env.NODE_ENV || 'development'
const format = process.env.FORMAT || 'umd'

const isProd = NODE_ENV === 'production'

const plugins = []

if (format === 'umd') {
  plugins.push(
    replace({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'process.env.VUE_ENV': JSON.stringify('client'),
    }),
  )
}

if (isProd) {
  plugins.push(
    uglify({
      output: {
        comments: true,
      },
    }),
  )
}

export default {
  amd: {
    id: 'vue-translator',
  },
  external: ['vue'],
  input: 'dist/esm/index.js',
  output: {
    banner: `/*!
* ${pkg.name} ${pkg.description}
* Version ${pkg.version}
* Copyright (C) 2017 JounQin <admin@1stg.me>
* Released under the MIT license
*
* Github: https://github.com/JounQin/vue-translator
*/`,
    exports: 'named',
    file: `dist/${format}/vue-translator${isProd ? '.min' : ''}.js`,
    format,
    globals: {
      vue: 'Vue',
    },
    name: 'VueTranslator',
  },
  plugins,
}
