const fs = require('fs');
const path = require('path');
const fileHelper = require('../util/file');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;



const Brand = require('../models/productbrands');
const { validationResult } = require('express-validator');



exports.createBrand = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }    
    const title = req.body.title;
    const _id = req.body._id;
    //const imageUrl = req.file.path.replace("\\" ,"/");
        
    const brand = new Brand (
      title,
      _id,
      //imageUrl,      
    );
try {
    const result = await brand.saveBrand();
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

  exports.updateBrand = async (req, res, next) => {
    
    const keresid = req.body.keresid;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    
    const title = req.body.title;
    const _id = req.body._id;

    const brand = new Brand();
    try {
    const brands = await brand.getOneId(keresid)
      //.then(brands => {
        if (brands._id.toString() !== req.body.keresid.toString()) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        brand.title = title;
        brand._id = new ObjectId(keresid);
      
        const result = await brand.saveBrand();
    
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


  exports.getBrands = async (req, res, next) => {
    const brand = new Brand();
  try {
    const result = await brand.getBrand();
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

  exports.getOneBrand = async (req, res, next) => {
    const brand = new Brand();
    try {
    const result = await brand.getOneBrand(req.body.keresonebrand);
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


  exports.brandImage = async (req, res, next) => {
    
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
    /*if (!imageUrl) {
      const error = new Error('No file picked.');
      error.statusCode = 422;
      throw error;
    }*/
    const brand = new Brand();
    try {
    const brands = await brand.getOneId(keresid);
      //.then(brands => {
        if (brands._id.toString() !== req.body.keresid.toString()) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        brand._id = new ObjectId(keresid);
        brand.imageUrl = imageUrl;
        console.log(imageUrl);

        if (imageUrl !== brand.imageUrl) {
          fileHelper.deleteFile(brand.imageUrl);
        }
        const result = await brand.saveImage();      
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

  exports.imgurlBrand = async (req, res, next) => {
    
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

    const brand = new Brand();
    try {
    const brands = await brand.getOneId(keresid)
      //.then(brands => {
        if (brands._id.toString() !== req.body.keresid.toString()) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        brand._id = new ObjectId(keresid);
        brand.imageUrl = imageUrl;
        brand.deleteimagename = deleteimagename;
        console.log(imageUrl);
      
        const result = await brand.saveImage();
    
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

  exports.deleteBrand = async (req, res, next) => {
    const keresid = req.body.keresid;
    const brand = new Brand();
    try {
    const brands = await brand.getOneId(keresid);
      //.then(brands => {        
        /*fs.unlink(brands.imageUrl, 
        err => console.log(err));*/
        await brand.deleteById(brands._id);
        //clearImage();

        console.log(brands.imageUrl);
        console.log('DESTROYED brand');
        res.status(200).json({ message: 'Az adatok törlése sikeresen megtörtént!', posts: brands });
      }
      catch(err) {console.log(err)}
  };