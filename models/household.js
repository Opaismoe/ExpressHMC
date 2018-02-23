const mongoose = require('../config/database')
const { Schema } = mongoose

const householdSchema = new Schema({
  householdCount: { type: Number, default: 0 },
  householdPot: { type: Number, default: 0 },
  week: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('households', householdSchema)
