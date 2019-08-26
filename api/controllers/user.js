const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.user_signup = (req, res, next) => {

  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'email is already linked to an existing account'
        });
      }
      else {
        bcrypt.hash(req.body.password, 10, (err, hash) =>{
          if (err) {
            return res.status(500).json({
                error: err
            });
          } else {
      
            console.log(hash);
      
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash 
            });
      
            //status 201 when creating resource
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message : 'User created'
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({error : err})
              });
      
          }
        });
      }
    })
}

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email})
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        });

      }else {
        bcrypt.compare( req.body.password, user[0].password, ( err, result) => {
          if (err) {
            return res.status(401).json({
              message: 'Auth failed'
            });

          }
          //result is the truth value of comparison
          if ( result ) {

            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              }, 
              process.env.JWT_KEY, 
              {
                expiresIn: "1h"
              }
            );

            return res.status(200).json({
              message: 'Auth successful',
              token: token
            });
            
          } else {
            return res.status(401).json({
              message: 'Auth failed'
            }); 
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error : err})
    });
}

exports.user_delete_user = (req, res, next) => {
  const id = req.params.userId;
  User.remove({_id: id})
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'User deleted',
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
}
