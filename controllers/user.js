const fs = require('fs');
const path = require('path');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

const User = require('../models/user');
const Roles = require('../models/roles');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signupUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;

    }
    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const role = req.body.role;
    const vendor = req.body.vendor;
    const _id = req.body._id;
    let valami = req.body.organizationid;
    let organizationid;
    if(valami) {
      organizationid = valami;}
      else {organizationid = null;}

    bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User(
        name,
        email,
        hashedPw,
        hashedPw,
        role,
        vendor,
        _id,
        organizationid,
      );
    user.
    saveUser()
    /*.then(result => {
      let newuserid = result.insertedId;
      let keresrole = req.body.role;
      const role = new Roles();
      role.getOneName(keresrole)
      .then(result => {
      role.role = keresrole;
      role.userid = newuserid;
      role.saveRole(); 
        })
    })*/
    .then(result => {
      console.log(result);
      res.status(201).json({
      message: 'Az adatok mentése sikeresen megtörtént!',
      posts: result
    });
  })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }) 
    })
};

  exports.getOneEmail = (req, res, next) => {
    const user = new User ();
    user.getOneEmail(req.body.email)
    .then(result => {
      res
        .status(200)
        .json({ message: 'Fetched posts successfully.', posts: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  };  

  exports.loginUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    const user = new User ();
    user.getOneEmail(email)
      .then(result => {
        if (!result) {
          const error = new Error('A user with this email could not be found.');
          error.statusCode = 401;
          throw error;
        }
        loadedUser = result;
        return bcrypt.compare(password, result.password);
      })
      .then(isEqual => {
        if (!isEqual) {
          const error = new Error('Wrong password!');
          error.statusCode = 401;
          throw error;
        }
        const token = jwt.sign(
          {
            email: loadedUser.email,
            userId: loadedUser._id.toString(),
            role: loadedUser.role,
            organizationid: loadedUser.organizationid,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN, }
        );
        res.status(200).json({ token: token, userId: loadedUser._id.toString(), organizationid: loadedUser.organizationid, role:loadedUser.role, expiresIn: process.env.JWT_EXPIRES_IN });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
  
  exports.getAdminUsers = async (req, res, next) => {

    let keresid = req.userId;
    const user = new User();
    try{
    const findorgid = await user.getOneId(keresid);
    let filterorgid = findorgid.organizationid;
    const result = await user.getAdminUsers(filterorgid);
    
        res.status(200).json({
          message: 'Fetched posts successfully.',
          posts: result, //sum,//result,        
        });console.log(result);
  }
    catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };  