// backend/api/index.js
const app = require('../app'); // Import your Express app
const serverless = require('serverless-http'); // Wrapper for serverless deployment

module.exports = serverless(app);
