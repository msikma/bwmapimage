import stylistic from '@stylistic/eslint-plugin'
import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic
    }
  },
  {
    rules: {
      '@stylistic/quotes': ['error', 'single', {allowTemplateLiterals: true, avoidEscape: true}],
      '@stylistic/no-tabs': ['error'],
      '@stylistic/object-curly-spacing': ['error', 'never'],
      '@stylistic/semi': ['error', 'never']
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    ignores: ['dist/', '_source/', '_test/']
  }
)
