const fs = require('fs');
const path = require('path');
const fileHelper = require('../util/file');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;



const Product = require('../models/product');
const User = require('../models/user');
const { validationResult } = require('express-validator');



exports.createProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }    
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const artnumber = req.body.artnumber;
    const category = req.body.category; 
    const brand = req.body.brand;
    const _id = req.body._id;
    let creator = req.userId;

    let keresid = req.userId;
    const user = new User();
    const findorgid = await user.getOneId(keresid);
    let organizationid = findorgid.organizationid;

    const product = new Product (
      title,
      description,
      price,
      artnumber,
      category,
      brand,
      _id,
      creator,
      organizationid,
    )
    try {
    const resultsaveproduct  = await product.saveProduct();
    //.then(result => {
      let createdposts = resultsaveproduct.insertedId;
      //let keresid = req.userId;
      //const user = new User();     
      //.then(users => {      
      user.createdposts = createdposts;
      user._id = new ObjectId(keresid);     
      const result = await user.saveCreatedPosts();      
    //.then(result => {     
      res.status(201).json({
      message: 'Az adatok mentése sikeresen megtörtént!',
      posts: result
    });
    }
    catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);     
  }
};


  exports.updateProduct = async (req, res, next) => {
    
    const keresid = req.body.keresid;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const artnumber = req.body.artnumber;
    const category = req.body.category; 
    const brand = req.body.brand;
    const _id = req.body._id;

    let keresorgid = req.userId;
    const user = new User();
    const findorgid = await user.getOneId(keresorgid);
    let organizationid = findorgid.organizationid;

    const product = new Product();
    try {
    const products = await product.getOneId(keresid);
      //.then(products => {
        if (products._id.toString() !== req.body.keresid.toString()) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        if (products.organizationid !==  organizationid  || product.creator !== req.userId) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
        }
        product.title = title;
        product.description = description;
        product.price = price;
        product.artnumber = artnumber;
        product.category = category;
        product.brand = brand;
        product._id = new ObjectId(keresid);
      
        const result = await product.saveProduct();
    
      //.then(result => {
        res.status(200).json({ message: 'Az adatok mentése sikeresen megtörtént!', posts: result });
    }
      catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
  };


  exports.getProducts = async (req, res, next) => {

    let keresid = req.userId;
    const user = new User();
    const findorgid = await user.getOneId(keresid);
    let filterorgid = findorgid.organizationid;

    //const filtercreator = req.userId;
    const product = new Product ();   
    try {
    const result = await product.getProduct(filterorgid);
      //.then(result => {        
    /*const allresult = result;
      let sum = [];         
        for (var k in allresult) {
          if (allresult[k].creator == req.userId) {
            sum.push(allresult[k])}}*/
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


  exports.productImage = async (req, res, next) => {
    
    const keresid = req.body.keresid;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      const error = new Error('No file picked.');
      error.statusCode = 422;
      throw error;
    }
    const product = new Product();
    try {
    const products = await product.getOneId(keresid);
      //.then(products => {
        if (products._id.toString() !== req.body.keresid.toString()) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        product._id = new ObjectId(keresid);
        product.imageUrl = imageUrl;
        console.log(imageUrl);

        if (imageUrl !== product.imageUrl) {
          fileHelper.deleteFile(product.imageUrl);
        }
        
        const result = await product.saveImage();
      
      //.then(result => {
        res.status(200).json({ message: 'Az adatok mentése sikeresen megtörtént!', posts: result });
      }
      catch(err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
  };

  //const clearImage = filePath => {
  //  filePath = path.join(__dirname, '..', filePath);
  //  fs.unlink(filePath, err => console.log(err));
  //};

  exports.imgurlProduct = async (req, res, next) => {
    
    const keresid = req.body.keresid;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    
    const imageUrl = req.body.image;
    const deleteimagename = req.body.deleteimagename;
    const _id = req.body._id;

    const product = new Product();
    try {
    const products = await product.getOneId(keresid)
      //.then(brands => {
        if (products._id.toString() !== req.body.keresid.toString()) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        product._id = new ObjectId(keresid);
        product.imageUrl = imageUrl;
        product.deleteimagename = deleteimagename;
        console.log(imageUrl);
      
        const result = await product.saveImage();
    
      //.then(result => {
        res.status(200).json({ message: 'Az adatok mentése sikeresen megtörtént!', posts: result });
      }
      catch(err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
  };


  exports.deleteProduct = async (req, res, next) => {
    const keresproductid = req.body.keresid;
    const product = new Product();
    try {
    const products = await product.getOneId(keresproductid);
      //.then(products => {      
        if (products.creator.toString() !== req.userId.toString() ) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
          console.log(req.userId);
        }  
        fs.unlink(products.imageUrl, 
        err => console.log(err));
        await product.deleteById(products._id)
        //clearImage();
        //.then(result => {
          let post_id = products._id;
          let keresid = req.userId;
          const user = new User();
          await user.getOneId(keresid)
          //.then(users => {
          //user.createdposts = post_id;
          user._id = new ObjectId(keresid);
          user.deleteCreatedPosts(post_id); 
          
        console.log(products.imageUrl);
        console.log('DESTROYED PRODUCT');
        res.status(200).json({ message: 'Az adatok törlése sikeresen megtörtént!', posts: products });
      }
      catch(err) {console.log(err)}   
  };