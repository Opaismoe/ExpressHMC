const mongoose = require('../config/database')
const { Schema } = mongoose

const potSchema = new Schema({
  totalAmount: { type: Number, default: 0 },
})

const householdSchema = new Schema({
  householdCount: { type: Number, default: 0 },
  householdPot: { type: Number, default: 0 },
  week: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const grocerySchema = new Schema({
  text: { type: String, default: '' },
  price: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'users'},
  pot: [potSchema],
  household: [householdSchema],
});


module.exports = mongoose.model('grocerys', grocerySchema)
