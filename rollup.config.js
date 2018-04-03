import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import globals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
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
        preferBuiltins: true,
        extensions: ['.js', '.json'],
      }),
      json({
        include: 'node_modules/**',
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
