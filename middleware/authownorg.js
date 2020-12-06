const User = require('../models/user');

 module.exports = (req, res, next) => {
  let keresid = req.userId;
  const user = new User();
  user.getOneId(keresid)
  .then(users => {
    console.log(users.role)
    if (users.organizationid !== 'admin' ) {
        const error = new Error('Not authorized!');
        error.statusCode = 401;
        throw error;
  }

      next()
  })
    }