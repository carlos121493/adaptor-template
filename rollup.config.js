const resolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');
const globals = require('rollup-plugin-node-globals')
const builtins = require('rollup-plugin-node-builtins');
const json = require('rollup-plugin-json');
const postcss = require('rollup-plugin-postcss');
const babel = require('rollup-plugin-babel');
const pkg = require('./package.json');
const copy = require('copy-dir');

// 复制scaffolds
const production = !process.env.ROLLUP_WATCH;
copy('src/scaffolds', 'lib/scaffolds', () => {});

const commonJSConfig = {
  plugins: [
    postcss({
      modules: true,
      extensions: ['.less']
    }),
    resolve({
      preferBuiltins: true,
      modulesOnly: true,
      extensions: ['.js', '.json'],
    }),
    babel({
      externalHelpers: true,
      runtimeHelpers: true,
      exclude: 'node_modules/**' // only transpile our source code
    }),
    json({
      include: 'node_modules/**',
    }),
    builtins(),
    production && uglify(),
  ]
};

const configPrefixs = {
  'simulator': 'src/simulator/index.js',
  'bridge': 'src/simulator/mock/bridge/index.js',
  'templates': 'src/simulator/mock/templates/index.js'
};

const configs = Object.keys(configPrefixs).map(k => ({ ...commonJSConfig, 
  input: configPrefixs[k],
  output: {
    file: `lib/${k}.js`,
    format: 'cjs',
    sourcemap: true,
  },
}));

module.exports = [
  ...configs,
  {
    input: 'src/messanger/index.js',
    output: {
      file: 'lib/server.js',
      format: 'cjs',
    },
    plugins: [
      resolve({
        preferBuiltins: true,
        modulesOnly: true,
      }),
      json(),
      production && uglify(),
    ],
  },
];
