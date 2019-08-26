const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//import order model
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');


router.get('/', checkAuth, (req, res, next) => {
  // select fetches only specified fields
    // map() maps to new array
    //populate, populates given property from model, input specific properties 
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name' )
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id
            }
          }
        })
      };

      if (docs.length >= 0) {
        res.status(200).json(response);
      }
      else{
        res.status(404).json({
          message: 'No entires found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error : err
      });
    });
  });

router.post('/', checkAuth, (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {

      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }

      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      //with save you get real promise by default
      
      return order
      .save()
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message : 'Order Stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/' + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
})

router.get('/:orderId', checkAuth, (req, res, next) => {
  Order.findById(req.params.orderId)
  .populate('product')
  .exec()
  .then(order => {
    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      })
    }

    res.status(200).json({
      order: order,
      request: {
        type: 'GET',
        url: 'http://localhost:3000/orders/'

      }
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

router.delete('/:orderId', checkAuth, (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders/',
          body: {productId: 'ID', quantity: 'Number'}
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
  });

module.exports = router
