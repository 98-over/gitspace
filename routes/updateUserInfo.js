var express = require('express');
var router = express.Router();
var mysql = require('mysql');

router.get('/', function (req, res, next) {
  var nickName = req.query.nickName;
  var avatarUrl = req.query.avatarUrl;
  var openId = req.query.openId;
  var pool = mysql.createPool({
    host: '47.98.206.11',
    user: 'root',
    password: '980613',
    database: 'ptcom',
    multipleStatements: true 
  });

  var insertSql = 'INSERT INTO user_info VALUES(?,?,?)';
  var querySql = 'select open_id from user_info where open_id=?';
  var updateSql = 'update user_info set nick_name=?,avatarUrl=? where open_id=?';
  pool.getConnection(function(error,connection){
    connection.query(querySql,[openId],function(error,results,fields){
      if(error) throw error;
      if(results[0] == null){
        pool.getConnection(function(error,connection){
          connection.query(insertSql,[openId,nickName,avatarUrl],function(error,results,fields){
            if(error) throw error;
            console.log("插入成功");
          });
          connection.release();
        });
      }
      else if(results[0] != null){
        pool.getConnection(function(error,connection){
          connection.query(updateSql,[nickName,avatarUrl,openId],function(error,results,fields){
            if(error) throw error;
            console.log("更新成功");
            res.end();
          })
        })
      }
    });
    connection.release();
  });
});

module.exports = router;