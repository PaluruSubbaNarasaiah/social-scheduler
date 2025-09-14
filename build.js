const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Installing frontend dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
  
  console.log('Building frontend...');
  execSync('node node_modules/vite/bin/vite.js build', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
  
  console.log('Frontend build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}