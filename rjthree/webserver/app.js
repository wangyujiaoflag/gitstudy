//使用node创建web服务器
const express = require('express');
let router = require("./model/router");
let app = new express();
// //websocket
// const expressWs=require('express-ws');
// expressWs(app);
// app.ws('/test', function(ws, req) {
//   ws.on('message', function(msg) {
//     console.log(msg);
//   });
//   console.log('socket', req);
// });
// app.listen(6377);//服务器监听

//token
const Token=require('./token/token');

//跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //允许的域名
  //设置token的时候，会出现不允许预先加载带token什么的，这时候需要在请求头设置access-token
  res.header('Access-Control-Allow-Headers', 'Access-Token,token,Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'); //服务器支持的头信息
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS'); //允许的方法
  // res.header("X-Powered-By",' 3.2.1');
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(bodyparser.json());
app.use(router);
app.get('/validate', function (req, res) {
  let data = Token.decrypt(req.headers.token);  //将请求头的token取出解密
  if (data.token) {
      res.send('200');
  }else{
    res.send('401');
  }
});
app.listen(6377, 'localhost', (err) => {
  if (err) {
    throw err;
  }
  console.log("6377");
});
