import antfu from '@antfu/eslint-config';

export default antfu(
  {
    formatters: true,
    unocss: true,
    typescript: true,
    vue: true,
    ignores: ['.husky'],
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/max-attributes-per-line': ['error', { singleline: 5, multiline: { max: 1 } }],
      'vue/html-self-closing': ['error', {
        html: { void: 'never', normal: 'always', component: 'always' },
        svg: 'always',
        math: 'always',
      }],
    },
  },
  {
    files: ['**/*.md'],
    rules: { 'format/prettier': ['off'] },
  },
  {
    rules: {
      'style/semi': ['error', 'always'], // 末尾带分号
      'object-curly-newline': ['error', { multiline: true }], // 花括号内换行规则
    },
  },
);
