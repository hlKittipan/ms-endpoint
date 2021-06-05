const AuthenticationController = require('../../../controllers/endpoint/authentication/auth')
const passport = require('passport')

module.exports = (server) => {
  server.post('/auth/register', async (req, res) => {
    console.log(req.body)

    const password = req.body.password
    const email = req.body.email
    const hashedPassword = await AuthenticationController.generatePasswordHash(password)
    await AuthenticationController.CreateUser(email, hashedPassword)
  
      .then(() => {
        res.send({ message: 'An account has been created!' })
      }).catch((err) => {
        throw err
      })
  })

  server.post('/auth/login', async (req, res) => {
    console.log(req.body)
    passport.authenticate('local', { session: false }, (err, user, message) => {
      console.log('user'+user)
      console.log(err)
      console.log(message)
      if (err) {
        // you should log it
        return res.status(500).send(err)
      } else if (!user) {
        // you should log it
        return res.status(403).send(message)
      } else {
        const token = AuthenticationController.signUserToken(user)
        return res.send({ token })
      }
    })(req, res)
  })
  
  server.get('/auth/user', async (req, res) => {
    passport.authenticate('jwt', { session: false }, (err, user, message) => {
      console.log('user'+user)
      console.log(err)
      console.log(message)
      if (err) {
        // you should log it
        return res.status(400).send(err)
      } else if (!user) {
        // you should log it
        return res.status(403).send({ message })
      } else {
        return res.send({ user })
      }
    })(res, req)
  })

  server.get('/secret', passport.authenticate('jwt',{session: false}),(req,res,next)=>{
    res.json("Secret Data")
  })
}