<template>
  <div id="order">
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/manage' }">后台管理首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/manage/order'}">订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索订单 -->
    <el-input placeholder="请输入订单号/订单名称/用户名称" v-model="input2">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    <!-- 表单，后面有改变状态的按钮 -->
   <div class="peo">
      <!-- <child v-show="show" @update:show="(pro)=>{show=pro}">
      </child> -->
      <!-- <child v-show="show" :show.sync="show"></child> -->
    <!-- <button @click="toshow">我是父组件，点我我让子组件消失</button> -->
    <child>
            <template v-slot:head="sl"><!--定义一个插槽，该插槽必须放在template标签内-->
                <li>{{sl.value}}</li>
            </template>
       <template v-slot:content>
         <div>
           halou
         </div>
       </template>
       <template v-slot:bottom>
         <div>
           bye
         </div>
       </template>
    </child>

  
   </div>
  </div>
</template>
<script>
import child from '../../compontents/child';
export default {
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0;
    },
  },
  components:{
    child
  },
  data() {
    return {
      name: "order",
      active: 0,
      input2: "0101",
      show:true,
       pro:{
                name:"张三",
                sex:"男"
            }
    };
  }
};
</script>
<style lang="less" scope>
//面包屑
.el-breadcrumb {
  margin-bottom: 20px;
}
.peo {
  width: 100%;
  height: 60px;
  background-color: red;
}
</style>