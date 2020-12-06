const fs = require('fs');
const path = require('path');
const fileHelper = require('../util/file');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;



const Post = require('../models/post');
const { validationResult } = require('express-validator');


exports.getPosts = (req, res, next) => {
  Post.find()
  .then(posts => {
    res
      .status(200)
      .json({ message: 'Fetched posts successfully.', posts: posts });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};
  
exports.getUsers = (req, res, next) => {
  const post = new Post ();
  
  post.getUsers()
    .then(posts => {
      res
        .status(200)
        .json({
        message: 'Fetched posts successfully.',
        posts: posts,
       
      });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};  

exports.getOneUser = (req, res, next) => {
  const post = new Post ();
  post.getOneUser(req.body.keresoneuser)
  .then(posts => {
    res
      .status(200)
      .json({ message: 'Fetched posts successfully.', posts: posts });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};  

exports.getOneId = (req, res, next) => {
  const post = new Post ();
  post.getOneId(req.body.keresid)
  .then(posts => {
    res
      .status(200)
      .json({ message: 'Fetched posts successfully.', posts: posts });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};  


  //create post in database
  exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;

    }
    if (!req.file) {
      const error = new Error('No image provided.');
      error.statusCode = 422;
      throw error;
    }
    const name = req.body.name;
    const email = req.body.email;
    const age = req.body.age;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const country = req.body.country; 
    const hobbies = req.body.hobbies;
    const terms = req.body.terms;
    const _id = req.body._id;
    const imageUrl = req.file.path.replace("\\" ,"/");
    
    const post = new Post (
      name,
      email,
      age,
      password,
      confirmPassword,
      country,
      hobbies,
      terms,
      _id,
      imageUrl
      /*name,
      email,
      cart,
      _id,
      password,  */
    );
    post.
    save()
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
    });   
  };


  exports.updatePost = (req, res, next) => {
    
    const keresid = req.body.keresid;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    //const title = req.body.title;
    //const content = req.body.content;
    const name = req.body.name;
    const email = req.body.email;
    const age = req.body.age;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const country = req.body.country; 
    const hobbies = req.body.hobbies;
    const terms = req.body.terms;
    
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      const error = new Error('No file picked.');
      error.statusCode = 422;
      throw error;
    }
    const post = new Post();
    post.getOneId(keresid)
    .then(users => {
      if (users._id.toString() !== req.body.keresid.toString()){
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        //if (imageUrl !== p.imageUrl) {
          //clearImage(p.imageUrl);
        //}
        //post.title = title;
        //post.imageUrl = imageUrl;
        //post.content = content;

        post._id = new ObjectId(keresid);
        post.name = name;
        post.email = email;
        post.age = age;
        post.password = password;
        post.confirmPassword = confirmPassword;
        post.country = country;
        post.hobbies = hobbies;
        post.terms = terms;
        post.imageUrl = imageUrl;

        if (imageUrl !== post.imageUrl) {
          fileHelper.deleteFile(post.imageUrl);
        }

        return post.save();
      })
      .then(result => {
        res.status(200).json({ message: 'Az adatok mentése sikeresen megtörtént!', posts: result });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
  
  /*const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
  };*/

  exports.deleteUser = (req, res, next) => {
    const keresid = req.body.keresid;
    const post = new Post();
    post.getOneId(keresid)
      .then(users => {
        fs.unlink(users.imageUrl, err => console.log(err));
        post.deleteById(users._id);
        //clearImage();

        console.log(users.imageUrl);
        console.log('DESTROYED PRODUCT');
        res.status(200).json({ message: 'Az adatok törlése sikeresen megtörtént!', posts: users });
      })
      .catch(err => console.log(err));
  };
  

  exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
      .then(post => {
        if (!post) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ message: 'Post fetched.', post: post });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
