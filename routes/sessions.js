const router = require('express').Router()
const jwt = require('jsonwebtoken')
const passport = require('../config/auth')
const { User } = require('../models')
const jwtOptions = require('../config/jwt')

router.post('/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const error = new Error(info.message)
      return next(error);
    }

    const payload = { id: user._id }
    const token = jwt.sign(payload, jwtOptions.secretOrKey)
    return res.json({ token })
  })(req, res, next);
});

module.exports = router
