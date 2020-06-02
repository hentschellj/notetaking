const router = require('express').Router()
const NoteModel = require('./model')

router.get('/', (req, res, next)=>{
  res.send('Get all notes')
})

router.get('/:id', (req, res, next)=>{
  res.send('Get note by id')
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
      res.send('Error Occurred')
    })
})

router.put('/:id', (req, res, next)=>{
  res.send('Update note')
})

router.delete('/:id', (req, res, next)=>{
  res.send('Delete note')
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

module.exports = router