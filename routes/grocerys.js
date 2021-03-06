const router = require('express').Router()
const passport = require('../config/auth')
const { Grocery } = require('../models')
const utils = require('../lib/utils')

const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
    .get('/grocerys', (req, res, next) => {
      Grocery.find()
        .sort({ createdAt: 1 })
        .then((grocerys) => res.json(grocerys))
        .catch((error) => next(error))
    })

    .post('/grocerys', authenticate, (req, res, next) => {
      const user = req.account._id
      const newGrocery = { ...req.body, user: user }
      Grocery.create(newGrocery)
        .then((grocery) => {
          io.emit('action', {
            type: 'ADD_GROCERY',
            payload: grocery
          })
          res.json(grocery)
        })
        .catch((error) => next(error))
    })

    .put('/grocerys/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const updatedGrocery = req.body

      Grocery.findByIdAndUpdate(id, { $set: updatedGrocery }, { new: true })
        .then((grocery) => {
          io.emit('action', {
            type: 'GROCERY_LIST_UPDATED',
            payload: grocery
          })
          res.json(grocery)
        })
        .catch((error) => next(error))
    })

    .patch('/grocerys/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const patchForGrocery = req.body

      Grocery.findById(id)
        .then((grocery) => {
          if (!grocery) { return next() }

          const updatedGrocery = { ...grocery, ...patchForGrocery }

          Grocery.findByIdAndUpdate(id, { $set: updatedGrocery }, { new: true })
            .then((grocery) => {
              io.emit('action', {
                type: 'GROCERY_LIST_UPDATED',
                payload: grocery
              })
              res.json(grocery)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })

    .delete('/grocerys', authenticate, (req, res, next) => {
      const id = req.params.id
      Grocery.findByIdAndRemove(id)
        .then(() => {
          io.emit('action', {
            type: 'REMOVE_GROCERYS',
            payload: id
          })
          res.status = 200
          res.json({
            message: 'Removed',
            _id: id
          })
        })
        .catch((error) => next(error))
    })

  return router
}
