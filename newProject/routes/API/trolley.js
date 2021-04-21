const Swal = require('sweetalert2')
const result = []
const {
    check,
    validationResult
} = require('express-validator')
const fetch = require('node-fetch');
var express = require('express');
var router = express.Router();
var http = require('http');
const drug = require('../dataset/drug')
const dataset = require('../dataset/data')
const data1 = require('../../data')
const db = require("../../models");
const Tutorial = db.tutorials;
const Drug = db.drugs;
const dbCon = require('../../lib/db')
    //-----------------------------------------------------
    // render index 
router.get('/', (req, res, next) => {

        res.render('content/index', { data: data1 });


    })
    // render เพิ่มรถเข็นจ่ายยา
router.get('/add-trolley', (req, res, next) => {
        res.render('content/add-trolley', {
            drawer_number: '',
            box_number: '',
            ward: '',
            fname: '',
            lname: '',
            position: '',
            tel: '',
            errors: ''

        })
    })
    //บันทึกข้อมูลรถเข็าจ่ายยา
router.post('/add-trolley', [
    check('drawer_number').not().isEmpty().withMessage('กรุณากรอกจำนวนลิ้นชัก'),
    check('box_number').not().isEmpty().withMessage('กรุณากรอกจำนวนชั้น'),
    check('ward').not().isEmpty().withMessage('กรุณาป้อนวอร์ดผู้ป่วย'),
    check('fname').not().isEmpty().withMessage('กรุณาป้อนชื่อผู้รับผิดชอบ'),
    check('lname').not().isEmpty().withMessage('กรุณาป้อนนามสกุล'),
    check('position').not().isEmpty().withMessage('กรุณาป้อนตำแหน่งงาน'),
    check('tel').not().isEmpty().withMessage('กรุณากรอกจำนวนชั้น')

], (req, res, next) => {
    let drawer_number = req.body.drawer_number;
    let box_number = req.body.box_number;
    let ward = req.body.ward;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let position = req.body.position;
    let tel = req.body.tel;
    let errors = false;
    const result = validationResult(req)

    //var errors = result.errors
    if (drawer_number.length === 0) {
        res.render('content/add-trolley', {
            errors: result.mapped()
        })
    } else {
        let form_data = {
            drawer_number: drawer_number,
            box_number: box_number,
            ward: ward

        }
        dbCon.query('INSERT INTO trolley SET ?', form_data, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                req.flash('success', 'เพิ่มข้อมูลรถเข็นสำเร็จ');
                res.redirect('/trolley')
            }
        })
    }
    // insert to database
    // render to context/index
    //console.log(drawer_number,box_number,fname,lname,position,tel)
})

// รายละเอียดรถเข็นจ่ายยา
router.get('/detail-trolley/(:id)', (req, res, next) => {
    let id = req.params.id
    const result = data1.filter((member) => {
        if (member.tId == id) {
            return member
        }
    })
    const data = result
    res.render('content/detail-trolley', { flash: 1, data1: result[0], id: id, data: '' })


})


// check drug ID
router.post('/detail-trolley/(:id)', [
    check('drugId', 'กรุณาป้อนหมายเลขรหัสบนซองยา').not().isEmpty()
], (req, res, next) => {
    let tid = req.params.id
    let id = req.body.drugId
    const results = validationResult(req)
    var errors = results.errors

    const result = data1.filter((member) => {
        if (member.tId == tid) {
            return member
        }
    })
    if (!results.isEmpty()) {
        res.render('content/detail-trolley', {
            errors: errors,
            flash: 1,
            data1: result[0],
            id: id,
            data: ''
        })
    } else {
        const data = result
        let sql = "SELECT * FROM drug as d LEFT JOIN patients as t on d.hnId = t.hnId WHERE d.packId = '" + id + "' "
        let store = []
        store.push(data)
        if (!id) {
            req.flash('error', 'กรุณาป้อนหมายเลขรหัสบนซองยา')
            res.redirect('/trolley/detail-trolley/1')
        } else {
            dbCon.query(sql, (err, rows) => {
                if (err) {
                    // res.send(err)
                    req.flash('error', 'error')
                    res.redirect('/trolley/detail-trolley/1')
                } else {

                    let form_data = {
                            packId: rows[0].packId,
                            name: rows[0].packName,
                            meal: rows[0].packMeal,
                            typeMeal: rows[0].typeMeal,
                            time: rows[0].time,
                            unit: rows[0].packUnit,
                            hn: rows[0].hnId,
                            codebox: rows[0].codebox,

                        }
                        //res.send(form_data.packId) 
                    dbCon.query('INSERT INTO stockdrug SET ?', form_data, (err, results) => {
                        if (err) {
                            //res.send(err);
                            req.flash('error', 'error')
                            res.redirect('/trolley/detail-trolley/1')
                        } else {
                            //res.send(rows[0].packId)
                            req.flash('success', 'กรุณาป้อนหมายเลขรหัสบนซองยา')
                            res.render('content/detail-trolley', { flash: 1, data1: result[0], id: id, data: rows })


                        }
                    })


                }
            })
        }

    }


    // const data = data1[0].tpatient
    // const result = data.filter((member) => {
    //         return member
    // })
    // res.send(result)



})



// เพิ่มข้อมูลผู้ป่วย
router.get('/uploadtrolley', (req, res, next) => {
    res.render('content/uploadtrolley', {
        data: ''
    })
})
router.get('/uploadlistdrug', (req, res, next) => {
    res.render('content/uploadlistdrug', {
        data: ''
    })
})

router.get('/resetcsv', (req, res, next) => {
    let id = req.params.id
    db.sequelize.sync();
    db.sequelize.sync({ force: true }).then(() => {
        console.log("Drop and re-sync db.");
    });
    res.redirect('/trolley/detail-trolley/1')


})

// เพิ่มข้อมูลการทานยา
router.get('/getallperson', (req, res, next) => {

    //sql 
    Tutorial.findAll()
        .then((data) => {
            res.render('content/getallpatient', {
                data: data
            })
        })
        .catch((err) => {
            res.render('content/getallpatient', {
                data: ''
            })
        });


    // dbCon.query("SELECT * FROM tutorials",(err,rows)=>{
    //     if(err){
    //         res.send(err)
    //     }else{
    //         res.render('content/getallpatient',{
    //             data:rows
    //         })
    //     }
    // })
})



//get all drug
router.get('/getalldrug', (req, res, next) => {

    let sql = "UPDATE  DRUG SET  status = 1 "
    dbCon.query(sql)
    Drug.findAll()
        .then((data) => {
            res.render('content/getlistdrug', {
                data: data
            })
        })
        .catch((err) => {
            res.render('content/getlistdrug', {
                data: ''
            })
        });


})



router.get('/delete/(:id)', (req, res, next) => {
    let id = req.params.id;
    dbCon.query('DELETE FROM trolley WHERE id = ' + id, (err, result) => {
        if (err) {
            req.flash('error', err);
            res.redirect('/trolley');
        } else {

            res.redirect('/trolley');
        }
    })
})
router.post('/testAPI', (req, res, next) => {
    let name = req.body.name
    let unit = req.body.unit
    let meal = req.body.meal
    console.log(name, unit, meal)
})
module.exports = router