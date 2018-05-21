const UserModel = require('../../model/user')
const register = require('./register')

module.exports = router => {
  router.post('/members/register', (req, res) => {
    register(req.body)
      .then(user => {
        req.session.user = {
          id: user._id,
          role: 'user'
        }
        res.redirect('/')
      })
      .catch(err => {
        console.log(err)
        res.send(err.code === 11000 ? 'Username already registered' : 'Unknown error')
      })
  })
  router.post('/members/login', (req, res) => {
    UserModel.auth(req.body)
      .then(user => {
        req.session.user = {
          id: user._id,
          role: 'user'
        }
        res.redirect('/')
      })
      .catch(err => res.send(JSON.stringify(err), 500))
  })
  router.get('/members/logout', (req, res, next) => {
    if (req.session) {
      req.session.destroy(err => {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  })
  router.get('/members/profile', (req, res, next) => {
    if (res.locals.isLoggedIn) {
      res.render('members/profile')
    } else {
      res.send('Please login first', 401)
    }
  })
}