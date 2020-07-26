<template>
  <div id="news">
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/manage' }">后台管理首页</el-breadcrumb-item>
      <el-breadcrumb-item>新闻管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/manage/news'}">新闻管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索栏 根据id、标题查找、模糊查找 -->
    <div style="margin-top: 15px;">
      <el-row>
        <!-- 搜索 -->
        <el-col :span="12">
                <el-input placeholder="请输入内容" v-model="searchText" class="input-with-select" clearable @clear="reload" @change="searchNews(select)">
        <!-- select绑定的是option的value值 -->
        <el-select v-model="select" slot="prepend" placeholder="请选择" no-match-text>
          <el-option label="新闻标题" value="1"></el-option>
          <el-option label="id" value="2"></el-option>
        </el-select>
        <!-- 点击时请求数据 -->
        <el-button slot="append" icon="el-icon-search" @click="searchNews(select)"></el-button>
      </el-input>

        </el-col >
        <!-- 新增 -->
        <el-col :span="4">
          <el-button type="danger" @click="addNews">发布新闻</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 卡片 -->
    <div class="content">
      <el-card shadow="hover">
        <!-- 表格结构 -->
        <el-table :data="newsResult" style="width: 100%" :row-class-name="tableRowClassName"  height="480" border>
          <el-table-column label="ID" prop="EN_ID"></el-table-column>
          <el-table-column label="TITLE" prop="EN_TITLE"></el-table-column>
          <el-table-column label="CONTENT" prop="EN_CONTENT"></el-table-column>
          <el-table-column label="TIME" prop="EN_CREATE_TIME"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: "news",
  data() {
    return {
      select: "",
      searchText: "",
      seaflag: "all",
      newsResult: [] //新闻列表
    };
  },
  created() {
    this.searchAll();
  },
  methods: {
    searchAll(){
      this.$axios.post("/searchNews", { seaflag: "all", text: "" }).then(res => {
      this.newsResult = res.data;
    });
    },
    searchNews(select) {
      if (select == "") {
        this.seaflag = "all"; //搜索全部
      } else if (select == "1") {
        this.seaflag = "id"; //搜索id
      } else {
        this.seaflag = "title"; //搜索标题
      }
      //发送请求
      this.$axios
        .post("/searchNews", { seaflag: this.seaflag, text: this.searchText })
        .then(res => {
          console.log(res.data);
          this.newsResult = res.data;
        });
    },
    addNews(){
      //弹出一个弹框，填写信息
      console.log("222");
      
      //发送信息
      this.$axios.post("/addNews",{
        id:null,
        title:"测试",
        content:"这会都是假数据",
        time:`${new Date().toLocaleString().slice(0,9).replace(/\//g,"-")}`
      }).then(res=>{
        if(res.data="ok"){
          //加载所有数据
          this.searchAll();
        }
      })
    },
    reload(){
      this.searchAll();
    },
    tableRowClassName({row, rowIndex}) {
        if (rowIndex%2 === 1) {
          return 'warning-row';
        } else if (rowIndex%2 === 0) {
          return 'success-row';
        }
        return '';
      },
    //放出一个弹框，然后和用户管理一样
    handleEdit(index, row) {
        console.log(index, row);
        //修改
      },
    handleDelete(index, row) {
        console.log(index, row);
        //删除
      }
  }
};
</script>
<style lang="less" scope>
//面包屑
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-container,
.el-main {
  height: 660px !important;
}
.has-gutter {
  height: 30px !important;
}
//搜索
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
// 卡片
.content {
  margin-top: 20px;
}
//表格
.el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>