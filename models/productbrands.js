const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;

class Brand {
 
    constructor(title, id) {
      this.title = title; 
      this._id = id ? new mongodb.ObjectId(id) : null; 
          
    }
    saveBrand() {
      const db = getDb();
      let dbOp;
      if (this._id) {
        // Update the category
        dbOp = db
          .collection('brands')
          .updateOne({ _id: this._id },
            {$set:
              {
            title: this.title,
            _id:this._id,           
              }    
          }
            );
      } else {
        dbOp = db.collection('brands').insertOne(
        
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
  
  
    getBrand() {
    const db = getDb();
    return db
    .collection('brands')
    .find()
    .toArray()
    .then(brands => {
      console.log(brands);
      return brands;
    })
    .catch(err => {
      console.log(err);
    });
}

getOneBrand(keresonebrand) {
  const db = getDb();
  return db
  .collection('brands')
  .find(
    //{age: new RegExp(keresonebrand)}
    { $or: [ { title: new RegExp(keresonebrand) } ] }
  )
  .toArray()
  .then(brands => {
    console.log(brands);
    return brands;
  })
  .catch(err => {
    console.log(err);
  });
}

getOneId(keresid) {
  const db = getDb();
  return db
  .collection('brands')
  .findOne({ _id: new ObjectId(keresid) })
  .then(brands => {
    console.log(brands);
    return brands;
  })
  .catch(err => {
    console.log(err);
  });
}

deleteById(brands_id) {
  const db = getDb();
  return db
    .collection('brands')
    .deleteOne({ _id: new ObjectId(brands_id) })
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
    // Update the product
    dbOp = db
      .collection('brands')
      .updateOne({ _id: this._id },
        {$set:{
          imageUrl:this.imageUrl,
          deleteimagename:this.deleteimagename,
        }}
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

module.exports = Brand