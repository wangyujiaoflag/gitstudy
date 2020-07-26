//路由
const express = require("express");
let router = express.Router();
const mysqls = require("./dbl"); //函数
router.post("/tologin", (req, res) => {
  let name = req.body.nickname;
  mysqls.findUser(name, (user) => {
    res.json(user);
  })
});
//分页
router.post("/page", (req, res) => {
    let data = {
    currentPage: req.body.currentPage,
    pagesize: req.body.pagesize,
  }
  mysqls.findData(data, (page) => {
    res.json(page);
  })
});
//删除用户、留言
router.post("/delete", (req, res) => {
  let data = {
    user: req.body.EU_EMAIL,
  }
  mysqls.delete(data, (d) => {
    res.json(d);
  })
});
router.post("/deletecomment", (req, res) => {
  mysqls.delete(req.body, (d) => {
    res.json(d);
  })
});
router.get("/deleteshop", (req, res) => {
let id=req.query.shopid;  
  mysqls.delete(id, (d) => {
    res.json(d);
  })
});
//修改
router.post("/updata", (req, res) => {
  mysqls.updata(req.body, (isupdate) => {
    res.json(isupdate);
  })
});
router.post("/revise", (req, res) => {
  mysqls.updata(req.body, (isupdate) => {
    res.json(isupdate);
  })
});
//更新商品图片
// router.post("/updataImg", (req, res) => {
//   mysqls.updata(req.body, (isupdate) => {
//     res.json(isupdate);
//   })
// });
//查找新闻
router.post("/searchNews", (req, res) => {
  mysqls.search(req.body, (result) => {
    res.json(result);
  })
});
//查找评论
router.post("/searchComment", (req, res) => {
  mysqls.search(req.body, (news,comments) => {
    res.json(comments);
  })
});
//添加新闻
router.post("/addNews",(req,res)=>{
  mysqls.addData(req.body,(result)=>{
    res.json(result);
  })
});
//回复留言
  router.post("/addReplay",(req,res)=>{
    mysqls.updata(req.body,(result)=>{
      res.json(result);
    })
  });
//上传图片
router.post("/shopAdmin",(req,res)=>{
  //参数是对象json中的类型为text/html; charset=utf-8，send为application，并且可预览
  res.send({ok:"ok"})
  // res.json({ok:"ok"});

  //字符串，数组 所有类型都为text/html;
  // res.json("ok");
  // res.send("ok");
  
  //null  send为application，可以展示 数据解析为空字符串 
  //json text/html，不能展示 数据为null
  // res.json(null);
  // res.send(null);

  // ,undefined send.json为空字符串
  // res.json(undefined);
  // res.send(undefined);
  
});
//上传表单
router.post("/tostore",(req,res)=>{
  //
mysqls.addShop(req.body,(status)=>{
res.send(status);
  })
});
router.get("/list",(req,res)=>{
  mysqls.search(req.query.name,(news,comment,list)=>{
    res.send(list);
  })
});
//获取分类数据
router.get("/shopsort",(req,res)=>{
mysqls.findAll((sort)=>{
  res.send(sort);
})
});
//注册
router.post("/toreg",(req,res)=>{
  let data=req.body.user;
  mysqls.addData(data,(user)=>{res.send(user)})
})
module.exports = router;
