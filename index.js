const config = require('./config')
const logger = require('./logger')
const PlatziMusciApi = require('./lib/platzi-music-api')

exports = module.exports = new PlatziMusciApi(config, logger)
exports.PlatziMusciApi = PlatziMusciApi
