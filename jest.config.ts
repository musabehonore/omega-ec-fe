import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './'
});
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' }
};

export default createJestConfig(config);
