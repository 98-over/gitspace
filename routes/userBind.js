var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function (req, res, next) {
  //var users = [];
  var sql = 'UPDATE user_info SET client_id = ? where open_id=?';
  //var sql = 'SELECT DISTINCT open_id,nick_name,avatarUrl from user_info,message where user_info.open_id=message.receive_id OR user_info.open_id=message.send_id and open_id=?';
  var connection = mysql.createConnection({
    host:'47.98.206.11',
    user:'root',
    password:'980613',
    port:'3306',
    database:'ptcom',
    multipleStatements: true 
  });
  connection.connect();
  connection.query(sql,[req.query.clientId,req.query.openId],function(err,results){
    if(err) throw err;
    else{
        res.send();
    }
  });
});
    

module.exports = router;