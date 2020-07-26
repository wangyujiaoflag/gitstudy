<template>
  <div id="shop">
<!-- 增删改功能
如果是添加 点击添加按钮之后，所有表单项内容清空，然后进行编辑，点击提交后存入数据库
如果是修改 点击修改按钮之后，先判断商品名称是否为空，如果为空，弹出提示框，如果不为空，就进行。。。
如果是删除   前面的都一样
删除和修改与添加是一样的
-->


    <!-- 面包屑导航 -->
    <!-- 熟悉是图标的分隔符 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/manage' }">后台管理首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/manage/shop'}">商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片  商品列表
    列表信息包括-->
    <el-card class="box-card">
      <el-row>
        <!-- 搜索、按钮 -->
        <el-col :span="6">
          <!-- append 输入框后置内容   button要放在input里面-->
          <el-input placeholder="请输入商品内容" autocomplete v-model="writein" @keyup.enter.native="search">
            <el-button slot="append" icon="el-icon-search"  @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
         <div class="select">
            <el-button type="primary"  @click="submit">添加</el-button>
          <el-button @click="revise">修改</el-button>
          <el-button type="danger" @click="del()">删除</el-button>
         </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 信息列表 -->
    <el-steps :active="active-0" finish-status="success" align-center>
      <el-step :title="item" v-for="(item,index) in shoplist" :key="index"></el-step>
    </el-steps>
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
      <el-tabs
        tab-position="left"
        style=" margin-top:20px"
        v-model="active"
        :before-leave="beforeleave"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="shopname">
            <el-input v-model="addForm.shopname"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="price">
            <el-input v-model="addForm.price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="num">
            <el-input v-model="addForm.num" type="number"></el-input>
          </el-form-item>
          <!-- <el-form-item label="商品分类" prop="EPC_ID"> -->
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item label="商品长度" prop="width">
            <el-input v-model="addForm.width" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品宽度" prop="height">
            <el-input v-model="addForm.height" type="number"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="2">
          <el-form-item label="图片上传">
            <el-upload
              class="upload-demo"
              :on-preview="handlePreview"
              :before-upload="beforeupload"
              :on-success="loadFileList"
              list-type="picture"
              :action="'http://localhost:6377/shopAdmin'"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="3">
          <el-form-item label="商品检验"></el-form-item>
          <quill-editor v-model="addForm.content"></quill-editor>
        </el-tab-pane>
      </el-tabs>
    </el-form>

   
  </div>
</template>
<script>
export default {
  name: "shop",
  data() {
    return {
      writein:"",
      btn:"btn",
      checkarr: [],
      editor: null,
      shoplist: ["基本信息", "商品参数", "商品图片", "商品内容"],
      active: 0,
      addForm: {
        shopname: "",
        price: "",
        imgurl: "",
        imgname: "",
        content: "",
        width: "",
        height: "200",
        num: "500",
      },
        shopid:"",
      addFormRules: {
        shopname: {
          required: true,
          message: "请输入商品名称",
          trigger: "blur"
        },
        price: {
          required: true,
          message: "请输入商品价格",
          trigger: "blur"
        },
        num: {
          required: true,
          message: "请输入商品库存",
          trigger: "blur"
        },
        width: {
          required: true,
          message: "请输入商品宽度",
          trigger: "blur"
        },
        height: {
          required: true,
          message: "请输入商品高度",
          trigger: "blur"
        },
        content: {
          required: true,
          message: "请输入商品详细介绍",
          trigger: "blur"
        }
      }
    };
  },
  methods: {
    //搜索
    search(){
      this.$axios.get(`/list?name=${this.writein}`).then(res=>{
        if(!res.data[0]){
          this.$alert('该商品不存在，请重新查找！', '商品不存在', {
          confirmButtonText: '确定',
          callback: action => {
            this.writein="";
            if(action){
              this.$refs.addFormRef.resetFields();
            }
          }
        });
        }
        //商品存在
        else {
          this.addForm=res.data[0];
          this.shopid=res.data[0].shopid;
        }
      })
      
    },
    //上传文件
    beforeupload(file) {
      this.$axios
        .post("/shopAdmin", {
          name: file.name
        })
        .then(res => {
          if (res.data.ok == "ok") {
            this.addForm.imgname = file.name;
            alert("文件上传成功！");
          }
        });
    },
    //离开tab时进行的校验
    beforeleave(now, old) {
      //如果当前的数据检验不通过，就不能继续往下翻
      this.checkarr = [
        ["shopname", "price", "num"],
        ["width", "height"],
        ["content"]
      ];
      if (this.$refs.addFormRef) {
        var result = [];
        //部分校验
        this.$refs.addFormRef.validateField(this.checkarr[old], err => {
          if (err != "") {
            //错误结果
            result.push(err);
          }
        });

        //如果没有校验成功，则不能进入下一项
        if (result.length != 0) {
          return false;
        }
        if (Math.abs(now - old) != 1) {
          return false;
        }
      }
    },

    //点击文件列表的时候
    handlePreview(file) {
      console.log(file.url);
    },
    //上传成功之后获取图片的地址
    loadFileList(file, fileList) {
      this.addForm.imgurl = fileList.url.replace("blob:", "");
    },
    //提交表单
    submit() {
     if(this.addForm.content){
       this.active=this.active+1+'';
        this.$axios
        .post("/tostore", {
          shopname: this.addForm.shopname,
          price: this.addForm.price,
          imgurl: this.addForm.imgurl,
          cont: this.$xss(this.addForm.content),
          width: this.addForm.width,
          height: this.addForm.height,
          num: this.addForm.num,
          imgname: this.addForm.imgname,
        })
        .then(res => {
          if (res.data == "ok") {
            alert("添加商品成功！");
            this.$refs.addFormRef.resetFields();
            this.addForm.content = "";
          }
        })
        .catch(err => {
          throw err;
        });
     }
    },
    //修改
    revise(){
      this.$axios
        .post("/revise", {
          shopname: this.addForm.shopname,
          price: this.addForm.price,
          imgurl: this.addForm.imgurl,
          cont: this.$xss(this.addForm.content),
          width: this.addForm.width,
          height: this.addForm.height,
          num: this.addForm.num,
          imgname: this.addForm.imgname,
          shopid:this.shopid
        })
        .then(res => {
          if (res.data == "have updata") {
            alert("商品修改成功！");
            this.$refs.addFormRef.resetFields();
            this.addForm.content = "";
          }
        })
        .catch(err => {
          throw err;
        });
      
    },
    //删除
    del(){
      this.$axios.get(`/deleteshop?shopid=${this.shopid}`,).then(res=>{
       if(res.data=="have delete"){
         this.$alert("删除成功！","delete",{
          confirmButtonText: '确定',
          callback: action => {
            this.writein="";
            if(action){
              this.$refs.addFormRef.resetFields();
            }
          }
         })
       }
      }).catch(err=>{if(err){
        throw err;
      }});
    }
   
  },

  beforeDestroy() {
    this.editor = null;
    delete this.editor;
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
.box-card,
.up {
  margin-top: 20px;
}
//步骤条
.el-steps {
  margin-top: 15px;
}
.el-step__title {
  text-align: center;
}
//选择按钮那个
.select {
  width: 100%;
  height: 100%;
}
</style>