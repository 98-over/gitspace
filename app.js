//git成功
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var https = require('https');
var qs = require('qs');
var _ = require('lodash');
var ws = require('ws');
var fs = require('fs');
var mysql = require('mysql');

var certpath = path.join(__dirname, './certificate/1_online-zsc.com_bundle.crt');//我把秘钥文件放在运行命令的目录下测试
var keypath = path.join(__dirname, './certificate/2_online-zsc.com.key');//console.log(keypath);
var options = {
  key: fs.readFileSync(keypath, 'utf-8'),
  cert: fs.readFileSync(certpath, 'utf-8'),
  passphrase: '980613ZSC'//如果秘钥文件有密码的话，用这个属性设置密码
};

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var updateUserInfoRouter = require('./routes/updateUserInfo');
var getUserRouter = require('./routes/getUser');
var getNewMegRouter = require('./routes/getNewMeg');
var testRouter = require('./routes/test');
var getMessageRouter = require('./routes/getMessage');
var userBindRouter = require('./routes/userBind');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/updateUserInfo', updateUserInfoRouter);
app.use('/getUser', getUserRouter);
app.use('/getNewMeg', getNewMegRouter);
app.use('/test', testRouter);
app.use('/getMessage', getMessageRouter);
app.use('/user_bind', userBindRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
global: var links = [];

var httpsServer = https.createServer(options, app);

app.listen(8080, function () {
  console.log('HTTP Server is running on: http://localhost:8080');
});

httpsServer.listen(3000, function () {
  console.log('HTTPS Server is running on: https://localhost:3000');
});

var wsServer = new ws.Server({ server: httpsServer });
wsServer.on('connection', function (wsConnect, request) {
  console.log("连接成功");
  wsConnect.on('message', function (message) {
    var data = JSON.stringify(message);
    console.log(message);
    if (data.op == 'ping') {
      var r = {
        type: '1'
      }
      wsConnect.send(r);
    }
    else if (data.op == 'bind') {
      links[message.data.openId] = wsConnect;
      var r = {
        type: '2'
      }
      wsConnect.send(r);
    }
    else {
      var r = {
        data: data,
        type: '3'
      }
      var rcvId = data.receive_id;
      wsServer.clients.forEach(function each(client) {
        if (client !== wsConnect && client.readyState === WebSocket.OPEN && client === links[rcvId]) {
          client.send(JSON.stringify(r));
        }
        var pool = mysql.createPool({
          host: '47.98.206.11',
          user: 'root',
          password: '980613',
          database: 'ptcom',
          multipleStatements: true
        });
        var sql = 'insert into message(receive_id,send_id,message,meg_time,is_read) values(?,?,?,?,?)';
        pool.getConnection(function (error, connection) {
          connection.query(sql, [data.receive_id, data.send_id, data.message, data.meg_time, 0], function (error, result, fields) {
            if (error) throw error;
            else console.log("插入成功");
          });
          connection.release();
        });
      });
    }
  });
})

module.exports = app;
