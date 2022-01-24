const bcrypt = require('bcrypt')
const {
  ErrorHandler
} = require('../../../helpers/error')
const passport = require('passport')
const config = require("../../../configs/index");
const authUserSecret = config.AUTH_USER_SECRET // an arbitrary long string, you can ommit env of course
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

const User = require('../../../models/endpoint/authentication/auth')
const jwt = require('jsonwebtoken')

const Setting = require("../../../models/endpoint/settings/index");

// Refresh tokens
const refreshTokens = {}

//function check token
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: authUserSecret
  },
  async function (jwtPayload, done) {
    return GetUser(jwtPayload.email)
      .then( async (user) => {
        if (user) {
         console.log(user)
          return done(null, {
            ...jwtPayload,
            time:new Date(),
            settings:user.settings,
            scope:['test','admin']
          })
        } else {
          return done(null, false, 'Failed')
        }
      })
      .catch((err) => {
        return done(err)
      })
  }
))

// function login
passport.use(
  new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    async function (email, password, done) {
      await GetUser(email)
        .then((user) => {
          return user
        }).then(async (user) => {
          if (!user) {
            return done(null, false, {
              message: 'Authentication failed'
            })
          }
          const validation = await comparePasswords(password, user.password)
          return validation ? done(null, user) : done(null, false, {
              message: 'Authentication failed'
            });
        }).catch((err) => {
          return done(err)
        })
    }
  )
)

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

function signUserToken(user) {
  const refreshToken   = Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1
  const accessToken = jwt.sign({id: user.id, email: user.email,}, authUserSecret, { expiresIn: '1h' })
  refreshTokens[refreshToken ] = {
    accessToken,
    user
  }
  const token = {
    accessToken,
    refreshToken: refreshToken 
  }
  return token
}
async function generatePasswordHash(plainPassword) {
  return await bcrypt.hash(plainPassword, 12)
}
async function CreateUser(email, password) {
  return await User.create({
      email,
      password
    })
    .then((data) => {
      return data
    }).catch((error) => {
      throw error
    })
}

async function GetUser(email) {
  return await User.findOne({
      email
    })
    .then( async (data) => {

      const results = {}
      let settings = await Setting.find({user_id:data.id})
      if (settings.length == 0){
        settings = {}
        settings["default_language"] = 'en'
      }
      results["id"] = data._id || null
      results["email"] = data.email || null
      results["password"] = data.password || null
      results["settings"] = settings 
      return results
    }).catch((error) => {
      next(new ErrorHandler(500, error, error))
    })
}

function getRefreshToken(refreshToken){
  try {
    const user = refreshTokens[refreshToken].user
    delete refreshTokens[refreshToken]
    const token = signUserToken(user)
    return token
  }catch(error){
    throw error
  }

}
module.exports = {
  generatePasswordHash,
  CreateUser,
  GetUser,
  signUserToken,
  getRefreshToken
}