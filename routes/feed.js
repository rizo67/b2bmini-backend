const express = require('express');
const { body, validationResult } = require('express-validator');

const User = require('../models/user');

const feedController = require('../controllers/feed');
const userController = require('../controllers/user');
const supplierController = require('../controllers/suppliers');
const isAuth = require('../middleware/is-auth');
const authadmin = require('../middleware/authadmin');

const router = express.Router();


router.get('/posts', feedController.getPosts);// GET /feed/posts

router.get('/allusers', isAuth, feedController.getUsers);

router.post('/oneuser', isAuth, feedController.getOneUser);

// POST /feed/post
router.post('/post', [
    //check('password').isLength({ min: 5 })  
 ], feedController.createPost
);

router.post('/signupuser', [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((email, { req }) => {
        const user = new User ();
        return user.getOneEmail(email).then(result => {
          if (result) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()

 ], userController.signupUser   // POST /feed/signupuser
);

router.post('/loginuser', userController.loginUser);  // POST /feed/loginuser

router.post('/findemail', userController.getOneEmail); // POST /feed/findemail

router.post('/findloadeduser', isAuth, userController.getLoadedUser); // POST /feed/findloadeduser

router.post('/updateuserrole', isAuth, userController.updateUserRole); // POST /feed/updateuserrole

router.get('/findadmins', isAuth, authadmin, userController.getAdminUsers); // POST /feed/findadmins

router.put('/updateoneuser', isAuth, authadmin, feedController.updatePost);
//router.put('/post/:postId', feedController.updatePost);

router.put('/findid', feedController.getOneId);

router.get('/post/:postId', feedController.getPost);

router.post('/deleteuser', isAuth, authadmin, feedController.deleteUser);

module.exports = router;