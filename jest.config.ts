import type {Config} from 'jest';

const config: Config = {
	'preset': 'ts-jest',
	'testEnvironment': 'node',
	'roots': ['<rootDir>/src', '<rootDir>/test'],
	'testMatch': ['**/*.spec.ts', '**/*.test.ts'],
	'collectCoverageFrom': [
		'src/**/*.ts',
		'!src/**/*.d.ts'
	],
	'coverageDirectory': 'coverage',
	'coverageReporters': ['text-summary', 'html', 'lcov']
};

export default config;
