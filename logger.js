const morgan = require('morgan')
const path = require('path')
const fsRotator = require('file-stream-rotator')
const _getLogStream = filename =>
  fsRotator.getStream({
    filename: path.join(__dirname, 'logs', `${filename}-%DATE%.log`),
    date_format: 'YYYY-MM-DD',
    frequency: 'daily',
    max_logs: '180d',
    verbose: false
  })
const error = morgan('combined', {
  stream: _getLogStream('error'),
  skip: (req, res) => res.statusCode < 400
})
const access = morgan('short', {stream: _getLogStream('access')}) 
const dev = morgan('dev')

const loggers = {
  production: [access, error],
  development: [dev]
}

module.exports = app => {
  loggers[process.env.NODE_ENV].forEach(logger => {
    app.use(logger)
  });
}

module.exports.makeLogStream = _getLogStream
