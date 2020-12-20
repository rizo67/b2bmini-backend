const path = require('path');

require('dotenv').config();
const {Storage} = require('@google-cloud/storage');

const serverless = require('serverless-http');

const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database').mongoConnect;
const multer = require('multer');
const uuidv4 = require('uuid/v4');

const feedRoutes = require('./routes/feed');
const productRoutes = require('./routes/product');
const supplierRoutes = require('./routes/suppliers');


const app = express();

app.use((req, res, next) => {
  mongoConnect(() => {
    next();
  });
})

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
});

/*const storage = new Storage({
  keyFilename: './b2bmini-firebase-adminsdk-e1zug-cc422a453b.json',
});

let bucketName = 'b2bmini.appspot.com';

let filename = 'test.txt';*/




const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/gif'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));

/*app.use((req, res, next)=> {
    res.setHeader('Acces-Control-Allow-Origin', '*');
    res.setHeader('Acces-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Acces-Control-Allow-Headers', 'Content-type, Authorization');
    next();
});  */


app.use(function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, something');
      res.status(204).send('');
  } else {
      next()
  }
});

app.use('/feed', feedRoutes);
app.use('/product', productRoutes);
app.use('/supplier', supplierRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

module.exports.handler = serverless(app);


/*mongoConnect(() => {
    app.listen(3000);
});*/

//app.listen(3000);