const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building web...');

// Web export
execSync('pnpm exec expo export --platform web', {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..')
});

// Font files fix karo
const distDir = path.resolve(__dirname, '../dist');
const assetsSrc = path.resolve(__dirname, '../node_modules');

// Feather icons font copy karo
const featherFont = path.join(
  assetsSrc,
  '@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf'
);

const fontsDestDir = path.join(distDir, 'fonts');
if (!fs.existsSync(fontsDestDir)) {
  fs.mkdirSync(fontsDestDir, { recursive: true });
}

if (fs.existsSync(featherFont)) {
  fs.copyFileSync(featherFont, path.join(fontsDestDir, 'Feather.ttf'));
  console.log('✅ Feather font copied');
}

console.log('✅ Web build complete!');