// setupTests.js
import '@testing-library/jest-dom/extend-expect';
import { server } from './mocks/server'; // Import your MSW server setup for API mocking

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that are declared in a test
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
