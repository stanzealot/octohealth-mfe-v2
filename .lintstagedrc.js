const buildEslintCommand = (filenames) => `pnpm exec eslint --fix ${filenames.join(' ')}`;

const buildPrettierCommand = (filenames) => `pnpm exec prettier --write ${filenames.join(' ')}`;

export default {
  '*.{ts,tsx}': [buildEslintCommand, buildPrettierCommand],
  '*.{js,jsx,mjs,cjs}': [buildEslintCommand, buildPrettierCommand],
  '*.{json,md,css}': [buildPrettierCommand],
};
