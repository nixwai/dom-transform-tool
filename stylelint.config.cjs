module.exports = {
  root: true,
  plugins: ['stylelint-scss', 'stylelint-order'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue',
  ],
  rules: {
    'function-no-unknown': null, // 禁止未知函数：无
    'selector-class-pattern': null, // class命名标准：无
    'value-keyword-case': ['lower', { ignoreFunctions: ['v-bind'] }], // 大小写限制
    'at-rule-no-unknown': [
      true,
      {
        // @函数
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'function',
          'if',
          'each',
          'include',
          'mixin',
        ],
      },
    ],
    'font-family-no-missing-generic-family-keyword': null, // 允许在字体系列名称列表中缺少通用字体族
    'rule-empty-line-before': [
      'always',
      { ignore: ['after-comment', 'first-nested'] },
    ], // 要求或禁止在 at 规则之前使用空行
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
  overrides: [
    {
      files: ['**/*.(less|css|vue|html)'],
      customSyntax: 'postcss-scss',
      rules: {
        'selector-pseudo-class-no-unknown': [
          true,
          { ignorePseudoClasses: ['deep', 'global'] },
        ],
        'selector-pseudo-element-no-unknown': [
          true,
          { ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'] },
        ],
      },
    },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html',
    },
  ],
};
