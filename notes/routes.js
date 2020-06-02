const router = require('express').Router()
const NoteModel = require('./model')

router.get('/', (req, res, next)=>{
  res.send('Get all notes')
})

router.get('/:id', (req, res, next)=>{
  res.send('Get note by id')
})

router.post('/', (req, res, next)=>{
  const newNote = new NoteModel({
    title: 'New Note',
    body: 'This is a new note'
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

module.exports = router