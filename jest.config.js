module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/shared/**',
    '!<rootDir>/src/infra/factories/**',
    '!<rootDir>/src/infra/database/entities/**',
    '!<rootDir>/src/**/contracts/**',
    '!<rootDir>/src/**/shared/types/**',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/**/app.ts',
    '!<rootDir>/src/**/server.ts',
    '!<rootDir>/src/**/routes.ts',
    '!<rootDir>/src/**/env.ts',
    '!<rootDir>/src/**/connection.ts',
    '!<rootDir>/src/**/helpers/**'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@/(.+)': '<rootDir>/src/$1'
  },
  testMatch: ['**/*.spec.ts'],
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests'
  ],
  transform: {
    '\\.ts$': 'ts-jest'
  },
  clearMocks: true
}
