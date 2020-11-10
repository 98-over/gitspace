var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function (req, res, next) {
    //var users = [];
    var receiveId = req.query.receiveId;
    var sendId = req.query.sendId;
    var sql = 'SELECT * from message WHERE receive_id=? or receive_id=?  GROUP BY send_id  HAVING send_id=? OR send_id=?';
    var connection = mysql.createConnection({
        host: '47.98.206.11',
        user: 'root',
        password: '980613',
        port: '3306',
        database: 'ptcom',
        multipleStatements: true
    });
    connection.connect();
    connection.query(sql, [receiveId, sendId, receiveId, sendId], function (err, results) {
        if(err) throw err;
        else{
            res.json(results);
        }
    });
});


module.exports = router;