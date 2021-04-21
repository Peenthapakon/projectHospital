const multer = require("multer");

const csvFilter = (req,res, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
   // res.redirect('trolley/uploadtrolley')
    cb("Please upload only csv file.", false);
  }
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  }
})
const upload = multer({
  storage: storage,
  //fileFilter: csvFilter
})
module.exports = upload ;