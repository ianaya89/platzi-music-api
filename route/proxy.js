const Router = require('express').Router
const request = require('request')
const router = new Router()

function getToken (config, cb) {
  const token = (Buffer.from(`${config.spotify.clientId}:${config.spotify.clientSecret}`).toString('base64'))

  const authOptions = {
    url: config.spotify.authUrl,
    headers: { 'Authorization': `Basic ${token}` },
    form: { grant_type: 'client_credentials' },
    json: true
  }

  request.post(authOptions, (err, res, body) => {
    if (err || res.statusCode !== 200) { return cb(err) }

    return cb(null, body.access_token)
  })
}

function doProxy (req, res, next) {
  req.logger.verbose(`Responding to proxy request ${req.url}`)

  req.logger.verbose(`Spotify authentication started`)
  getToken(req.config, (err, token) => {
    if (err) {
      req.logger.error('Spotify authentication failed', err)
      return res.send(err)
    }

    req.logger.verbose(`Spotify authentication success`)

    const options = {
      url: `${req.config.spotify.baseUrl}${req.url}`,
      headers: { 'Authorization': 'Bearer ' + token },
      json: true
    }

    req.logger.verbose(`Sending spotify request:  ${JSON.stringify(options)}`)

    request.get(options, (err, spotifyRes, body) => {
      if (err) {
        req.logger.verbose('Spotify request failed', err)
        return res.send(err)
      }

      req.logger.verbose(`Sending response to client ${spotifyRes.statusCode}`)
      res.status(spotifyRes.statusCode).send(body)
    })
  })
}

router.use(doProxy)

module.exports = router
