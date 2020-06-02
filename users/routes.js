const router = require('express').Router()
const bcrypt = require('bcryptjs')
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

router.post('/register', registrationInputValidation, isEmailTaken, hashPassword, (req, res, next)=>{
  console.log(req.body.password)
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

router.post('/login', loginInputValidation, findUser, checkPassword, provideAccess, (req, res, next)=>{
  res.send('Login')
})

function registrationInputValidation(req, res, next) {
  const { firstName, lastName, email, password } = req.body
  const missingFields = []

  if(!firstName) {
    missingFields.push('firstName')
  }

  if(!lastName) {
    missingFields.push('lastName')
  }

  if(!email) {
    missingFields.push('email')
  }

  if(!password) {
    missingFields.push('password')
  }

  if(missingFields.length) {
    res
      .status(400)
      .send(`The following fields are missing: ${missingFields.join(', ')}`)
  } else {
    next()
  }
}

function isEmailTaken(req, res, next) {
  const { email } = req.body
  UserModel
    .findOne({ email })
    .then((result)=>{
      if(result) {
        res
          .status(400)
          .send(`${email} is already taken`)
      } else {
        next()
      }
    })
    .catch((err)=>{
      console.log(err)
      res
        .status(500)
        .send('Error Occurred')
    })
}

function hashPassword(req, res, next) {
  const { password } = req.body

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, passwordHash) {
      if(err) {
        res
          .status(500)
          .send('Error')
      } else {
        req.body.password = passwordHash
        next()
      }
    })
  })
}

function loginInputValidation(req, res, next) {
  const { email, password } = req.body
  const missingFields = []

  if(!email) {
    missingFields.push('email')
  }

  if(!password) {
    missingFields.push('password')
  }

  if(missingFields.length) {
    res
      .status(400)
      .send(`The following fields are missing: ${missingFields.join(', ')}`)
  } else {
    next()
  }
}

function findUser(req, res, next) {
  const { email } = req.body

  UserModel
    .findOne({ email: email })
    .then((userDocument)=>{
      if(!userDocument) {
        res
          .status(404)
          .send(`${email} not registered`)
      } else {
        req.userDocument = userDocument
        next()
      }
    })
    .catch((err)=>{
      console.log(err)
      res
        .status(500)
        .send('Error Occurred')
    })
}

function checkPassword(req, res, next) {
  const hashPassword = req.userDocument.password
  const { password } = req.body

  bcrypt.compare(password, hashPassword, function(err, isPasswordCorrect) {
    if(err) {
      console.log(err)
      res
        .status(500)
        .send('Error Occurred')
    } else if(isPasswordCorrect) {
      next()
    } else {
      res
        .status(400)
        .send('Password is incorrect')
    }
  })
}

function provideAccess(req, res, next) {
  res.send(req.userDocument)
}

module.exports = router