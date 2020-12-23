const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;

class Category {
 
    constructor(title, id) {
      this.title = title; 
      this._id = id ? new mongodb.ObjectId(id) : null; 
          
    }
    saveCategory() {
      const db = getDb();
      let dbOp;
      if (this._id) {
        // Update the category
        dbOp = db
          .collection('categories')
          .updateOne({ _id: this._id },
            {$set:
              {
            title: this.title,
            _id:this._id,           
              }    
          }
            );
      } else {
        dbOp = db.collection('categories').insertOne(
        
            {
            title: this.title,
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
  
  
    getCategory() {
    const db = getDb();
    return db
    .collection('categories')
    .find()
    .toArray()
    .then(categories => {
      console.log(categories);
      return categories;
    })
    .catch(err => {
      console.log(err);
    });
}

getOneCategory(keresonecategory) {
  const db = getDb();
  return db
  .collection('categories')
  .find(
    //{age: new RegExp(keresonecategory)}
    { $or: [ { title: new RegExp(keresonecategory) } ] }
  )
  .toArray()
  .then(categories => {
    console.log(categories);
    return categories;
  })
  .catch(err => {
    console.log(err);
  });
}

getOneId(keresid) {
  const db = getDb();
  return db
  .collection('categories')
  .findOne({ _id: new ObjectId(keresid) })
  .then(categories => {
    console.log(categories);
    return categories;
  })
  .catch(err => {
    console.log(err);
  });
}

deleteById(categories_id) {
  const db = getDb();
  return db
    .collection('categories')
    .deleteOne({ _id: new ObjectId(categories_id) })
    .then(result => {
      console.log('Törölve');
      return result;
    })
    .catch(err => {
      console.log(err);
    });
}

saveImage() {
  const db = getDb();
  let dbOp;
  if (this._id) {
    dbOp = db
      .collection('categories')
      .updateOne({ _id: this._id },
        {$set:{
          imageUrl:this.imageUrl,
          deleteimagename:this.deleteimagename,
        }}
        );
  //} else {
    //dbOp = db.collection('categories').updateOne(
    //{ _id: this._id },
    //{ $set: {imageUrl:"images\DSM1010.JPG"} },
    //false,
    //true
  //);
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

module.exports = Category