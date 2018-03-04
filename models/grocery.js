const mongoose = require('../config/database')
const { Schema } = mongoose

const grocerySchema = new Schema({
  text: { type: String, default: '' },
  price: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'users'},
});

module.exports = mongoose.model('grocerys', grocerySchema)
