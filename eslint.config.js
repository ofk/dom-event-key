// eslint-disable-next-line import/no-unresolved
import config from '@ofk/eslint-config-recommend';

export default config({
  extends: [
    {
      files: ['**/*.test.*'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
    {
      rules: {
        '@typescript-eslint/no-deprecated': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        'logical-assignment-operators': 'off',
        'no-useless-assignment': 'off',
        'unicorn/escape-case': 'off',
        'unicorn/explicit-length-check': 'off',
        'unicorn/no-hex-escape': 'off',
        'unicorn/no-lonely-if': 'off',
        'unicorn/no-negated-condition': 'off',
        'unicorn/prefer-code-point': 'off',
        'unicorn/prefer-dom-node-append': 'off',
        'unicorn/prefer-string-replace-all': 'off',
      },
    },
  ],
  perfectionist: false,
  vitest: false,
});
