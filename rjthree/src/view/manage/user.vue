<template>
  <div id="user">
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/manage' }">后台管理首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/manage/user'}">用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表单 -->
    <el-table :data="tableData" border style="width: 100%;" :highlight-current-row="true">
      <el-table-column prop="EU_USER_ID" label="ID"></el-table-column>
      <el-table-column prop="EU_USER_NAME" label="姓名"></el-table-column>
      <el-table-column prop="EU_SEX" label="性别"></el-table-column>
      <el-table-column prop="EU_EMAIL" label="邮箱"></el-table-column>
      <el-table-column prop="EU_MOBILE" label="手机"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editUser(scope.$index,scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改用户信息 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="editDiagoClose"
    >
      <!-- 修改表单 -->
      <el-form :model="useritem" :rules="changeRules" ref="useritem" label-width="100px">
        <el-form-item label="用户名">
          <el-input type="text" v-model="useritem.EU_USER_ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="EU_EMAIL">
          <el-input type="text" v-model="useritem.EU_EMAIL" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="EU_MOBILE">
          <el-input type="text" v-model="useritem.EU_MOBILE" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 确认区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserOK">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 数据分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="pagesize"
        :hide-on-single-page="value"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-count="1"      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: "user",
  created() {
    this.nowdata(this.pagesize, this.currentPage);
  },
  watch: {
    //监听数组长度变化
    "tableData.length": {
      handler: function(newval, oldval) {
        if (newval == 0 && this.currentPage != 1) {
          this.$nextTick(() => {
            this.nowdata(this.pagesize, this.currentPage - 1);
          });
        }
      }
    }
  },
  methods: {
    //分页选择改变后，向后端请求数据，让tableData数据发生变化
    handleSizeChange(val) {
      this.pagesize = val;
      this.nowdata(val, this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.nowdata(this.pagesize, val);
    },
    //修改、该行信息 出现弹框
    editUser(index, row) {
      this.dialogVisible = true;
      this.useritem = row;
    },
    //监听修改用户对话框的关闭事件  表单重置
    editDiagoClose() {
      this.$refs.useritem.resetFields();
    },
    //确认删除
    editUserOK() {
      //表单预验证
      var _this = this;
      this.$refs.useritem.validate(valid => {
        if (valid) {
          let email = _this.useritem.EU_EMAIL;
          let tel = _this.useritem.EU_MOBILE;
          let name = _this.useritem.EU_USER_ID;
          let data = { email: email, tel: tel, name: name };
          this.$axios
            .post("/updata", data)
            .then(res => {
              if (res.data == "have updata") {
                this.nowdata(this.pagesize, this.currentPage);
                this.dialogVisible = false;
              }
            })
            .catch(err => {
              throw err;
            });
        }
      });
    },
    //删除提示
    handleDelete(index, row) {
      const confirmdelete = this.$confirm("确认操作, 是否继续?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let isdelete = this.$axios
            .post("/delete", row)
            .then(res => {
              console.log(res);
              
              //删除之后获取当前页！！！总页数，当前页显示
              if ((res.data == "have delete")) {
                this.$nextTick(() => {
                  this.nowdata(this.pagesize, this.currentPage);
                });
              }
            })
            .catch(err => {
              throw err;
            });
          this.$message({
            type: "success",
            message: "删除成功!",
            duration: 600
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 600
          });
        });
    },
    handleClose(done) {
      done();
    },
    //当前页的数据  当前页 一页几条数据
    nowdata: async function(pagenum, nowPage) {
      await this.$axios.get("/validate").then(res => {
        if (res.data == "200") {
          this.$axios
            .post("/page", {
              currentPage: nowPage,
              pagesize: pagenum
            })
            .then(res => {
              this.total = res.data.allpage;
              this.tableData = res.data.pageData;
            })
            .catch(err => {
              throw err;
            });
        }
      });
    }
  },
  data() {
    return {
      dialogVisible: false, //对话框默认隐藏
      value: false, //当只有一页时，隐藏分页
      //数据分页
      //当前页
      currentPage: 1,
      //一页显示几条数据
      pagesize: 3,
      //总共有几条数据
      total: 1,
      //总数据
      tableData: [],
      useritem: {},
      changeRules: {
        EU_EMAIL: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        EU_MOBILE: [
          { required: true, message: "请输入电话号码", trigger: "blur" }
        ]
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
.el-container,
.el-main {
  height: 660px !important;
}
.has-gutter {
  height: 30px !important;
}
.block {
  margin-top: 20px;
}
</style>