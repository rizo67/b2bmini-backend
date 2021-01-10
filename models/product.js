const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;
var timestamp = Math.floor(new Date().getTime()/1000);
// Create a date with the timestamp
var timestampDate = new Date(timestamp*1000);

class Product {
 
    constructor(title, description, price, artnumber, category = [], brand = [], id, creator, organizationid) {
      this.title = title;
      this.description = description;
      this.price = price;
      this.artnumber = artnumber;
      this.category = category;
      this.brand = brand; 
      this._id = id ? new mongodb.ObjectId(id, timestamp) : null; 
      this.creator = creator ? new mongodb.ObjectId(creator) : null; 
      this.organizationid = organizationid;
    }

    saveProduct() {
      const db = getDb();
      let dbOp;
      if (this._id) {
        // Update the product
        dbOp = db
          .collection('products')
          .updateOne({ _id: this._id },
            {$set:
              {
            title: this.title,
            description: this.description,
            price: this.price,
            artnumber: this.artnumber,
            category: this.category,
            brand: this.brand,
            _id:this._id,
            //creator: this.creator, (a creatort nem szabad felül írni, mert hibát okoz)
           
              }    
          }
            );
      } else {
        dbOp = db.collection('products').insertOne(
        
            {
            title: this.title,
            description: this.description,
            price: this.price,
            artnumber: this.artnumber,
            category: this.category,
            brand: this.brand,
            _id:this._id,   
            creator: this.creator,
            organizationid: this.organizationid,  
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
  
    saveOrganization() {
      const db = getDb();
      let dbOp;
      if (this._id) {
        // Update the user
        dbOp = db
          .collection('products')
          .updateOne({ _id: this._id },
            {$set:{organizationid:this.neworgid}}
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

    getProduct(filterorgid) {
    const db = getDb();
    return db
    .collection('products')
    .find({ organizationid: filterorgid })//ObjectId(filterorgid) })
    .toArray()
    .then(products => {
      console.log(products);
      return products;
    })
    .catch(err => {
      console.log(err);
    });
}

getOneProduct(keresoneproduct) {
  const db = getDb();
  return db
  .collection('product')
  .find(
    //{age: new RegExp(keresoneproduct)}
    { $or: [ { title: new RegExp(keresoneproduct) }, { age: new RegExp(keresoneproduct)} ] }
  )
  .toArray()
  .then(products => {
    console.log(products);
    return products;
  })
  .catch(err => {
    console.log(err);
  });
}

getOneId(keresid) {
  const db = getDb();
  return db
  .collection('products')
  .findOne({ _id: new ObjectId(keresid) })
  .then(products => {
    console.log(products);
    return products;
  })
  .catch(err => {
    console.log(err);
  });
}

deleteById(products_id) {
  const db = getDb();
  return db
    .collection('products')
    .deleteOne({ _id: new ObjectId(products_id) })
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
      .collection('products')
      .updateOne({ _id: this._id },
        {$set:{
          imageUrl:this.imageUrl,
          deleteimagename:this.deleteimagename
        }}
        );
  //} else {
    //dbOp = db.collection('products').updateOne(
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

module.exports = Product