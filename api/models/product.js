const mongoose = require('mongoose');

// design object
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true},
  price: { type: Number, required: true},
  productImage: { type: String, required: true }
});

//constructor based on schema
module.exports = mongoose.model('Product', productSchema);
