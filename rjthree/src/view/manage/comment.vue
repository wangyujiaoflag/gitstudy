<template>
  <div id="comment">
    评论
    <!-- 留言展示 -->
    <!-- 谁、内容、时间 -->
    <el-card shadow="hover">
      <!-- 使用v-html容易出现xss攻击，最简单的办法是引入xss插件 -->
      <!-- <div>
        <p v-for="(item,index) in commentResult" :key="index" v-html="item.EC_CONTENT"></p>
      </div>
      -->
      <!-- 表格结构 -->
      <el-table
        :data="commentResult"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        height="480"
        border
      >
        <el-table-column label="NickName" prop="EC_NICK_NAME"></el-table-column>
        <el-table-column label="CONTENT" prop="EC_CONTENT"></el-table-column>
        <el-table-column label="TIME" prop="EC_CREATE_TIME"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleReplay(scope.$index, scope.row)">回复</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 选中某一条进行回复  通用模板 此处 -->
    <!-- 卡片 -->

    <!-- 回复谁 -->
    <!-- 回复内容 -->
    <!-- 回复时间 -->
    <!-- 回复 -->
    <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
      <el-form-item label="用户昵称">
        <el-input v-model="formLabelAlign.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="回复内容">
        <el-input
          v-model="formLabelAlign.replay"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          resize="none"
        ></el-input>
      </el-form-item>
      <el-button @click="replay">回复</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "comment",
  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        replay: ""
      },
      commentResult: [],
    };
  },
  created() {
    this.initcomment();
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      } else if (rowIndex % 2 === 0) {
        return "success-row";
      }
      return "";
    },
    //回复  关于昵称
    handleReplay(index, row) {
      this.formLabelAlign.name = row.EC_NICK_NAME;
    },
    replay() {
      //做判断 评论不能为空  防止xxs攻击
      //提交到后台
      if (this.formLabelAlign.name) {
        if (this.formLabelAlign.replay) {
          this.$axios
            .post("/addReplay", {
              name: this.formLabelAlign.name,
              time: `${new Date()
                .toLocaleString()
                .slice(0, 9)
                .replace(/\//g, "-")}`,
              comment: this.$xss(this.formLabelAlign.replay)
            })
            .then(res => {
              if ((res.data = "have updata")) {
                alert("已回复");
                this.formLabelAlign.replay = "";
                this.formLabelAlign.name = "";
              }
            });
        } else {
          alert("请输入回复内容！");
        }
      } else {
        alert("请选择某一位用户进行回复！");
      }
    },
    //删除
    handleDelete(index, row) {
      this.$axios
        .post("/deletecomment", {
          content: row.EC_CONTENT,
          name: row.EC_NICK_NAME
        })
        .then(res => {
          if (res.data == "have delete") {
            alert("删除成功！")
              this.initcomment();
          }
        });
    },
    //加载所有评论
   initcomment() {
      this.$axios.post("/searchComment", {}).then(res => {
        this.commentResult = res.data;
      });
    }
  }
};
</script>
<style lang="less" scope>
.el-card {
  margin: 20px 0;
}
</style>