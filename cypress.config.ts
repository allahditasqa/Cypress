import { defineConfig } from 'cypress';
import { plugin as grepPlugin } from '@cypress/grep/plugin';
import dotenv from 'dotenv';
import path from 'path';

// TEST_ENV=staging loads .env.staging first (dotenv never overwrites a value that is already set), then .env
if (process.env.TEST_ENV) dotenv.config({ path: path.resolve(__dirname, `.env.${process.env.TEST_ENV}`), quiet: true });
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com', // cy.visit('/') = baseUrl + /
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1440,
    viewportHeight: 900,
    defaultCommandTimeout: 8_000,
    pageLoadTimeout: 60_000,
    requestTimeout: 15_000,
    retries: { runMode: process.env.CI ? 1 : 0, openMode: 0 }, // no retries locally: a flaky test must be visible
    video: false,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    // The spec reporter prints to the console; mochawesome writes JSON that `npm test` turns into one HTML report.
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'spec, mochawesome',
      mochawesomeReporterOptions: {
        reportDir: 'mochawesome-report',
        overwrite: false,
        html: false,
        json: true,
        quiet: true,
      },
    },
    // Public values, read in tests with Cypress.expose('KEY'). (Secrets would go to `env` and be read with cy.env().)
    expose: {
      API_URL: process.env.API_URL ?? 'https://jsonplaceholder.typicode.com',
      PASSWORD: process.env.SAUCE_PASSWORD ?? 'secret_sauce', // public demo password printed on the login page
    },
    setupNodeEvents(on, config) {
      grepPlugin(config); // tags: npm run test:smoke runs only @smoke
      return config;
    },
  },
});
