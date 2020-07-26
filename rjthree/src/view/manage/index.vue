<template>
  <div id="index">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <el-row class="user">
         <strong> 商品后台管理系统</strong>
          <!-- <el-button type="primary">{{$route.params.name}}</el-button> -->
          <div>
              <el-button type="primary" class="username">{{hostname}}</el-button>
            <el-button type="primary" @click="goback" class="goback">退出</el-button>
          </div>
        </el-row>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="270px">
          <el-row class="tac">
            <el-col>
              <el-menu
                :default-active="$route.path"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                unique-opened
                :router="true"
              >
                <!-- 一级菜单 -->
                <el-submenu :index="item.id" v-for="(item,index) in result" :key="index">
                  <template slot="title">
                    <i :class="item.icon"></i>
                    <span>{{item.name}}</span>
                  </template>
                  <!-- 二级菜单 -->
                  <el-menu-item
                    :index="it.path+'/'+hostname"
                    v-for="(it,unit) in item.children"
                    :key="unit"
                  >{{it.name}}</el-menu-item>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <!-- 右侧主体内容 -->
        <el-main>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "index",
  props: ["hostname"],
  data() {
    return {
      //   手风琴是字符串，其他为数组形式
      activeName: "1", //默认激活的导航，这里已改成route的路径
      //基本数据
      result: [
        {
          id: "1",
          name: "用户管理",
          icon: "el-icon-user",
          children: [{ name: "用户管理", path: "/manage/user" }]
        },
        {
          id: "2",
          name: "商品管理",
          icon: "el-icon-shopping-cart-2",
          children: [
            { name: "分类管理", path: "/manage/sort" },
            { name: "商品管理", path: "/manage/shop" }
          ]
        },
        {
          id: "3",
          icon: "el-icon-edit",
          name: "订单管理",
          children: [{ name: "订单管理", path: "/manage/order" }]
        },
        {
          id: "4",
          icon: "el-icon-chat-dot-square",
          name: "留言管理",
          children: [{ name: "留言管理", path: "/manage/comment" }]
        },
        {
          id: "5",
          icon: "el-icon-suitcase",
          name: "新闻管理",
          children: [{ name: "新闻管理", path: "/manage/news" }]
        }
      ]
    };
  },
  methods: {
    handleChange(index) {
      console.log(this.hostname);
    },
    goback() {
      //退出时，清空token
      this.$savetoken.clearCookie();
      this.$router.back();
    },
    handleOpen(key, keyPath) {
      console.log(this.hostname);
    },
    handleClose(key, keyPath) {
      console.log(this.hostname, keyPath);
    }
  }
};
</script>
<style lang="less" scope>
#index {
  width: 100%;
  height: 100%;
}

a {
  text-decoration: none;
  color: black;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-header {
  .user {
    height: 100%;
    div {
      float: right;
      height: 100%;
      transform: translateY(20%);
      .username,
      .goback {
        float: left;
      }
    }
  }
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}
body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.el-collapse-item__content {
  padding: 0;
  div {
    height: 40px;
  }
}
.el-container {
  height: 720px !important;
}
</style>