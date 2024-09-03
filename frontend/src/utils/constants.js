// Base URLs for different environments
const BASE_URLS = {
    development: 'http://localhost:5000',
    production: 'https://api.yourapp.com',
    test: 'https://test-api.yourapp.com'
  };
  
  // Default headers for API requests
  const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  // Token constants
  const TOKEN_CONSTANTS = {
    TOKEN_EXPIRE_TIME: '1h', // Token expiration time
    TOKEN_SECRET: 'your-secret-key', // Secret key for signing tokens
  };
  
  // Error messages
  const ERROR_MESSAGES = {
    INVALID_REQUEST: 'Invalid request parameters',
    AUTH_FAILED: 'Authentication failed',
    RESOURCE_NOT_FOUND: 'Resource not found',
    INTERNAL_SERVER_ERROR: 'Internal server error'
  };
  
  // Configuration for file uploads
  const FILE_UPLOAD_CONFIG = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  };
  
  // API endpoints
  const API_ENDPOINTS = {
    USER_API: '/api/users',
    AUTH_API: '/api/auth',
    DASHBOARD_API: '/api/dashboard',
    TRANSFER_API: '/api/transfer-file'
  };
  
  module.exports = {
    BASE_URLS,
    DEFAULT_HEADERS,
    TOKEN_CONSTANTS,
    ERROR_MESSAGES,
    FILE_UPLOAD_CONFIG,
    API_ENDPOINTS
  };
  