module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFiles: ['dotenv/config'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  verbose: true
}
