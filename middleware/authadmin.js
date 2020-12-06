const Product = require('../models/product');
const User = require('../models/user');


/*function authrole() {
 return */
 module.exports = (req, res, next) => {
  let keresid = req.userId;
  const user = new User();
  user.getOneId(keresid)
  .then(users => {
    console.log(users.role)
    if (users.role !== 'admin' ) {
        const error = new Error('Not authorized!');
        error.statusCode = 401;
        throw error;
  }

      next()
  })
    }
//}

//module.exports = {authrole}

/*let keresid = req.userId;
      const user = new User();
      user.getOneId(keresid)
      .then(users => {
      user.createdposts = createdposts;
      user._id = new ObjectId(keresid);
      user.saveCreatedPosts(); 
        })*/