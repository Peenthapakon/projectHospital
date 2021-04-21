const db = require("../../models");
const Tutorial = db.tutorials;
const Drug = db.drugs;
const fs = require("fs");
const csv = require("fast-csv");

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      req.flash('error','ไม่พบไฟล์ CSV')
      res.redirect('/trolley/uploadtrolley');
      //return res.status(400).send("Please upload a CSV file!");
    }

    let tutorials = [];
 

    fs.createReadStream('./public/uploads/' + req.file.filename)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        tutorials.push(row);
      })
      .on("end", () => { //sql
        
        Tutorial.bulkCreate(tutorials)
        .then(() => {
          res.render('content/uploadtrolley',{data:tutorials})
          //res.redirect('/trolley/uploadtrolley');
          // res.status(200).send({
          //   message: "Uploaded the file successfully: " + req.file.originalname,
          // });
        })
          .catch((error) => {
            req.flash('error','ไม่สามารถอัพโหลดไฟล์ได้')
            res.redirect('/trolley/uploadtrolley');
            // res.status(500).send({
            //   message: "Fail to import data into database!",
            //   error: error.message,
            // });
          });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

const getTutorials = (req, res) => {
  //sql 
  Tutorial.findAll()
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

const uploadDrug =  (req, res) => {
  try {
    if (req.file == undefined) {
      req.flash('error','ไม่พบไฟล์ CSV')
      res.redirect('/trolley/uploaddrug');
      //return res.status(400).send("Please upload a CSV file!");
    }

    let drugs = [];
 

    fs.createReadStream('./public/uploads/' + req.file.filename)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        drugs.push(row);
      })
      .on("end", () => { //sql
        Drug.bulkCreate(drugs)
        .then(() => {
          // res.redirect('/trolley/uploadtrolley');
          res.render('content/uploadlistdrug',{data:drugs})
          // res.status(200).send({
          //   message: "Uploaded the file successfully: " + req.file.originalname,
          // });
        })
          .catch((error) => {
            req.flash('error','ไม่สามารถอัพโหลดไฟล์ได้')
            res.redirect('/trolley/uploadtrolley');
            // res.status(500).send({
            //   message: "Fail to import data into database!",
            //   error: error.message,
            // });
          });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
module.exports = {
  upload,
  getTutorials,
  uploadDrug
};