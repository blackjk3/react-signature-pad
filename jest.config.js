module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    // configure enzyme w/ react adapter
    '<rootDir>/test-utils/configure-enzyme.js',
    // polyfill window.resizeTo
    '<rootDir>/test-utils/window-resizeTo.js',
    'jest-canvas-mock'
  ],
}
