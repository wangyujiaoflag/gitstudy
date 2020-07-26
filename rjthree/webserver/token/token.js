const jwt = require('jsonwebtoken');
const Token = {
  //加密
  encrypt:function(data,time){ //data加密数据，time过期时间
    return jwt.sign(data, 'token', {expiresIn:time})
  },
  //解密
  decrypt:function(token){
    if (!token) {
      return {
        token:false
      }
    }
    try {
      jwt.verify(token, 'token');
      return {
        token:true
      };
    } catch (e) {
      return {
        token:false,
        data:e
      }
    }
  }
}
module.exports = Token;
