<template>
  <div id="sort">
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/manage' }">后台管理首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/manage/sort'}">分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- <el-row>
        <el-col :span="1">
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row> -->

       <!-- 树形结构分类管理 -->
 <el-button @click="getsort">获取分类数据</el-button>
 <el-tree :data="sortdata"  
 node-key="EPC_ID" 
 :props="defaultProps" empty-text="请点击上方按钮，获取数据" 
 highlight-current 
 icon-class="el-icon-magic-stick"
 @node-click="add">
 </el-tree>

      <!-- 放表格 这里需要用到作用域插槽 结合template模板 -->
    </el-card>


    <!-- 客服功能 
        前端发送消息  后端根据发送消息的内容自动返回相应的语句
        前端要建立socket通信，后端也要 前端发也要接收，后端接收并发送
        双向通信

        界面 ：一发一收 右发左收
        回复在用户的左边并且在用户下面
    -->

    <div class="chat">
      <h1>聊天室</h1> 
     <div class="record" ref="chatreco">
        <div class="userid" v-for="(item,index) in userchat" :key="index">
          <template v-if="item.id==1">
            <div style="text-align:right" class="green">
              {{item.content}}
            </div>
          </template>
          <template v-else>
            <div style="text-align:left" class="grey">
              {{item.content}}
            </div>
          </template>
      </div>
     </div>
      <div class="input">
        <input type="text" placeholder="货号查询" ref="ques"><button @click="start">发送</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "sort",
  data() {
    return {
      userchat:[
        {id:1,content:"咨询"},
        {id:2,content:"我是1号客服，请问您有什么需要"},
        {id:1,content:"物流查询"},
        {id:2,content:"请输入物流单号"},
        {id:1,content:"8888881"},
        {id:1,content:"请选择1"},
        {id:2,content:"亲，我暂时还没有这个服务，如果有什么需要，请选择下面的选项"},
        {id:2,content:"1学习新，2dddd，4drer，5dfagf"},
      ],
      websock: null, //用于初始化为一个webSocket实例
      requireData: "", //用于接收服务器返回的数据
      sortdata:[],
      defaultProps: {
          children: 'children',
          label: 'EPC_NAME'
        }
    };
  },
  methods: {
    start(){
    // const ws = new WebSocket('ws:106.53.79.102:6377/test');
    this.userchat.push({id:1,content:this.$refs.ques.value||this.$refs.ques.getAttribute("placeholder")});
    let actions = {id:1,content:this.$refs.ques.value||this.$refs.ques.getAttribute("placeholder")};
    // ws.addEventListener('open',function (e){
    //   console.log("open");
    // });
    // ws.addEventListener("message",function(e){
    //   console.log(e);
    // });
    // ws.send(actions);

    },
    getsort(){
      this.$axios.get("/shopsort").then(res=>{
        console.log(res.data);
        this.sortdata=res.data;
      }).catch(err=>{throw err;})
    },
    add(a,b,c){
      //传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。
      console.log(a,b,c);
    //  return  append(1);
    }
  },
  updated() {
   this.$refs.chatreco.scrollTop=this.$refs.chatreco.scrollHeight;}
};
</script>
<style lang="less" scope>
//面包屑
.el-breadcrumb {
  margin-bottom: 20px;
}
//聊天室
.chat {
  width: 400px;
  margin: 20px auto;
  background-color: #f3eded;
}
.record {
  width: 400px;
  height: 400px;
  overflow-y: auto;
}
.userid {
  overflow: hidden;
}
.green {
  background-color: yellowgreen;
  margin:5px;
  // display: inline-block;
  float:right;
  padding: 5px;
  border-radius: 8px;
}
.grey {
  background-color: grey;
  margin:5px;
  // display: inline-block;
  padding: 5px;
  border-radius: 8px;
  float: left;
}
.input {
  width: 100%;
  height: 30px;
  // clear: both;
  input {
    width: 89%;
    height: 30px;
    float: left;
    padding: 5px;
    box-sizing: border-box;
  }
button {
  width: 10%;
  height: 30px;
  float: right;
  outline: none;
  background-color: rgb(240, 135, 135);
}
}
</style>