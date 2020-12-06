const express = require('express');
const { check } = require('express-validator');

const productController = require('../controllers/product');
const productcategoryController = require('../controllers/productcategory');
const productbrandController = require('../controllers/productbrand');
const isAuth = require('../middleware/is-auth');
const authadmin = require('../middleware/authadmin');

const router = express.Router();


router.post('/createproduct', isAuth, authadmin, productController.createProduct); // POST /product/createproduct
router.get('/allproducts', isAuth, productController.getProducts);  // POST /product/allproducts
router.put('/saveproductimage', isAuth, authadmin, productController.productImage); // POST /product/saveproductimage
router.put('/updateproduct', isAuth, authadmin, productController.updateProduct); // POST /product/updateproduct
router.post('/deleteproduct', isAuth, authadmin, productController.deleteProduct); // POST /product/deleteproduct
router.get('/allcategories', isAuth, productcategoryController.getCategories);  // POST /product/allcategories
router.post('/createcategory', isAuth, authadmin, productcategoryController.createCategory); // POST /product/createcategory
router.put('/updatecategory', isAuth, authadmin, productcategoryController.updateCategory); // POST /product/updatecategory
router.post('/deletecategory', isAuth, authadmin, productcategoryController.deleteCategory); // POST /product/deletecategory
router.put('/savecategoryimage', isAuth, authadmin, productcategoryController.categoryImage); // POST /product/savecategoryimage
router.post('/onecategory', isAuth, productcategoryController.getOneCategory);  // POST /product/onecategory
router.get('/allbrands', isAuth, productbrandController.getBrands);  // POST /product/allbrands
router.post('/createbrand', isAuth, authadmin, productbrandController.createBrand); // POST /product/createbrand
router.put('/updatebrand', isAuth, authadmin, productbrandController.updateBrand); // POST /product/updatebrand
router.post('/deletebrand', isAuth, authadmin, productbrandController.deleteBrand); // POST /product/deletebrand
router.put('/savebrandimage', isAuth, authadmin, productbrandController.brandImage); // POST /product/savebrandimage
router.put('/savebrandimageurl', isAuth, authadmin, productbrandController.imgurlBrand); // POST /product/savebrandimageurl
router.post('/onebrand', isAuth, productbrandController.getOneBrand);  // POST /product/onebrand

module.exports = router;