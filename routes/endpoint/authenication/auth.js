const AuthenticationController = require('../../../controllers/endpoint/authentication/auth')
const passport = require('passport')
const { ErrorHandler } = require('../../../helpers/error')

module.exports = (server) => {
  server.post('/auth/register', async (req, res, next) => {
    console.log(req.body)

    const password = req.body.password
    const email = req.body.email
    const hashedPassword = await AuthenticationController.generatePasswordHash(password)
    await AuthenticationController.CreateUser(email, hashedPassword)
      .then(() => {
        res.send({ message: 'An account has been created!' })
      }).catch((err) => {
        console.log(err)
        next(new ErrorHandler(500, err, err))
      })
  })

  server.post('/auth/login', async (req, res, next) => {
    console.log(req.body)
    passport.authenticate('local', { session: false }, (err, user, message) => {
      if (err) {
        // you should log it        
        return res.status(500).send(err)
      } else if (!user) {
        // you should log it
        console.log(403);
        return res.status(403).send(message)
      } else {
        const token = AuthenticationController.signUserToken(user)
        return res.send({ token })
      }
    })(req, res)
  })

  server.post('/auth/refresh', passport.authenticate('jwt',{session: false}),(req,res,next)=>{
    try {
      const { refreshToken } = req.body
      const token = AuthenticationController.getRefreshToken(refreshToken)
      if (token) {
        res.json({token})
      }
    } catch (error) {
      next(new ErrorHandler(500, error, error))
    }
  })

  server.get('/auth/user', passport.authenticate('jwt',{session: false}),(req,res,next)=>{
    const user = req.user
    res.json({user:user});
  })
}