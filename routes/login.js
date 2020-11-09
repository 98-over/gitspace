var express = require('express');
var router = express.Router();
var https = require('https');
var iconv = require("iconv-lite");

router.get('/', function (req, response, next) {
    var jscode = req.query.code;
    if (jscode != null) {
        var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wxca4566015f232c7c&secret=9a9b955f48b60d40cbe6d048cda5d76d&js_code=' + jscode + '&grant_type=authorization_code';
        https.get(url, function (res) {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
            var datas = [];
            var size = 0;
            res.on('data', (d) => {
                datas.push(d);
                size += d.length;
            });
            res.on("end", function () {
                var buff = Buffer.concat(datas, size);
                var result = buff.toString();//转码//var result = //不需要转编码,直接tostring  iconv.decode(buff, "utf8");
                console.log(result);
                response.json(JSON.parse(result));
            });
        }).on('error', (e) => {
            console.error(e);
        });
    }
    else {
        console.log('js_code为空')
        response.send('js_code为空')
    }
});

module.exports = router;
