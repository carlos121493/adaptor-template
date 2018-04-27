const resolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');
const globals = require('rollup-plugin-node-globals')
const builtins = require('rollup-plugin-node-builtins');
const json = require('rollup-plugin-json');
const postcss = require('rollup-plugin-postcss');
const babel = require('rollup-plugin-babel');
const pkg = require('./package.json');

const production = !process.env.ROLLUP_WATCH;
console.log(production);
module.exports = [
	{
    input: 'src/index.js',
    output: {
      file: 'lib/index.js',
      format: 'cjs',
      sourcemap: true,
    },
		plugins: [
      resolve({
        preferBuiltins: true,
        modulesOnly: true,
        extensions: ['.js', '.json'],
      }),
      babel({
        externalHelpers: true,
        runtimeHelpers: true,
        exclude: 'node_modules/**'
      }),
      json({
        include: 'node_modules/**',
      }),
      postcss({
        exec: true,
      }),
      builtins(),
      // production && uglify(),
		]
  }, 
  {
    input: 'src/server/index.js',
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
      // production && uglify(),
    ],
  },
];
