const mongoose = require('mongoose');

// design object
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number
});

//constructor based on schema
module.exports = mongoose.model('Product', productSchema);
