const {
    render
} = require('ejs');
const {
    check,
    validationResult
} = require('express-validator')
var express = require('express');
var router = express.Router();
const dataset = require('../dataset/data')
const data1 = require('../../data')
const dbCon = require('../../lib/db');
const db = require('../../models');
//------------------------------------------

router.get('/', (req, res, next) => {
        const data = data1
        const result = data.filter((member) => {
            return member
        })
        let sql = "SELECT DISTINCT hnId ,bed,st.status FROM patients as ts RIGHT JOIN stockdrug as st ON st.hn = ts.hnId   where st.status = 0 ORDER BY `ts`.`hnId` ASC"
        let sql2 = "SELECT DISTINCT hn FROM stockdrug as st where st.status = 0  ORDER BY st.hn ASC "
        dbCon.query(sql, (err, rows) => {
            if (err) {
                throw err;
            } else {

                dbCon.query(sql2, (err, rs) => {
                    if (err) {
                        throw err;
                    } else {
                        dbCon.query("SELECT  * ,COUNT(meal) as count FROM stockdrug GROUP BY meal", (err, countmeal) => {

                            if (err) {
                                throw err;
                            } else {
                                dbCon.query("SELECT *   FROM stockdrug as st  LEFT JOIN patients as p on st.hn = p.hnId where st.status = 0 ORDER BY st.hn ASC",(err,meals)=>{
                                    if(err){
                                        throw err;
                                    }else{
                                        let bb = []
                                        let ab= []
                                        let bl= []
                                        let al= []
                                        let bd= []
                                        let ad= []
                                        let be= []
                                        const rst = countmeal.filter((data) => {
                                            return data
                                        })
                                        const rsts = meals.filter((data) => {
                                            return data
                                        })
                                        // for (let i = 0; i < rst.length; i++) {
                                        //     switch (rst[i].meal) {
                                        //         case 'BB':
                                        //             bb = rst[i].count
                                        //             break;
                                        //         case 'AB':
                                        //             ab = rst[i].count
                                        //             break;
                                        //         case 'BL':
                                        //             bl = rst[i].count
                                        //             break;
                                        //         case 'AL':
                                        //             al = rst[i].count
                                        //             break;
                                        //         case 'BD':
                                        //             bd = rst[i].count
                                        //             break;
                                        //         case 'AD':
                                        //             ad = rst[i].count
                                        //             break;
                                        //         case 'BE':
                                        //             be = rst[i].count
                                        //             break;
                                        //     }
                                        // }
                                        for (let i = 0; i < rsts.length; i++) {
                                            switch (rsts[i].meal) {
                                                case 'BB':
                                                    bb.push(rsts[i])
                                                    break;
                                                case 'AB':
                                                    ab.push(rsts[i])
                                                    break;
                                                case 'BL':
                                                    bl.push(rsts[i])
                                                    break;
                                                case 'AL':
                                                    al.push(rsts[i])
                                                    break;
                                                case 'BD':
                                                    bd.push(rsts[i])
                                                    break;
                                                case 'AD':
                                                    ad.push(rsts[i])
                                                    break;
                                                case 'BE':
                                                    be.push(rsts[i])
                                                    break;
                                            }
                                        }
                                        const meal = [
                                            { name: 'ก่อน/เช้า', code: 'BB', data: bb },
                                            { name: 'หลัง/เช้า', code: 'AB', data: ab },
                                            { name: 'ก่อน/เที่ยง', code: 'BL', data: bl },
                                            { name: 'หลัง/เที่ยง', code: 'AL', data: al },
                                            { name: 'ก่อน/เย็น', code: 'BD', data: bd },
                                            { name: 'หลัง/เย็น', code: 'AD', data: ad },
                                            { name: 'ก่อน/นอน', code: 'BE', data: be }
                                        ]
                                        res.render('nurse/index', {
                                            data: dataset.length,
                                            ward: result[0].tward,
                                            row: rows,
                                            count: rs.length,
                                            meal: meal
                                          
                                        
                                        })
                                        //res.send(meal)
                                    }
                                })
                          
                            }
                        })


                    }
                })


            }
        })

    })
    // getdispensing check hn
