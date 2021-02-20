const fs = require('fs');
const path = require('path');
const fileHelper = require('../util/file');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;



const Supplier = require('../models/suppliers');
const User = require('../models/user');
const { validationResult } = require('express-validator');



exports.createSupplier = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }

    const title = req.body.title;
    const _id = req.body._id;
    let creator = req.userId;
    
    const supplier = new Supplier (
      title,
      _id,
      creator,
    );
   
    const user = new User();
    const findorgid = await user.getOneId(creator);
    let filterorgid = findorgid.organizationid;  //ellenőrizzük, hogy van-e már szállító felvéve, csak akkor engedni menteni, ha nincs
    try {
      if (filterorgid !=null) {   //ellenőrizzük, hogy van-e már szállító felvéve, csak akkor engedni menteni, ha nincs
        const error = new Error('A szállító már létezik');
        error.statusCode = 404;
        throw error;
      }
    const resultsavesupplier = await supplier.saveSupplier();
    //.then(result => {
      let createdposts = resultsavesupplier.insertedId;
      let organizationid = resultsavesupplier.insertedId.toString();
      let keresid = req.userId;
      const user = new User();
      await user.getOneId(keresid)
      //.then(users => {
      user.createdposts = createdposts;
      user.organizationid = organizationid;
      user._id = new ObjectId(keresid);
      const result = await user.saveCreatedPosts(); 
      const result2 = await user.saveOrganization();
    //.then(result => {
      console.log(result, result2);
      res.status(201).json({
      message: 'Az adatok mentése sikeresen megtörtént!',
      posts: result, result2
    });
    }
    catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }   
  };

  exports.updateSupplier = async (req, res, next) => {
    
    const keresid = req.body.keresid;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    
    const title = req.body.title;
    const _id = req.body._id;

    const supplier = new Supplier();
    try{
    const suppliers = await supplier.getOneId(keresid)
      //.then(suppliers => {
        if (suppliers._id.toString() !== req.body.keresid.toString()) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        supplier.title = title;
        supplier._id = new ObjectId(keresid);
      
        const result = await supplier.saveSupplier();
      
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


  /*exports.getSupplier = async (req, res, next) => {
    const supplier = new Supplier ();
    try {
    const result = await supplier.getSupplier();
      //.then(result => {
        res
          .status(200)
          .json({
          message: 'Fetched posts successfully.',
          posts: result,
         
        });
      }
    catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };  */

  exports.getSuppliers = async (req, res, next) => {
    const supplier = new Supplier ();
    try {
      let keresid = req.userId;
      const user = new User();
      const resultid = await user.getOneId(keresid);
       let organization = resultid.organizationid;
    const result = await supplier.getSupplier(organization);
      //.then(result => {
        res
          .status(200)
          .json({
          message: 'Fetched posts successfully.',
          posts: result,
         
        });
      }
    catch(err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };  

  exports.getOneSupplier = async (req, res, next) => {
    const supplier = new Supplier ();
    try {
    const result = await supplier.getOneSupplier(req.body.keresonesupplier);
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

  exports.getLoadedSupplier = async (req, res, next) => {
    const supplier = new Supplier ();
    try {
    const result = await supplier.getOneId(req.body.keresid);
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


  exports.supplierImage = async (req, res, next) => {
    
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
    const supplier = new Supplier();
    try {
    const suppliers = await supplier.getOneId(keresid);
      //.then(suppliers => {
        if (suppliers._id.toString() !== req.body.keresid.toString()) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        supplier._id = new ObjectId(keresid);
        supplier.imageUrl = imageUrl;
        console.log(imageUrl);

        if (imageUrl !== supplier.imageUrl) {
          fileHelper.deleteFile(supplier.imageUrl);
        }
        
        const result = await supplier.saveImage();
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

  exports.imgurlSupplier = async (req, res, next) => {
    
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

    const supplier = new Supplier();
    try {
    const suppliers = await supplier.getOneId(keresid)
      //.then(brands => {
        if (suppliers._id.toString() !== req.body.keresid.toString()) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        supplier._id = new ObjectId(keresid);
        supplier.imageUrl = imageUrl;
        supplier.deleteimagename = deleteimagename;
        console.log(imageUrl);
      
        const result = await supplier.saveImage();
    
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


  exports.deleteSupplier = async (req, res, next) => {
    const keresid2 = req.body.keresid;
    const supplier = new Supplier();
    try {
    const suppliers = await supplier.getOneId(keresid2)
      //.then(suppliers => {      
        if (suppliers.creator.toString() !== req.userId.toString() ) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
          console.log(req.userId);
        }  
        /*fs.unlink(suppliers.imageUrl, 
        err => console.log(err));*/
        const result = await supplier.deleteById(suppliers._id)
        //clearImage();
        //.then(result => {
          let post_id = suppliers._id;
          let keresid = req.userId;
          const user = new User();
          await user.getOneId(keresid)
          //.then(users => {
          //user.createdposts = post_id;
          user._id = new ObjectId(keresid);
          user.deleteOrganization(post_id);        
        console.log(suppliers.imageUrl);
        console.log('DESTROYED SUPPLIER');
        res.status(200).json({ message: 'Az adatok törlése sikeresen megtörtént!', posts: suppliers });
      }
      catch(err) {console.log(err)};
  };

  