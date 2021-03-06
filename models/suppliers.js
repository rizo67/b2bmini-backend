const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;

class Supplier {
 
    constructor(title, id, orgtaxnumber, lastname, firstname, orgcity, orgstreet, orgzipcode, orgother,orgphone, creator) {
      this.title = title; 
      this._id = id ? new mongodb.ObjectId(id) : null; 
      this.orgtaxnumber = orgtaxnumber;
      this.lastname = lastname;
      this.firstname = firstname;
      this.orgcity = orgcity;
      this.orgstreet = orgstreet;
      this.orgzipcode = orgzipcode;
      this.orgother = orgother;
      this.orgphone = orgphone;
      this.creator = creator ? new mongodb.ObjectId(creator) : null;
          
    }
    saveSupplier() {
      const db = getDb();
      let dbOp;
      if (this._id) {
        // Update the Supplier
        dbOp = db
          .collection('suppliers')
          .updateOne({ _id: this._id },
            {$set:
              {
            title: this.title,
            _id: this._id,
            orgtaxnumber: this.orgtaxnumber,
            lastname: this.lastname,
            firstname: this.firstname,
            orgcity: this.orgcity,
            orgstreet: this.orgstreet,
            orgzipcode: this.orgzipcode,
            orgother: this.orgother,
            orgphone: this.orgphone,         
              }    
          }
            );
      } else {
        dbOp = db.collection('suppliers').insertOne(        
            {
            title: this.title,
            _id:this._id,
            orgtaxnumber: this.orgtaxnumber,
            lastname: this.lastname,
            firstname: this.firstname,
            orgcity: this.orgcity,
            orgstreet: this.orgstreet,
            orgzipcode: this.orgzipcode,
            orgother: this.orgother,
            orgphone: this.orgphone,  
            creator: this.creator,            
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
  
  
    getSupplier(organization) {
    const db = getDb();
    return db
    .collection('suppliers')
    .find({ _id: ObjectId(organization) })
    .toArray()
    .then(suppliers => {
      console.log(suppliers);
      return suppliers;
    })
    .catch(err => {
      console.log(err);
    });
}

getOneSupplier(keresonesupplier) {
  const db = getDb();
  return db
  .collection('suppliers')
  .find(
    //{age: new RegExp(keresonecategory)}
    { $or: [ { title: new RegExp(keresonesupplier) } ] }
  )
  .toArray()
  .then(suppliers => {
    console.log(suppliers);
    return suppliers;
  })
  .catch(err => {
    console.log(err);
  });
}

getOneId(keresid) {
  const db = getDb();
  return db
  .collection('suppliers')
  .findOne({ _id: new ObjectId(keresid) })
  .then(suppliers => {
    console.log(suppliers);
    return suppliers;
  })
  .catch(err => {
    console.log(err);
  });
}

deleteById(suppliers_id) {
  const db = getDb();
  return db
    .collection('suppliers')
    .deleteOne({ _id: new ObjectId(suppliers_id) })
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
      .collection('suppliers')
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

module.exports = Supplier