const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');

const createNpmCommand = (args) => {
  if (process.platform === 'win32') {
    return {
      command: 'cmd.exe',
      args: ['/c', 'npm.cmd', ...args],
    };
  }

  return {
    command: 'npm',
    args,
  };
};

const processes = [
  {
    name: 'backend',
    cwd: backendDir,
    ...createNpmCommand(['run', 'dev']),
  },
  {
    name: 'frontend',
    cwd: rootDir,
    ...createNpmCommand(['start']),
  },
];

const children = processes.map(({ name, command, args, cwd }) => {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: false,
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      shutdown();
    }
  });

  return child;
});

const shutdown = () => {
  children.forEach((child) => {
    if (!child.killed) child.kill();
  });
};

process.on('SIGINT', () => {
  shutdown();
  process.exit();
});

process.on('SIGTERM', () => {
  shutdown();
  process.exit();
});
