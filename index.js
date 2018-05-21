process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')
const path = require('path')
const routes = require('./routes')
const {isProd, setUserMW} = require('./src/util')
const {generateAssetsVersions, assetHelper} = require('./src/util')
const mongoose = require('mongoose')
const app = express()
require('./logger')(app)

generateAssetsVersions(path.join(__dirname, 'assets'), __dirname)

app.disable('x-powered-by');
app.set('view engine', 'pug')
app.set('trust proxy', true)
app.use(session({
  secret: process.env.SECRET || 'secret',
  resave: false,
  proxy: true,
  saveUninitialized: false,
  cookie: { secure: isProd, maxAge: 3600000 },
  store: new MongoStore({
    url: 'mongodb://localhost:30000/sharethings',
    ttl: 30 * 24 * 60 * 60 // = 30 days.
  })
}))
app.use(assetHelper)
app.use(setUserMW)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', routes(express.Router()))
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.listen(process.env.APP_PORT, async function () {
  console.log('Listening on port', process.env.APP_PORT)
  try {
    mongoose.connect('mongodb://localhost:30000/sharethings')
    mongoose.connection.on('error', console.error)
  } catch (e) {
    console.error(e)
  }
})