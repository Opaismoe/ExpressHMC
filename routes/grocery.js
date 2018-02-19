const router = require('express').Router()
const passport = require('../config/auth')
const { Household } = require('../models')
const utils = require('../lib/utils')

const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
    .get('/grocerys', (req, res, next) => {
      Household.find()
        // Newest grocerys first
        .sort({ createdAt: -1 })
        // Send the data in JSON format
        .then((grocerys) => res.json(grocerys))
        // Throw a 500 error if something goes wrong
        .catch((error) => next(error))
    })
    .get('/grocerys/:id', (req, res, next) => {
      const id = req.params.id

      Household.findById(id)
        .then((grocery) => {
          if (!grocery) { return next() }
          res.json(grocery)
        })
        .catch((error) => next(error))
    })
    .post('/grocerys', authenticate, (req, res, next) => {
      const newHousehold = {
        userId: req.account._id,
        players: [{
          userId: req.account._id,
          pairs: []
        }],
        cards: utils.shuffle('✿✪♦✵♣♠♥✖'.repeat(2).split(''))
          .map((symbol) => ({ visible: false, symbol }))
      }

      Household.create(newHousehold)
        .then((grocery) => {
          io.emit('action', {
            type: 'GROCERY_LIST_CREATED',
            payload: grocery
          })
          res.json(grocery)
        })
        .catch((error) => next(error))
    })
    .put('/grocerys/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const updatedHousehold = req.body

      Household.findByIdAndUpdate(id, { $set: updatedHousehold }, { new: true })
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
      const patchForHousehold = req.body

      Household.findById(id)
        .then((grocery) => {
          if (!grocery) { return next() }

          const updatedHousehold = { ...grocery, ...patchForHousehold }

          Household.findByIdAndUpdate(id, { $set: updatedHousehold }, { new: true })
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
    .delete('/grocerys/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      Household.findByIdAndRemove(id)
        .then(() => {
          io.emit('action', {
            type: 'GROCERY_LIST_REMOVED',
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
