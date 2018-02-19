const mongoose = require('../config/database')
const { Schema } = mongoose

const grocerySchema = new Schema({
  allowance: { type: Number, default: 0 },
  toGet: { type: String, default: '' },
  gotProducts: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
});

const householdSchema = new Schema({
  householdCount: { type: Number, default: 0 },
  week: { type: Number, default: 0 },
  weekProducts: [grocerySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('households', householdSchema)
