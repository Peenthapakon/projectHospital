router.get('/dispensinghn/(:bed)', (req, res, next) => {
    let bed = req.params.bed
    console.log(bed)
    res.render('nurse/dispensing-checkhn', {
        data: '',
        mybed: bed


    })
})

check HN อย่ างเดียว
router.post('/dispensinghn/(:bed)', [
    check('hnId', 'กรุณาป้อนหมายเลขผู้ป่วย').not().isEmpty()
], (req, res, next) => {
    let id = req.body.hnId
    let bed = req.params.bed
    const result = validationResult(req)
    var errors = result.errors
    let sql = "SELECT hnId,bed FROM patients as ts where ts.hnId = '" + id + "' AND ts.bed ='" + bed + "' "
    if (!result.isEmpty()) {
        res.render('nurse/dispensing-checkhn', {
            errors: errors,
            mybed: bed
        })
    } else {


        dbCon.query(sql, (err, rows) => {
            if (err) {
                throw err;
            } else {
                if (rows.length > 0) {
                    req.flash('success', 'ไม่พบหมายเลขผู้ป่วย')
                    res.redirect('/nurse/p/' + bed)

                } else {
                    req.flash('error', 'ไม่พบหมายเลขผู้ป่วย')
                    res.redirect('/nurse/dispensinghn/' + bed)
                }


                //res.redirect("/nurse/p/"+rows[0].bed);  
            }

        })
    }

})



// getdispensing check drug
router.get('/dispensingdrug/(:id)', (req, res, next) => {
        const data = data1[0].tpatient
        const result = data.filter((member) => {
            if (member.phn == req.params.id) {
                return member
            }

        })
        if (result.length > 0) {

            //res.send(result)

            res.render('nurse/dispensing-checkdrug', {
                hn: result[0].phn,
                fname: result[0].pfname,
                lname: result[0].plname,
                bed: result[0].pbed,
                pack: result[0].packDrug
            })
        } else {
            req.flash('error', 'ไม่พบหมายเลขผู้ป่วย')
            res.redirect('/nurse/dispensinghn')
        }



    })
    //chcekdrug
router.post('/dispensingdrug/(:id)', [
    check('drugId', ).not().isEmpty().withMessage('กรุณาป้อนหมายเลขผู้ป่วย')
], (req, res, next) => {
    let id = req.params.id
    let drugId = req.body.drugId
    const result = validationResult(req)
    var errors = result.errors
    var test = []
    var meal = []
    if (!result.isEmpty()) {
        for (var i = 0; i < dataset.length; i++) {
            if (dataset[i].hn === id) {
                if (dataset[i].pack_id.length > 0) {
                    for (let j = 0; j < dataset[i].pack_id.length; j++) {
                        test.push(dataset[i].pack_id[j].data)
                        meal.push(dataset[i].pack_id[j].meal)
                    }
                    console.log(test)
                    res.render('nurse/dispensing-checkdrug', {
                        fname: dataset[i].firstname,
                        lastname: dataset[i].lastname,
                        hn: dataset[i].hn,
                        bed: dataset[i].bed,
                        meal: meal,
                        test: test,
                        errors: errors
                    })
                }

            }
        }

    } else {
        for (var j = 0; j < dataset.length; j++) {
            if (dataset[j].pack_id.length > 0) {
                for (let k = 0; k < dataset[j].pack_id.length; k++) {
                    if (dataset[j].pack_id.length > 0) {
                        if (dataset[j].pack_id[k].id === drugId) {
                            res.redirect('/nurse/dispensinghn')
                        }
                        console.log('ไม่พบข้อมูล')
                    }


                }
            }
        }

    }

})


router.get('/dispensingdrug/(:id)/(:meal)', (req, res, next) => {
    let id = req.params.id
    let meal = req.params.meal
    const data = data1[0].tpatient
    const result = data.filter((member) => {
        if (member.phn == req.params.id) {
            return member
        }
    })
    const packdrug = result[0].packDrug
    const pack = packdrug.filter((member) => {
        if (member.pdMeal == meal) {
            return member
        }
    })
    const lsname = pack[0].lsName
        // res.send(lsname)
    res.render('nurse/drug', {
        rs: lsname,
        hn: id
    })
})
getreturndrug
    <% switch (data[i].packMeal) { case 'BฺB' :%>
<%='ก่อน /เช้า'%>
<% break; case 'AB' :%>
<%='หลัง /เช้า'%>
<% break; case 'BL' :%>
<%='ก่อน /เที่ยง'%>
<%break; case 'AL' :%>
<%='หลัง /เที่ยง'%>
<%break; case 'BD' :%>
<%='ก่อน /เย็น'%>
<%break; case 'AD' :%>
<%='หลัง /เย็น'%>
<%break; case 'BE' :%>
<%='ก่อนนอน'%>
<%break; } %>
