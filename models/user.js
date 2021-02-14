const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;
var timestamp = Math.floor(new Date().getTime()/1000);
// Create a date with the timestamp
var timestampDate = new Date(timestamp*1000);

class User {
 
      constructor(name, email, password, confirmPassword, role, vendor, id, organizationid) {
      this.name = name,
      this.email = email;
      this.password = password;
      this.confirmPassword = confirmPassword;
      this.role = role; 
      this.vendor = vendor;
      this._id = id ? new mongodb.ObjectId(id, timestamp) : null;
      this.organizationid = organizationid; //mongodb.ObjectId(organizationid);     
    }
    saveUser() {
      const db = getDb();
      let dbOp;
      if (this._id) {
        // Update the user
        dbOp = db
          .collection('users')
          .updateOne({ _id: this._id },
            {$set:
              {
            name: this.name,      
            email:this.email,
            password:this.password,
            confirmPassword:this.confirmPassword,
            role: this.role,
            vendor: this.vendor,
            _id:this._id,
              }    
          }
            );
      } else {
        dbOp = db.collection('users').insertOne(        
            {
            name: this.name,      
          email:this.email,
          password:this.password,
          confirmPassword:this.confirmPassword,
          role:this.role,
          vendor:this.vendor,
          _id:this._id,
          organizationid:this.organizationid,
          
        }
        );
      }
      return dbOp
        .then(result => {
          console.log(result);
          return result;
        })
        .catch(err => {
          console.log(err);
        });
    }
   
    getUsers() {
    const db = getDb();
    return db
    .collection('users')
    .find()
    .toArray()
    .then(users => {
      console.log(users);
      return users;
    })
    .catch(err => {
      console.log(err);
    });
}

getAdminUsers(filterorgid) {
  const db = getDb();
  return db
  .collection('users')
  .find({ organizationid: filterorgid })//ObjectId(filterorgid) })
  .toArray()
  .then(admins => {
    console.log(admins);
    return admins;
  })
  .catch(err => {
    console.log(err);
  });
}

getOneUser(keresoneuser) {
  const db = getDb();
  return db
  .collection('users')
  .find(
    //{age: new RegExp(keresoneuser)}
    { $or: [ { email: new RegExp(keresoneuser) }, { age: new RegExp(keresoneuser)} ] }
  )
  .toArray()
  .then(users => {
    console.log(users);
    return users;
  })
  .catch(err => {
    console.log(err);
  });
}

getLoadedUser(keresid) {
  const db = getDb();
  return db
  .collection('users')
  .findOne({ _id: new ObjectId(keresid) })
  .then(users => {
    console.log(users);
    return users;
  })
  .catch(err => {
    console.log(err);
  });
}

getOneId(keresid) {
  const db = getDb();
  return db
  .collection('users')
  .findOne({ _id: new ObjectId(keresid) })
  .then(users => {
    console.log('Lefutottam', users);
    return users;
  })
  .catch(err => {
    console.log(err);
  });
}

deleteById(users_id) {
  const db = getDb();
  return db
    .collection('users')
    .deleteOne({ _id: new ObjectId(users_id) })
    .then(result => {
      console.log('Törölve');
      return result;
    })
    .catch(err => {
      console.log(err);
    });
}

getOneEmail(email) {
  const db = getDb();
  return db
  .collection('users')
  .findOne({ email: email })
  .then(result => {
    return result;
  })
  .catch(err => {
    console.log(err);
  });
}

saveCreatedPosts() {
  const db = getDb();
  let dbOp;
  if (this._id) {
    // Update the user
    dbOp = db
      .collection('users')
      .updateOne({ _id: this._id },
        {$push:{createdposts:this.createdposts}}
        ); 
  }
  return dbOp
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
}

deleteCreatedPosts(post_id) {
  const db = getDb();
  let dbOp;
  if (this._id) {
    // Update the user
    dbOp = db
      .collection('users')
      .updateOne({ _id: this._id },
        {$pull:{createdposts:post_id}}
        ); 
  } 
  return dbOp
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
}

saveOrganization() {
  const db = getDb();
  let dbOp;
  if (this._id) {
    // Update the user
    dbOp = db
      .collection('users')
      .updateOne({ _id: this._id },
        {$set:{organizationid:this.organizationid}}
        ); 
  }
  return dbOp
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
}

deleteOrganization(post_id) {
  const db = getDb();
  let dbOp;
  if (this._id) {
    // Update the user
    dbOp = db
      .collection('users')
      .updateOne({ _id: this._id },
        {$unset:{organizationid:this.post_id}}
        )
  } 
  return dbOp
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
}

}

  /*class Post {
    constructor(username, email, cart, id, password) {
      this.name = username;
      this.email = email;
      this.cart = cart; // {items: []}
      this._id = id ? new mongodb.ObjectId(id) : null;
      this.password = password;
    }
  
    save() {
      const db = getDb();
      return db.collection('users').insertOne(this);
    }
  }  */

module.exports = User