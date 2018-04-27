const rollup = require('rollup');
const chalk = require('chalk');
let configs = require('../rollup.config.js');
const fs = require('fs');

// main
const notResolves = {};

function onwarn({ code, source }, conf) {
  if (code === 'UNRESOLVED_IMPORT') { // 自动化
    const needResolves = notResolves[conf.input] || [];
    needResolves.push(source);
    notResolves[conf.input] = needResolves;
  }
}

function executeWatch(conf) {
  return new Promise((resolve) => {
    const watcher = rollup.watch({
      ...conf,
      onwarn: (args) => {
        onwarn(args, conf);
      },
    });
    
    function close() {
      watcher.close();
    }

    watcher.on('event', (event) => {
      switch (event.code) {
        case 'START':
          start = Date.now();
          console.log(chalk.green('source code rebuild'));
          break;
        case 'END':
          end = Date.now();
          console.log(chalk.green('rebuild success'), 'after', chalk.hex('#551A8B')(((end - start) / 1000) + ' s'));
          start = 0;
          resolve(close);
          break;
        case 'ERROR':
          end = Date.now();
          console.log(chalk.red(event.error.message));
          console.log(chalk.red('rebuild failed'), 'after', chalk.hex('#551A8B')(((end - start) / 1000) + ' s'));
          start = 0;
          break;
        case 'FATAL':
          console.log(chalk.red(event.error.message));
          start = 0;
          break;
        default:
          break;
      }
    });
  });
}

function startWatch() {
  const disposes = configs.map((config) => {
    return executeWatch(config);
  });

  endTocheck(disposes);
}

async function endTocheck(disposes) {
  Promise.all(disposes).then((closes) => {
    if (Object.keys(notResolves).length) {
      configs = configs.map((config) => {
        const external = config.external || [];
        config.external = external.concat(notResolves[config.input] || []);
        delete notResolves[config.input];
        return config;
      });
      closes.forEach(close => close());
      startWatch();
      // TODO: 如果没加externals则补充，先读文件，通过匹配修改
      // fs.writeFileSync('../rollup.config.js', configs, 'utf-8');
    }
  });
}

startWatch();
