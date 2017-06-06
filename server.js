const request = require('request')
const express = require('express')
const cors = require('cors')

const clientId = '555776939cf64ea6b39915cf4d5d875d'
const clientSecret = 'ca910eaa58444f9b83a48b90c56e4c59'
const baseUrl = 'https://api.spotify.com/v1'

const app = express()

app.use(cors())

function getToken (cb) {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
    },
    form: { grant_type: 'client_credentials' },
    json: true
  }

  request.post(authOptions, (err, response, body) => {
    if (err || response.statusCode !== 200) { return cb(err) }

    return cb(null, body.access_token)
  })
}

app.use((req, res, next) => {
  getToken((err, token) => {
    if (err) {
      console.log('Spotify token failed', err)
      return res.send(err)
    }

    const options = {
      url: `${baseUrl}${req.url}`,
      headers: { 'Authorization': 'Bearer ' + token },
      json: true
    }

    console.log('Requesting Spotify with: ', options)

    request.get(options, (err, spotifyRes, body) => {
      if (err) {
        console.log('Spotify request failed', err)
        return res.send(err)
      }

      res.send(body)
    })
  })
})

app.listen(process.env.PORT || 9090, function () {
  console.log('Spotify Clone listening on port 9090')
})
