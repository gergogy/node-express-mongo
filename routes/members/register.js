const UserModel = require('../../model/user')
const _validator = data => {
  let message = ''

  if (!data) message += 'User data not provided\n'

  const {username, password, policy} = data
  if (!username.length) message += 'Username necessary\n'
  if (username.length < 5) message += 'Username too short (at least 5 characters)\n'
  if (!password.length) message += 'Password necessary\n'
  if (username.length < 8) message += 'Password too short (at least 8 characters)\n'
  if (username === password) message += 'Username and password is the same\n'
  if (!/[0-9]/.test(password)) return  message += 'Password must contain at least one digit\n'
  if (!/[A-Z]/.test(password)) return  message += 'Password must contain at least one uppercase letter\n'
  if (!/[a-z]/.test(password)) return  message += 'Password must contain at least one lowercase letter\n'

  return message.length ? message.substr(0, message.length-2) : true
}

module.exports = data => new Promise((res, rej) => {
  const result = _validator(data)
  if (result !== true) {
    rej(result) // return with error message
    return
  }

  UserModel.create(data).then(user => res(user))
})