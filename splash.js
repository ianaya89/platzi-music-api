const figlet = require('figlet')
const pkg = require('./package')

let rev
try {
  rev = require('./revision')
} catch (err) {
  rev = { revision: 'indev' }
}

process.stdout.write('\n')
process.stdout.write(`${figlet.textSync('platzi-music-api', { font: 'Ogre' })}\n`)
process.stdout.write('\n')
process.stdout.write(`version: ${pkg.version} revision: ${rev.revision}\n`)
process.stdout.write('\n')
process.stdout.write('\n')
