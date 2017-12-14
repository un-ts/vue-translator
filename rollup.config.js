import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

const pkg = require('./package.json')

const NODE_ENV = process.env.NODE_ENV || 'development'

const isProd = NODE_ENV === 'production'

const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    'process.env.VUE_ENV': JSON.stringify('client'),
  }),
]

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
  banner: `/*!
* ${pkg.name} ${pkg.description}
* Version ${pkg.version}
* Copyright (C) 2017 JounQin <admin@1stg.me>
* Released under the MIT license
*
* Github: https://github.com/JounQin/vue-translator
*/`,
  external: ['vue'],
  input: 'dist/esm/index.js',
  globals: {
    vue: 'Vue',
  },
  name: 'VueTranslator',
  output: {
    exports: 'named',
    file: `dist/umd/vue-translator${isProd ? '.min' : ''}.js`,
    format: 'umd',
  },
  plugins,
}
