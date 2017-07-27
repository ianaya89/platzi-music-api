const async = require('async')
const Server = require('./server')

class PlatziMusicApi {
  constructor (config, logger) {
    this.config = config
    this.logger = logger.child({ context: 'platzi-music-api' })
    this.isRunning = false
    this.server = new Server(config, this.logger)
  }

  start (cb) {
    if (this.isRunning) {
      throw new Error('Cannot start platzi-music-api because it is already running')
    }

    this.isRunning = true

    this.logger.verbose('Starting platzi-music-api')
    this.logger.verbose('Compiling Vault secrets into config')

    async.parallel([
      cb => this.server.listen(cb)
    ], (err) => {
      if (err) { return cb(err) }

      this.logger.verbose('platzi-music-api ready and awaiting requests')

      cb(null, { url: this.config.server.url })
    })
  }

  stop (cb) {
    if (!this.isRunning) {
      throw new Error('Cannot stop platzi-music-api because it is already stopping')
    }
    this.isRunning = false

    this.logger.verbose('Stopping platzi-music-api')
    async.parallel([
      (cb) => { this.server.close(cb) }
    ], (err) => {
      if (err) { return cb(err) }

      this.logger.verbose('platzi-music-api has closed all connections and successfully halted')
      cb(null)
    })
  }
}

module.exports = PlatziMusicApi
