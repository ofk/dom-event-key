// eslint-disable-next-line import/no-unresolved
import config from '@ofk/eslint-config-recommend';

export default config({
  extends: [
    {
      files: ['**/*.test.*'],
      rules: {
        'vitest/no-standalone-expect': 'off',
        'vitest/require-hook': 'off',
        'vitest/require-top-level-describe': 'off',
      },
    },
    {
      files: ['**/*.ts'],
      rules: {
        '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      },
    },
  ],
  ignores: ['dist', 'coverage'],
});
