const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const ProductsController = require('../controllers/products');

const storage  = multer.diskStorage({
  destination: function(req, file, cb) {
    // path.join(__dirname, '/uploads/')
    cb(null, './uploads/');
  },
  // filename: function(req, file, cb) { 
  //   cb(null, new Date().toISOString() + file.originalname);
  // }
  filename: function(req, file, cb){ 
    const now = new Date().toISOString(); 
    const date = now.replace(/:/g, '-'); 
    cb(null, date + file.originalname); 
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // accept file
    cb(null, true)
  }
  else {
    // reject a file
    cb(null, false);
  }

}

// intialize and stores files in this directory
// not having leading / turns path into relative path
const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}); 

router.get('/', ProductsController.products_get_products);

//multer gives extra middleware
//change to multi part form data
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

//export such that module can be used in other files
module.exports = router
