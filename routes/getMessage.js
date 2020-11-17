var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function (req, res, next) {
    //var users = [];
    var receiveId = req.query.receiveId;
    var sendId = req.query.sendId;
    var sql = 'SELECT receive_id,send_id,message,meg_time from message WHERE meg_id=? or meg_id=?';
    var sql1 = 'UPDATE message set receive_read = 1 WHERE meg_id=?';
    var connection = mysql.createConnection({
        host: '47.98.206.11',
        user: 'root',
        password: '980613',
        port: '3306',
        database: 'ptcom',
        multipleStatements: true
    });
    connection.connect();
    connection.query(sql, [receiveId+sendId, sendId+receiveId], function (err, results) {
        if(err) throw err;
        else{
            res.json(results);
        }
    });
    connection.release();
    connection.connect();
    connection.query(sql1,[receiveId+sendId],function(err,result){
        if(err) throw err;
    });
});


module.exports = router;