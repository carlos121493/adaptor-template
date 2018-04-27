
const { spawn, execSync } = require('child_process');
const { join, dirname, basename } = require('path');

const rootDir = join(__dirname, '..');
const binPath = execSync('npm bin').toString().trim();
const coreDir =  join(rootDir, '/node_modules/@alipay/ide-ts');
const externalPath = dirname(require.resolve('@alipay/cygnus-ide-tiny-project'));
const env = { ...process.env, ADAPTER_DEBUG: true, ADAPTER_DEBUG_PATH: rootDir }

spawn(join(binPath, 'electron'), [ require.resolve('@alipay/ide-ts'), `--externals=${externalPath}`], {
  cwd: coreDir,
  env,
  stdio: 'inherit',
});
