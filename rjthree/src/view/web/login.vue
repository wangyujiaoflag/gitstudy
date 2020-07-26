<template>
  <!-- 登录 -->
  <div id="login">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      :hide-required-asterisk="redTip"
    >
      <div class="title">欢迎登录{{company}}商城</div>
      <el-form-item label="用户名" prop="nickname">
        <el-input v-model="loginForm.nickname" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input v-model="loginForm.pwd" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-row>
        <el-button type="danger" @click="login('loginForm')">登录</el-button>
      </el-row>
      <a href="/register" class="toreg">没有账号，赶快去注册一个叭~</a>
    </el-form>
  </div>
</template>
<script>
import axios from '../../axios/axios';
export default {
  name: "login",
  data() {
    //自定义验证规则
    var userName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入用户名"));
      }
      //axios从后台查找 是否存在此用户 如果存在 就跳转 不存在 弹出用户不存在，请先去注册！
      else {
        this.check(value,callback);
      }
    };
    var checkPwd = (rule, value, callback) => {
      if(!value){
        callback("密码不能为空！");
      }
      else {
        if(this.callpwd==value){
        callback();
      }
      else {
        callback(new Error("密码错误，请重新输入！"))
      }
      }
    };
    return {
      temporytoken:"",
      company: "wwb",
      redTip: true,
      callpwd:"",//返回的密码
      loginForm: {
        nickname: "",
        pwd: ""
      },
      loginRules: {
        nickname: [
          {
            required: true,
            validator: userName,
            trigger: "blur"
          }
        ],
        pwd: [{ required: true, validator: checkPwd, trigger: "blur" }]
      }
    };
  },
  methods: {
    login(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$message({
            message: "登录成功，进入首页~",
            type: "success",
            duration: 800
          });
           //后台验证成功 将生成的令牌存入sessionStorage
           this.$savetoken.setTokenToCookie(this.temporytoken);
          this.$router.push(`/manage/${this.loginForm.nickname}`);
        }
      });
    },
    //思路
    //1、验证用户名是否存在，返回是否存在的标志码和用户密码
    //2、点击登录按钮的时候验证密码是否正确
    check(value,callback) {
      this.$axios
        .post("/tologin", this.loginForm)
        .then(res => {
          if (res.data.code == 404) {
            callback(new Error("用户不存在，请先去注册一个账号呦"));
            return;
          } else if (res.data.code == 2) {
            callback();
            this.callpwd=res.data.pwd;
            //token
            this.temporytoken=res.data.token;
          } else if (res.data.code == 1) {
            callback(
              new Error(
                "普通用户的业务正在开发中欧，请多关注，上线之后会通知你哟~"
              )
            );
            this.callpwd=res.data.pwd;
            this.temporytoken=res.data.token;
          }
        })
        .catch(err => {
          throw err;
        });
    }
  }
};
</script>
<style lang="less" scope>
#app {
  overflow: hidden;
  height: 100%;
  background-color: rgb(233, 161, 161);
}
#login {
  width: 100%;
  box-sizing: border-box;
  margin-top: 150px;
  .el-form {
    background-color: rgb(243, 199, 199);
    margin: auto;
    padding: 20px;
    width: 500px;
    height: 300px;
    border: solid 1px #ccc;
    .title {
      width: 100%;
      text-align: center;
    }
  }
  // 按钮居中
  .el-button--danger {
    transform: translateX(300%);
    margin: 15px 0;
  }
  // 注册
  .toreg {
    color: #c56b98;
    float: right;
    font-size: 12px;
  }
}
</style>