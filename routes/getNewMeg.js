const { json } = require('express');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function (req, res, next) {
    var receiveId = req.query.receiveId;
    var sendId = req.query.sendId;
    console.log(receiveId + "  " + sendId);
    var sql = 'SELECT COUNT(*) num FROM (SELECT * from message WHERE receive_id=? or receive_id=? GROUP BY send_id HAVING send_id=? and is_read=0 OR send_id=? and is_read=0)s';
    //var sql = 'SELECT COUNT(*) num from message WHERE receive_id=? and send_id=? OR send_id=? AND receive_id=? GROUP BY is_read HAVING is_read=0';
    var sql1 = 'UPDATE message set is_read=1';
    var pool = mysql.createPool({
        host: '47.98.206.11',
        user: 'root',
        password: '980613',
        database: 'ptcom',
        multipleStatements: true
    });

    pool.getConnection(function (error, connection) {
        connection.query(sql, [receiveId, sendId, receiveId, sendId], function (error, result, fields) {
            if (error) throw error;
            if (result[0] != null) {
                res.json(result);
            }
            else {
                res.end();
            }
        });
        connection.release();
    });
});

module.exports = router;
