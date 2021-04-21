var express = require('express');
var router = express.Router();
const csvController = require("../controllers/tutorial/csv.controller");

const upload = require("../middleware/upload");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload',upload.single("file"),csvController.upload)
router.get('/tutorials',csvController.getTutorials) 

router.post('/uploaddrug',upload.single("file"),csvController.uploadDrug)
module.exports = router;
