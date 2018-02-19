// routes/households.js
const router = require('express').Router()
const passport = require('../../config/auth')
const { Household, User } = require('../../models')

const authenticate = passport.authorize('jwt', { session: false })

const loadHousehold = (req, res, next) => {
  const id = req.params.id

  Household.findById(id)
    .then((household) => {
      req.household = household
      next()
    })
    .catch((error) => next(error))
}

const getPlayers = (req, res, next) => {
  Promise.all(req.household.players.map(player => User.findById(player.userId)))
    .then((users) => {
      // Combine player data and user's name
      req.players = req.household.players.map((player) => {
        const { name } = users
          .filter((u) => u._id.toString() === player.userId.toString())[0]

        return {
          userId: player.userId,
          name
        }
      })
      next()
    })
    .catch((error) => next(error))
}

module.exports = io => {
  router
    .get('/households/:id/players', loadHousehold, getPlayers, (req, res, next) => {
      if (!req.household || !req.players) { return next() }
      res.json(req.players)
    })

    .post('/households/:id/players', authenticate, loadHousehold, (req, res, next) => {
      if (!req.household) { return next() }

      const userId = req.account._id

      if (req.household.players.filter((p) => p.userId.toString() === userId.toString()).length > 0) {
        const error = Error.new('You already joined this household!')
        error.status = 401
        return next(error)
      }

      // Add the user to the players
      req.household.players.push({ userId, pairs: [] })

      req.household.save()
        .then((household) => {
          req.household = household
          next()
        })
        .catch((error) => next(error))
    },
    // Fetch new player data
    getPlayers,
    // Respond with new player data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'GAME_PLAYERS_UPDATED',
        payload: {
          household: req.household,
          players: req.players
        }
      })
      res.json(req.players)
    })

    .delete('/households/:id/players', authenticate, (req, res, next) => {
      if (!req.household) { return next() }

      const userId = req.account._id
      const currentPlayer = req.household.players.filter((p) => p.userId.toString() === userId.toString())[0]

      if (!currentPlayer) {
        const error = Error.new('You are not a player of this household!')
        error.status = 401
        return next(error)
      }

      req.household.players = req.household.players.filter((p) => p.userId.toString() !== userId.toString())
      req.household.save()
        .then((household) => {
          req.household = household
          next()
        })
        .catch((error) => next(error))

    },
    // Fetch new player data
    getPlayers,
    // Respond with new player data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'GAME_PLAYERS_UPDATED',
        payload: {
          household: req.household,
          players: req.players
        }
      })
      res.json(req.players)
    })

  return router
}
