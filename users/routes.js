const router = require('express').Router()

router.post('/register', (req, res, next)=>{
  res.send('Register')
})

router.post('/login', (req, res, next)=>{
  res.send('Login')
})

module.exports = router