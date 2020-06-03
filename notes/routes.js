const router = require('express').Router()
const NoteModel = require('./model')
const passport = require('../auth')

router.get('/', passport.authenticate('bearer', { session: false }), (req, res, next)=>{
  NoteModel
    .find()
    .then((results)=>{
      if(!results) {
        res
          .status(404)
          .send('No notes found')
      } else {
        res.json(results)
      }
    })
    .catch((err)=>{
      console.log(err)
      res
        .status(500)
        .send('Error Occurred')
    })
})

router.get('/:id', (req, res, next)=>{
  NoteModel
    .findById(req.params.id)
    .then((results)=>{
      if(!results) {
        res
          .status(404)
          .send('No note found')
      } else {
        res.json(results)
      }
    })
    .catch((err)=>{
      console.log(err)
      res
        .status(500)
        .send('Error Occurred')
    })
})

router.post('/', inputValidation, (req, res, next)=>{
  const newNote = new NoteModel({
    title: req.body.title,
    body: req.body.body
  })
  newNote
    .save()
    .then((document)=>{
      if(document) {
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

router.put('/:id', updateInputValidation, (req, res, next)=>{
  NoteModel
    .findOneAndUpdate({ _id: req.params.id }, req.updateObj, {new: true})
    .then((results)=>{
      if(!results) {
        res
          .status(404)
          .send('No note found')
      } else {
        res.send(results)
      }
    })
    .catch((err)=>{
      console.log(err)
      res
        .status(500)
        .send('Error Occurred')
    })
})

router.delete('/:id', (req, res, next)=>{
  NoteModel
    .findOneAndRemove({ _id: req.params.id })
    .then((results)=>{
      if(!results) {
        res
          .status(404)
          .send('No note found')
      } else {
        res.send('Successfully deleted')
      }
    })
    .catch((err)=>{
      console.log(err)
      res
        .status(500)
        .send('Error Occurred')
    })
})

function inputValidation(req, res, next) {
  const { title, body } = req.body
  const missingFields = []

  if(!title) {
    missingFields.push('title')
  }

  if(!body) {
    missingFields.push('body')
  }

  if(missingFields.length) {
    res
      .status(400)
      .send(`The following fields are missing: ${missingFields.join(', ')}`)
  } else {
    next()
  }
}

function updateInputValidation(req, res, next) {
  const { title, body } = req.body
  const updateObj = {}

  if(title) {
    updateObj.title = title
  }

  if(body) {
    updateObj.body = body
  }

  req.updateObj = updateObj

  next()
}

module.exports = router