const fs = require('fs');
const path = require('path');
const fileHelper = require('../util/file');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;



const Category = require('../models/productcategories');
const { validationResult } = require('express-validator');



exports.createCategory = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }    
    const title = req.body.title;
    const _id = req.body._id;
    //const imageUrl = req.file.path.replace("\\" ,"/");
        
    const category = new Category (
      title,
      _id,
      //imageUrl,      
    );
try {
    const result = await category.saveCategory();
    //.then(result => {
      console.log(result);
      res.status(201).json({
      message: 'Az adatok mentése sikeresen megtörtént!',
      posts: result
    });
    }
    catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }  
  };

  exports.updateCategory = async (req, res, next) => {
    
    const keresid = req.body.keresid;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    
    const title = req.body.title;
    const _id = req.body._id;

    const category = new Category();
    try {
    const categories = await category.getOneId(keresid)
      //.then(categories => {
        if (categories._id.toString() !== req.body.keresid.toString()) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        category.title = title;
        category._id = new ObjectId(keresid);
      
        const result = await category.saveCategory();
    
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


  exports.getCategories = async (req, res, next) => {
    const category = new Category ();
  try {
    const result = await category.getCategory();
      //.then(result => {
        res
          .status(200)
          .json({
          message: 'Fetched posts successfully.',
          posts: result,
         
        });
    }
    catch(er) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };  

  exports.getOneCategory = async (req, res, next) => {
    const category = new Category ();
    try {
    const result = await category.getOneCategory(req.body.keresonecategory);
    //.then(result => {
      res
        .status(200)
        .json({ message: 'Fetched posts successfully.', posts: result });
    }
    catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };  


  exports.categoryImage = async (req, res, next) => {
    
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
    const category = new Category();
    try {
    const categories = await category.getOneId(keresid);
      //.then(categories => {
        if (categories._id.toString() !== req.body.keresid.toString()) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        category._id = new ObjectId(keresid);
        category.imageUrl = imageUrl;
        console.log(imageUrl);

        if (imageUrl !== category.imageUrl) {
          fileHelper.deleteFile(category.imageUrl);
        }
        const result = await category.saveImage();      
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

  exports.imgurlCategory = async (req, res, next) => {
    
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

    const category = new Category();
    try {
    const categories = await category.getOneId(keresid)
      //.then(brands => {
        if (categories._id.toString() !== req.body.keresid.toString()) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        category._id = new ObjectId(keresid);
        category.imageUrl = imageUrl;
        category.deleteimagename = deleteimagename;
        console.log(imageUrl);
      
        const result = await category.saveImage();
    
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

  exports.deleteCategory = async (req, res, next) => {
    const keresid = req.body.keresid;
    const category = new Category();
    try {
    const categories = await category.getOneId(keresid);
      //.then(categories => {        
        /*fs.unlink(categories.imageUrl, 
        err => console.log(err));*/
        await category.deleteById(categories._id);
        //clearImage();

        console.log(categories.imageUrl);
        console.log('DESTROYED category');
        res.status(200).json({ message: 'Az adatok törlése sikeresen megtörtént!', posts: categories });
      }
      catch(err) {console.log(err)}
  };