const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;

class Roles {
 
    constructor(role, userid, id) {
    this.role = role,
    //this.user_id = user_id,
    this.userid = userid ? new mongodb.ObjectId(userid) : null;
    this._id = id ? new mongodb.ObjectId(id, timestamp) : null;       
  } 
  saveRole() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update the role
      dbOp = db
        .collection('roles')
        .updateOne({ role: this.role },  //
          {$push:
            {
          userid: this.userid,     
          role: this.role,
          _id:this._id,
            }    
        }
          );
    } else {
      dbOp = db.collection('roles').insertOne(        
        {
        role: this.role,
        userid: this.userid,      
        _id:this._id,        
      }
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


  getRoles() {
  const db = getDb();
  return db
  .collection('roles')
  .find()
  .toArray()
  .then(roles => {
    console.log(roles);
    return roles;
  })
  .catch(err => {
    console.log(err);
  });
}

getOneRole(keresoneuser) {
const db = getDb();
return db
.collection('roles')
.find(
  //{age: new RegExp(keresoneuser)}
  { $or: [ { admin: new RegExp(keresoneuser) }, { basic: new RegExp(keresoneuser)} ] }
)
.toArray()
.then(roles => {
  console.log(roles);
  return roles;
})
.catch(err => {
  console.log(err);
});
}

getOneId(keresid) {
const db = getDb();
return db
.collection('roles')
.findOne({ _id: new ObjectId(keresid) })
.then(roles => {
  console.log('Lefutottam');
  return roles;
})
.catch(err => {
  console.log(err);
});
}

deleteById(users_id) {
const db = getDb();
return db
  .collection('roles')
  .deleteOne({ _id: new ObjectId(users_id) })
  .then(result => {
    console.log('Törölve');
    return result;
  })
  .catch(err => {
    console.log(err);
  });
}

getOneName(keresrole) {
const db = getDb();
return db
.collection('roles')
.findOne({ role: {role:keresrole} })
.then(result => {
  console.log(result.role);
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


}


module.exports = Roles