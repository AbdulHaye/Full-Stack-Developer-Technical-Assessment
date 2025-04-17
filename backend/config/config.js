module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    tokenExpiration: '24h',
    emailConfig: {
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
  };