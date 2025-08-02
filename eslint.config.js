import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
	js.configs.recommended,
	{
		files: ['src/**/*.ts'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				project: './tsconfig.eslint.json'
			}
		},
		plugins: {
			'@typescript-eslint': tseslint,
			prettier: prettier
		},
		rules: {
			// TypeScript ESLint recommended rules
			...tseslint.configs.recommended.rules,

			// Prettier integration
			'prettier/prettier': 'error',

			// Converted from TSLint rules
			'curly': ['error', 'multi-line', 'consistent'],
			'max-classes-per-file': ['error', 5],
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variable',
					format: ['camelCase', 'PascalCase'],
					leadingUnderscore: 'allow'
				}
			],
			'sort-imports': 'off', // equivalent to ordered-imports: false
			'sort-keys': 'off', // equivalent to object-literal-sort-keys: false

			// Additional TypeScript-specific rules
			'@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',

			// Allow multiple variable declarations per statement (from TSLint config)
			'one-var': 'off',

			// Disable some rules that might be too strict for this project
			'@typescript-eslint/no-inferrable-types': 'off'
		}
	},
	// Configuration for test files
	{
		files: ['test/**/*.ts'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				project: './tsconfig.eslint.json'
			},
			globals: {
				describe: 'readonly',
				it: 'readonly',
				test: 'readonly',
				expect: 'readonly',
				beforeAll: 'readonly',
				afterAll: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				jest: 'readonly'
			}
		},
		plugins: {
			'@typescript-eslint': tseslint,
			prettier: prettier
		},
		rules: {
			// TypeScript ESLint recommended rules
			...tseslint.configs.recommended.rules,

			// Prettier integration
			'prettier/prettier': 'error',

			// Test-specific rule overrides
			'@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-expressions': 'off', // Allow for Chai expressions

			// Allow multiple variable declarations per statement
			'one-var': 'off',

			// Disable some rules that might be too strict for test files
			'@typescript-eslint/no-inferrable-types': 'off'
		}
	},
	prettierConfig // This should be last to override other formatting rules
];
