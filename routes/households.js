const router = require('express').Router()
const passport = require('../config/auth')
const { Household } = require('../models')
const utils = require('../lib/utils')

const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
    .get('/household', (req, res, next) => {
      Household.find()
        // Newest household first
        .sort({ createdAt: -1 })
        // Send the data in JSON format
        .then((household) => res.json(household))
        // Throw a 500 error if something goes wrong
        .catch((error) => next(error))
    })

    .get('/household/:id', (req, res, next) => {
      const id = req.params.id

      Household.findById(id)
        .then((household) => {
          if (!household) { return next() }
          res.json(household)
        })
        .catch((error) => next(error))
    })
    .post('/household', authenticate, (req, res, next) => {
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
        .then((household) => {
          io.emit('action', {
            type: 'GAME_CREATED',
            payload: household
          })
          res.json(household)
        })
        .catch((error) => next(error))
    })
    .put('/household/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const updatedHousehold = req.body

      Household.findByIdAndUpdate(id, { $set: updatedHousehold }, { new: true })
        .then((household) => {
          io.emit('action', {
            type: 'GAME_UPDATED',
            payload: household
          })
          res.json(household)
        })
        .catch((error) => next(error))
    })
    .patch('/household/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const patchForHousehold = req.body

      Household.findById(id)
        .then((household) => {
          if (!household) { return next() }

          const updatedHousehold = { ...household, ...patchForHousehold }

          Household.findByIdAndUpdate(id, { $set: updatedHousehold }, { new: true })
            .then((household) => {
              io.emit('action', {
                type: 'GAME_UPDATED',
                payload: household
              })
              res.json(household)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    .delete('/household/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      Household.findByIdAndRemove(id)
        .then(() => {
          io.emit('action', {
            type: 'GAME_REMOVED',
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
