import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import globals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import postcss from 'rollup-plugin-postcss';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'src/index.js',
		output: {
      file: 'lib/index.js',
      format: 'cjs',
      sourcemap: true,
    },
		plugins: [
      resolve({
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
      postcss({
        exec: true,
      }),
      builtins(),
		]
  }, 
  {
    input: 'src/server/index.js',
    output: {
      file: 'lib/server.js',
      format: 'cjs',
    },
    plugins: [
      json(),
      resolve({
        modulesOnly: true,
        preferBuiltins: true,
      }),
    ],
  },
];
