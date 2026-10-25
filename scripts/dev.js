import { spawn } from 'child_process';

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

console.log('🚀 Starting OpportunityAI Server & Client...\n');

const server = spawn(npmCmd, ['run', 'dev', '--prefix', 'server'], {
  stdio: 'inherit',
  shell: true,
});

const client = spawn(npmCmd, ['run', 'dev', '--prefix', 'client'], {
  stdio: 'inherit',
  shell: true,
});

process.on('SIGINT', () => {
  server.kill();
  client.kill();
  process.exit();
});
