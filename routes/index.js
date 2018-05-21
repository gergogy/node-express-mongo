const {regen, generateAssetsVersions} = require('../src/util')
const members = require('./members')

module.exports = router => {
  // dummy endpoint for testing purposes
  router.all('/ping', (_, res) => {
    res.render('test', {message: 'pong'})
  })
  router.get('/assets-regen', (_, res) => {
    regen()
    res.send('DONE')
  })

  router.get('/', (_, res) => {
    res.render('index')
  })

  members(router)

  return router
}
  