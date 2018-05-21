const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {type: String, index: true, required: [true, 'Username missing']},
  password: {type: String, required: [true, 'Password missing']},
  email: {type: String, index: true, default: null},
  socialLogins: {type: Array, default: []}
}, { timestamps: true })

UserSchema.pre('save', next => {
  bcrypt.hash(this.password, 13)
    .then(encrypted => {
      this.password = encrypted
      next()
    })
    .catch(err => next(err))
})


UserSchema.statics.auth = ({identifier, password}) => 
  new Promise((res, rej) => {
    UserModel.findOne({username: identifier}).exec((err, user) => {
      if (err) {
        rej(err)
        return
      }

      if (!user) {
        rej('Username or password not match')
        return
      }

      bcrypt.compare(password, user.password)
        .then(result => {
          if (!result) {
            rej('Username or password not match')
          } else {
            res(user)
          }
        })
        .catch(err => rej('Username or password not match'))
    })
  })
const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel