const fork = require('child_process').fork;

beforeEach(() => {
  const server = fork('./lib/server', [], {
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    cwd: './',
  });
  server.on('message', (params) => {
    console.log(params);
  });
  server.on('close', () => {

  });
  server.stdout.on('data', (buf) => {
    console.log(buf.toString());
  });
  server.stderr.on('data', (buf) => {
    console.log(buf.toString());
  });
});

test('test server start', () => {
  
});

test('test server ready', () => {
  
});

test('test server sendMsg', () => {
  
});