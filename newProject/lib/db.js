let mysql = require('mysql');
let connection = mysql.createConnection({
    host:process.env.MYSQL_HOST||"localhost",
    user:process.env.MYSQL_USER||"root",
    password:process.env.MYSQL_PASS||"",
    database:process.env.MYSQL_DB||"test"

})
connection.connect((err)=>{
    if(!!err){
        console.log(err);
    }else{
        console.log("Connected...");
    }
})
module.exports = connection;