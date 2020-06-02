const router = require('express').Router()
const UserModel = require('./model')

router.get('/:id', (req, res, next)=>{
  UserModel
    .findById(req.params.id)
    .then((result)=>{
      if(!result) {
        res
          .status(404)
          .send('User not found')
      } else {
        result.password = undefined
        res.json(result)
      }
    })
    .catch((err)=>{
      console.log(err)
      res
        .status(500)
        .send('Error Occurred')
    })
})

router.post('/register', (req, res, next)=>{
  const newUser = new UserModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  })
  newUser
    .save()
    .then((document)=>{
      if(document) {
        document.password = undefined
        res.json(document)
      } else {
        res.send('Document did not save')
      }
    })
    .catch((err)=>{
      console.log(err)
      res
        .status(500)
        .send('Error Occurred')
    })
})

router.post('/login', (req, res, next)=>{
  res.send('Login')
})

module.exports = router