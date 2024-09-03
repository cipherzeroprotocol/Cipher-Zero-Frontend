const axios = require('axios');

/**
 * Create an Axios instance with default settings.
 * @param {string} baseURL - The base URL for API requests.
 * @param {object} [headers] - Optional headers to be included in each request.
 * @returns {object} - The configured Axios instance.
 */
function createApiClient(baseURL, headers = {}) {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

/**
 * Perform a GET request.
 * @param {string} url - The endpoint URL for the GET request.
 * @param {object} [params] - Optional query parameters.
 * @param {object} [headers] - Optional headers for the request.
 * @returns {Promise<object>} - The response data.
 */
async function getRequest(url, params = {}, headers = {}) {
  const apiClient = createApiClient('');
  try {
    const response = await apiClient.get(url, { params, headers });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Perform a POST request.
 * @param {string} url - The endpoint URL for the POST request.
 * @param {object} data - The data to be sent in the request body.
 * @param {object} [headers] - Optional headers for the request.
 * @returns {Promise<object>} - The response data.
 */
async function postRequest(url, data, headers = {}) {
  const apiClient = createApiClient('');
  try {
    const response = await apiClient.post(url, data, { headers });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Handle API errors.
 * @param {object} error - The error object from an Axios request.
 */
function handleApiError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Error Response:', error.response.data);
    console.error('Error Status:', error.response.status);
    console.error('Error Headers:', error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Error Request:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error Message:', error.message);
  }
}

/**
 * Perform a PUT request.
 * @param {string} url - The endpoint URL for the PUT request.
 * @param {object} data - The data to be sent in the request body.
 * @param {object} [headers] - Optional headers for the request.
 * @returns {Promise<object>} - The response data.
 */
async function putRequest(url, data, headers = {}) {
  const apiClient = createApiClient('');
  try {
    const response = await apiClient.put(url, data, { headers });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Perform a DELETE request.
 * @param {string} url - The endpoint URL for the DELETE request.
 * @param {object} [params] - Optional query parameters.
 * @param {object} [headers] - Optional headers for the request.
 * @returns {Promise<object>} - The response data.
 */
async function deleteRequest(url, params = {}, headers = {}) {
  const apiClient = createApiClient('');
  try {
    const response = await apiClient.delete(url, { params, headers });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

module.exports = {
  createApiClient,
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
};
