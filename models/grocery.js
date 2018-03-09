const mongoose = require('../config/database')
const { Schema } = mongoose

const grocerySchema = new Schema({
  text: { type: String, default: '' },
  price: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'users'},
  householdId: { type: Schema.Types.ObjectId, ref: 'household'}
});

const householdSchema = new Schema({
  name: { type: String, default: 'householdName' },
  count: { type: Number, default: 0 },
  pot: { type: Number, default: 0 },
  week: { type: Number, default: 0 },
  grocerys: [grocerySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model('grocerys', grocerySchema)
