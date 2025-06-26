/**
 * This script copies the README.md from the repository root to the packages/core directory
 * to ensure it's properly included in the npm package.
 */
const fs = require('fs');
const path = require('path');

// Path to the project root README.md and the packages/core README.md
const rootReadmePath = path.resolve(__dirname, '../../../README.md');
const packageReadmePath = path.resolve(__dirname, '../README.md');

try {
  // Check if root README exists
  if (!fs.existsSync(rootReadmePath)) {
    console.error('Root README.md does not exist:', rootReadmePath);
    process.exit(1);
  }

  // Copy the README.md file
  fs.copyFileSync(rootReadmePath, packageReadmePath);
  console.log('Successfully copied README.md to packages/core for npm publishing.');
} catch (error) {
  console.error('Error copying README.md:', error);
  process.exit(1);
} 
