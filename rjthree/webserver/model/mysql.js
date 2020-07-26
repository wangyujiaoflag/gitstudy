//数据库配置
const mysql=require('mysql');
let setting=require('./setting');
connection=mysql.createConnection({
    user: setting.user,
    password: setting.password,
    database: setting.database,
    port: setting.port,
    host: setting.host
});
//连接数据库
connection.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("数据库连接成功！");
});
//基本数据库操作
exports.findTable=(sql,callback)=>{
    connection.query(sql,(err,res)=>{
        if(err){throw err;}
        else {
            let data=JSON.parse(JSON.stringify(res));
            callback(data);
        }
    })
}