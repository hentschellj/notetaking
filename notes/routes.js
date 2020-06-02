const router = require('express').Router()

router.get('/', (req, res, next)=>{
  res.send('Get all notes')
})

router.get('/:id', (req, res, next)=>{
  res.send('Get note by id')
})

router.post('/', (req, res, next)=>{
  res.send('Create note')
})

router.put('/:id', (req, res, next)=>{
  res.send('Update note')
})

router.delete('/:id', (req, res, next)=>{
  res.send('Delete note')
})

module.exports = router