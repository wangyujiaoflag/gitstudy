//封装的函数，与数据库进行操作
let mysql = require('./mysql');
//token
const Token=require('../token/token');
//关于用户
exports.findUser = (data, callback) => {
  let getdata = async () => {
    //登录检查账号和密码
    let user = await new Promise((resolve, reject) => {
      let sql = `select * from easybuy_user where EU_USER_ID='${data}'`;
      mysql.findTable(sql, (res) => {
        resolve(res);
      });
    });
    return {
      user: user,
    }
  }

  getdata().then((res) => {
    
    //用户密码
    let pass;
    //用户不存在
    if (!res.user[0]) {
      pass={
        pwd:"",
        code:"404"
      }
    } else {
      //管理员
      if (res.user[0].EU_STATUS == 2 && res.user[0].EU_USER_ID == 'admin') {
        //用户存在，生成token
        token = Token.encrypt({id: res.user[0].EU_USER_ID},'15d') // 15d，有效期
        pass={
          pwd:`${res.user[0].EU_PASSWORD}`,
          code:"2",
          token
        }
      } else {
        //用户存在，生成token
        token = Token.encrypt({id: res.user[0].EU_USER_ID},'15d') // 15d，有效期
        pass={
          pwd:`${res.user[0].EU_PASSWORD}`,
          //普通用户
          code:"1",
          token
        }
      }
    }
    callback(pass);
  }).catch((err) => {
    if (err) {
      throw err;
    }
  })
}
//数据分页相关
exports.findData=(data,callback)=>{  
  let getdata=async()=>{
        //返回所有数据  到时候能不能想办法把数据库的名字换一下
        let allpage=await new Promise((resolve,reject)=>{
          let sql='select count(*) from easybuy_user';
          mysql.findTable(sql,(res)=>{
            resolve(res);
          })
        });
        //数据分页
        //获取到的所有数据/一页有几条=总页数
        let pageData=await new Promise((resolve,reject)=>{
          let currentPage=data.currentPage;
          let pagesize=data.pagesize;
          let sql=`select * from easybuy_user limit ${(currentPage-1)*pagesize},${pagesize}`;
          mysql.findTable(sql,(res)=>{
            resolve(res);
          })
        });
        return {
          allpage:allpage,
          pageData:pageData,
        }
  }
  getdata().then((res)=>{
    let data={
      allpage:res.allpage[0]['count(*)'],
      pageData:res.pageData,
    }
    callback(data);
    
  }).catch(err=>{
    throw err;
  })
}
//删除
exports.delete= (data,callback)=>{
    let getdata=async ()=>{
      let deleteuser=await new Promise((resolve,reject)=>{
        let user=data.user;
        let sql =`delete from easybuy_user where EU_EMAIL='${user}'`;
        mysql.findTable(sql,(res)=>{          
          resolve(res);
        });
      });
      let deletecomment=await new Promise((resolve,reject)=>{
        let sql =`delete from easybuy_comment where EC_CONTENT ='${data.content}' and EC_NICK_NAME='${data.name}'`;
        mysql.findTable(sql,(res)=>{
          resolve(res);
        })
      });
      let deleteshop=await new Promise((resolve,reject)=>{
        let sql=`delete from upshop where shopid=${data}`;
        mysql.findTable(sql,(res)=>{
          resolve(res);
        })
      })
          return {
            deleteuser:deleteuser,
            deletecomment:deletecomment,
            deleteshop:deleteshop
          }
    }
    getdata().then(res=>{
      res="have delete";
      callback(res);
    }).catch(err=>{throw err;});
  
} 
//更新       
exports.updata= (data,callback)=>{
    let getdata=async ()=>{
        //修改用户信息
        let updateData=await new Promise((resolve,reject)=>{
          let email=data.email;
          let tel=data.tel;
          let name=data.name;
          let sql=`UPDATE easybuy_user SET EU_EMAIL = '${email}', EU_MOBILE='${tel}' WHERE EU_USER_ID = '${name}'`;
          mysql.findTable(sql,res=>{
            resolve(res);
          })
        });
        //更新评论
        let addReplay=await new Promise((resolve,reject)=>{
          let sql=`UPDATE easybuy_comment SET EC_REPLY='${data.comment}',EC_REPLY_TIME='${data.time}' where EC_NICK_NAME='${data.name}'`;
          mysql.findTable(sql,res=>{
            resolve(res);
          })
        });
        //更新商品
        let updataShop=await new Promise((resolve,rejcet)=>{
          let sql=`update upshop set shopname='${data.shopname}',price=${data.price},imgurl='${data.imgurl}',content='${data.cont}',width=${data.width},height=${data.height},num=${data.num} where shopid=${data.shopid}`;
          mysql.findTable(sql,res=>{
            resolve(res);
          });
        });
          return {
            updateData:updateData,
            addReplay:addReplay,
            updataShop:updataShop
          }
    }
    
    getdata().then(res=>{
      res="have updata";
      callback(res);
    }).catch(err=>{throw err;});
  
} 
//查找  
exports.search=(data,callback)=>{
  let getdata=async function(){
    //通过id查找新闻
    let newsbyway=await new Promise((resolve,reject)=>{
      let sql;
      if(data.seaflag=="title"){
        sql=`select * from easybuy_news where EN_ID='${data.text}'`;
      }
      else if(data.seaflag=="id"){
        sql=`select * from easybuy_news where EN_TITLE like '%${data.text}%'`;
      }
      else {
        sql=`select * from easybuy_news where EN_ID like '%${data.text}%' or EN_TITLE like '%${data.text}%' or EN_CONTENT like '%${data.text}%'`;
      }
      mysql.findTable(sql,res=>{
        resolve(res);
      });
    });
    //查找所有评论
    let comment=await new Promise((resolve,reject)=>{
      let sql="select * from easybuy_comment";
        mysql.findTable(sql,(res)=>{
          resolve(res);
        });
      });
    //查找商品
    let shop=await new Promise((resolve,reject)=>{
      let sql =`select * from upshop where content like '%${data}%'`;
      mysql.findTable(sql,(res)=>{
        resolve(res);
      })
    });

    return {
      newsbyway:newsbyway,
      comment:comment,
      shop:shop
    }
  };
  getdata().then(res=>{
    callback(res.newsbyway,res.comment,res.shop);
  });
}
//添加 
exports.addData=(data,callback)=>{
  console.log(data);
  
  let getdata=async function(){
    let addNews=await new Promise((resolve,reject)=>{
      let sql=`insert into easybuy_news (EN_ID,EN_TITLE,EN_CONTENT,EN_CREATE_TIME) values(null,'${data.title}','${data.content}','${data.time}')`;
      mysql.findTable(sql,res=>{
        resolve(res);
      });
    });
    let adduser=await new Promise((resolve,reject)=>{
      let sql=`insert into easybuy_user (EU_USER_ID,EU_USER_NAME,EU_PASSWORD,EU_SEX,EU_BIRTHDAY) values(null,'${data.nickname}','${data.pwd}','${data.radio}','${data.birth}')`;
      mysql.findTable(sql,res=>{
        resolve(res);
      })
    });
    return {
      addNews:addNews,
      adduser:adduser
    }
  };
  getdata().then(res=>{
    res="ok";
    callback(res);
  })
}    
exports.addShop=(data,callback)=>{
  let getdata=async function (){
    let addshop=await new Promise((resolve,reject)=>{
      let sql=`insert into upshop (shopid,shopname,price,imgurl,content,width,height,num,imgname) values(null,'${data.shopname}','${data.price}','${data.imgurl}','${data.cont}','${data.width}','${data.height}','${data.num}','${data.imgname}')`;
      mysql.findTable(sql,res=>{
        resolve(res);
      })
    })
    return {
      addshop:addshop
    }
  };
  getdata().then(res=>{
    res="ok";
    callback(res);
  });
  };
//用于查找所有数据
exports.findAll=(callback)=>{
  let getdata=async function (){
    let sort=await new Promise ((resolve,reject)=>{
      let sql="select * from easybuy_product_category";
      mysql.findTable(sql,res=>{
        resolve(res);
      })
    });
    return {
      sort:sort,
    }
  };
  getdata().then(res=>{
    //曲分一级分类和二级分类
    //EPC_PARENT_ID=0 1级别
    var arr=[];
    for(let item of res.sort){
      if(item.EPC_PARENT_ID==0){
        arr.push(item);
      }}
    for(let i=0;i<arr.length;i++){
      var child=[];
      arr[i].children=child;
      for(let j=0;j<res.sort.length;j++){
        if(arr[i].EPC_ID==res.sort[j].EPC_PARENT_ID){
          arr[i].children[arr[i].children.length]=res.sort[j];
        }
      }
    }
    callback(arr);
  })
}
  
