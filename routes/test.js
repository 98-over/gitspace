var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function (req, res, next) {
  var users = [];
  var sql = 'SELECT * from user_info';
  var connection = mysql.createConnection({
    host:'47.98.206.11',
    user:'root',
    password:'980613',
    port:'3306',
    database:'ptcom',
    multipleStatements: true 
  });
  connection.connect();
  connection.query(sql, function(err,results){
    res.send(results);
  });
});
    

module.exports = router;
