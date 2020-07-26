<template>
<!-- 注册 -->
  <div id="register">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <div class="title">欢迎注册{{company}}商城</div>
      <el-form-item label="用户名" prop="nickname">
        <el-input v-model="form.nickname" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input v-model="form.pwd" type="password" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="repwd">
        <el-input v-model="form.repwd" type="password" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="radio">
        <el-radio v-model="form.radio" label="man">男</el-radio>
        <el-radio v-model="form.radio" label="woman">女</el-radio>
      </el-form-item>
      <el-form-item label="出生年月" prop="birth">
        <el-date-picker type="dates" v-model="form.birth" placeholder="选择一个或多个日期" size="mini"></el-date-picker>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" type="email" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.tel" type="tel" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="送货地址">
        <el-input v-model="form.address" type="text" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="form.code" type="text" class="code" size="mini"></el-input>
        <div class="picture">验证码</div>
      </el-form-item>
      <el-row>
        <el-button type="danger" @click="register('form')">提交注册</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "register",
  data() {
    //   自定义验证规则
    var checkPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 商城名字
      company: "wwb",
      // 注册表
      form: {
        nickname: "admin",
        name: "",
        pwd: "",
        repwd: "",
        email: "",
        tel: "",
        address: "西安",
        code: "",
        //出生年月
        birth: "",
        //   性别
        radio: "man"
      },
      //表单验证
      rules: {
        nickname: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 1, message: "密码长度必须大于5", trigger: "blur" }
        ],
        repwd: [{ required: true, validator: checkPwd, trigger: "blur" }],
        email: [
          { required: true, message: "请输入有效的邮箱信息", trigger: "blur" }
        ],
        birth: [
          { required: true, trigger: "blur", message: "请选择出生年月日" }
        ],
        code: [{ required: true, trigger: "blur", message: "请输入验证码" }]
      }
    };
  },
  methods: {
    register(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
         this.$axios.post("/toreg",{
           user:this.form
         }).then(res=>{
           if(res.data){
              this.$message({
            message: "注册成功，接下来进入登录界面~",
            type: "success",
            duration:0
          });
          this.$router.push("/login");
           }
         })
        } else {
          this.$message({
            message: "注册失败，请输入正确的信息",
            type: "error",
            duration:200
          });
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scope>
#app {
  padding: 20px 0;
  box-sizing: border-box;
  }
.el-form {
  width: 600px;
  height: 780px;
  margin: auto;
  padding-left: 20px;
  border: solid 1px #ccc;
  background-color: rgb(243, 199, 199);
  // 商城标题
  .title {
    width: 104%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    margin-bottom: 20px;
    margin-left: -20px;
  }
  // 验证码
  .el-form-item {
    .el-input {
      width: 70%;
    }
    .code {
      width: 40%;
      float: left;
    }
  }
}
// 右边的验证码图片
.picture {
  width: 80px;
  height: 28px;
  line-height: 28px;
  background-color: yellow;
  float: left;
  margin-left: 20px;
  transform: translateY(23%);
}
// 按钮居中
.el-button--danger {
  transform: translateX(200%);
  margin: 15px 0;
}
</style>