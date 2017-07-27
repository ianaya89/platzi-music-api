const pkg = require('../package')
const Router = require('express').Router
const router = new Router()

router.get('/', getRoot)
router.get('/status', getStatus)
router.get('/sentry', testSentry)

function getRoot (req, res) {
  req.logger.verbose('Responding to root request')
  req.logger.verbose('Sending response to client')

  res.send({
    name: pkg.name,
    version: pkg.version
  })
}

function testSentry (req, res) {
  req.logger.verbose('Testing sentry failing report')
  throw new Error('Testing sentry failing report')
}

function getStatus (req, res, next) {
  req.pingDatabase((err, result) => {
    if (err) { return next(err) }
    if (!result || !result.ok) {
      return res.sendStatus(503)
    }
    res.sendStatus(204)
  })
}

module.exports = router
