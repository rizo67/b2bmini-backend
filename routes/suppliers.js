const express = require('express');
const { check } = require('express-validator');

const supplierController = require('../controllers/suppliers');
const isAuth = require('../middleware/is-auth');
const authadmin = require('../middleware/authadmin');

const router = express.Router();


router.post('/createsupplier', isAuth, authadmin, supplierController.createSupplier); // POST /supplier/createsupplier
router.get('/allsupplier', isAuth, supplierController.getSuppliers);  // POST /supplier/allsupplier
router.put('/savesupplierimage', isAuth, authadmin, supplierController.supplierImage); // POST /supplier/savesupplierimage
router.put('/updatesupplier', isAuth, authadmin, supplierController.updateSupplier); // POST /supplier/updatesupplier
router.post('/deletesupplier', isAuth, authadmin, supplierController.deleteSupplier); // POST /supplier/deletesupplier
router.post('/onesupplier', isAuth, supplierController.getOneSupplier);  // POST /supplier/onesupplier

module.exports = router;