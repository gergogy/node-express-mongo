const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const bcrypt = require('bcrypt')
const UserModel = require('../model/user')
const isProd = process.env.NODE_ENV === 'production'
let dirs = []
let list = []

const _genHash = data => {
  return crypto
    .createHash('md5')
    .update(data, 'utf8')
    .digest('hex');
}

const regen = () => {
  list = []
  dirs.forEach(({dir, curDir}) => generateAssetsVersions(dir, curDir))
}

const generateAssetsVersions = (dir, curDir) => {
  if (!dirs.includes(dir)) {
    dirs.push({dir, curDir})
  }
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file)

    if (fs.statSync(filePath).isDirectory()) {
      generateAssetsVersions(filePath, curDir)
    } else {
      list.push({
        path: filePath.substring(filePath.indexOf(curDir) + curDir.length),
        hash: _genHash(fs.readFileSync(filePath))
      })
    }
  })
}

const assetHelper = (req, res, next) => {
  res.locals.asset = file => {
    if (file.indexOf('://') !== -1) return file
    if (!isProd) return `/assets/${file}`
    const index = list.findIndex(item => item.path.indexOf(file) !== -1)
    return index !== -1 ? `${list[index].path}?${list[index].hash}` : file
  }
  next()
}

const secret = process.env.SECRET || 'secret'
const setUserMW = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.id) {
    UserModel.findOne({_id: req.session.user.id}).exec((err, user) => {
      if (user) {
        res.locals.isLoggedIn = true
        res.locals.user = user
        req.session.user.role = user.role || 'normal'
        next()
      } else {
        req.session.destroy(err => {
          if(err) {
            return next(err);
          } else {
            return res.redirect('/');
          }
        });
      }
    })
  } else {
    next()
  }
}

module.exports = {
  generateAssetsVersions,
  assetHelper,
  regen,
  isProd,
  setUserMW
}