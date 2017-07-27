const milieu = require('milieu')

const config = milieu('pma', {
  server: {
    url: 'http://localhost:8585',
    maxResultsLimit: 1000
  },

  spotify: {
    baseUrl: 'https://api.spotify.com/v1',
    authUrl: 'https://accounts.spotify.com/api/token',
    clientId: '',
    clientSecret: ''
  },

  logger: {
    sentry: {
      dsn: ''
    },

    loggly: {
      inputToken: '',
      subdomain: '',
      tags: ['platzi-music-api'],
      json: true
    },

    console: {
      level: 'debug',
      timestamp: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      colorize: true
    }
  }
})

module.exports = config
