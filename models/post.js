const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;

class Post {
 /* email;
  age;
  password;
  confirmPassword;
  country;
  hobbies;
  terms;
  _id; */

    constructor(name, email, age, password, confirmPassword, country, hobbies = [], terms, id, imageUrl) {
      this.name = name;
      this.email = email;
      this.age = age;
      this.password = password;
      this.confirmPassword = confirmPassword;
      this.country = country; // {items: []}
      this.hobbies = hobbies; 
      this.terms = terms;
      this._id = id ? new mongodb.ObjectId(id) : null;
      this.imageUrl = imageUrl;
      
    }

   //save() {
   //   const db = getDb();
   //   return db.collection('users').insertOne(this);
   // }

    save() {
      const db = getDb();
      let dbOp;
      if (this._id) {
        // Update the product
        dbOp = db
          .collection('users')
          .updateOne({ _id: this._id },
            {$set:
              {
            name:this.name,
            email:this.email,
            age:this.age,
            password:this.password,
            confirmPassword:this.confirmPassword,
            country:this.country,
            //$push: { hobbies: this.hobbies},
            hobbies: this.hobbies,
            terms:this.terms,
            _id:this._id,
            imageUrl:this.imageUrl,
              }    
          }
            );
      } else {
        dbOp = db.collection('users').insertOne(
        
            {
          name:this.name, 
          email:this.email,
          age:this.age,
          password:this.password,
          confirmPassword:this.confirmPassword,
          country:this.country,
          //$push: { hobbies: this.hobbies},
          hobbies: this.hobbies,
          terms:this.terms,
          _id:this._id,
          imageUrl:this.imageUrl,
               
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

getOneId(keresid) {
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

module.exports = Post