router.get('/checkhn', (req, res, next) => {
    let bed = req.params.bed
    console.log(bed)
    res.render('nurse/check-hn', {
        data: '',


    })
})
router.post('/checkhn', [
    check('hnId', 'กรุณาป้อนหมายเลขผู้ป่วย').not().isEmpty()
], (req, res, next) => {
    let hn = req.body.hnId
    const result = validationResult(req)
    var errors = result.errors
    let sql = "SELECT bed FROM patients where hnId = '" + hn + "'"
    if (!result.isEmpty()) {
        res.render('nurse/check-hn', {
            errors: errors

        })
    } else {
        dbCon.query(sql, (err, rows) => {
            const bed = rows[0].bed
            if (err) {
                throw err;
            } else {
                res.redirect('/nurse/p/' + bed)

            }
        })
    }


})
router.get('/returndrugs', (req, res, next) => {

        const result = data1.filter((member) => {
            return member

        })
        const patient = result[0].tpatient
            //res.send(patient)
        const pack = patient.filter((packdrung) => {
            return packdrung
        })

        //res.send(pack)
        res.render('nurse/return-drug', {
            data: patient

        })

    })
    //get cancle drug
router.get('/cancledrug', (req, res, next) => {
    const result = data1.filter((member) => {
        return member

    })
    const patient = result[0].tpatient
        //res.send(patient)
    const pack = patient.filter((packdrung) => {
        return packdrung
    })

    //res.send(pack)
    res.render('nurse/cancle-drug', {
        data: patient

    })

})
router.post('/cancledrug', (req, res, next) => {
    res.render('nurse/cancle-drug')
})

// getallpatients
router.get('/getAllPatient/(:meal)', (req, res, next) => {
    let meal = req.params.meal
    let sql = "SELECT  * FROM stockdrug as st where st.status = 0 AND meal = '" + meal + "' ORDER BY st.hn ASC  "
    dbCon.query(sql, (err, result) => {
            if (err) {
                throw err
            } else {
                res.send(result)
            }

        })
        // res.render('nurse/getpatient',{

    // })
})


router.get('/p/(:bed)', (req, res, next) => {
    let bed = req.params.bed
    let sql = "SELECT DISTINCT time from stockdrug as st LEFT JOIN patients as t on st.hn = t.hnId where t.bed = '" + bed + "' and st.status = 0"
    let sql2 = "SELECT DISTINCT * from stockdrug as st LEFT JOIN patients as t on st.hn = t.hnId where t.bed = '" + bed + "' and st.status = 0"
    dbCon.query(sql, (err, result) => {
        if (err) {
            throw err;
        } else {
            if (!result.length > 0) {
                res.send('ไม่มีข้อมูล')
            } else {

                dbCon.query(sql2, (err, results) => {
                    if (err) {
                        throw err;
                    } else {

                        const mealBreakfast = []
                        const mealLunch = []
                        const dinner = []
                        const eveing = []
                        const rs = results.filter((data) => {
                            return data
                        })
                        for (let i = 0; i < rs.length; i++) {
                            switch (rs[i].time) {
                                case 'B':
                                    mealBreakfast.push(rs[i])
                                    break;
                                case 'L':
                                    mealLunch.push(rs[i])
                                    break;
                                case 'D':
                                    dinner.push(rs[i])
                                    break;
                                case 'E':
                                    eveing.push(rs[i])
                                    break;
                            }
                        }
                        res.render('nurse/show-patient', {
                            data: result,
                            bf: mealBreakfast,
                            lunch: mealLunch,
                            dinner: dinner,
                            eveing: eveing,
                            datamap: results
                        })

                    }
                })


            }

        }
    })
})

router.get('/p/(:bed)/(:type)', (req, res, next) => {
        let bed = req.params.bed
        let type = req.params.type
        let sql = "SELECT DISTINCT* from stockdrug as st LEFT JOIN patients as t on st.hn = t.hnId where t.bed = '" + bed + "' and st.time = '" + type + "'"
        dbCon.query(sql, (err, result) => {
            if (err) {
                throw err;
            } else {
                res.send(result)
            }
        })
    })
    // จ่ายยา
router.post('/dispensing/(:packid)', (req, res, next) => {
    let packid = req.params.packid
    let sql = "UPDATE stockdrug SET status = 1 WHERE stockdrug.packId = '" + packid + "'"
    dbCon.query(sql, (err, rs) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/nurse')
        }
    })
    console.log(packid)
})

module.exports = router