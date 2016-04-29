#! /usr/bin/env node
var argv = require('yargs')
    .usage('Usage: $0 <command> [Value]')
    .command('-c', 'create Files')
    .command('-d', 'delete Files')
    .command('-a', 'author Name')
    .command('-t', 'page Title')
    .command('-e', 'if you not input, default as author@zuoyebang.com')
    .example('$0 -c fileName', 'The name as fileName files are created success')
    .example('$0 -a', 'liangZhenZhen')
    .alias('v', 'version')
    .describe('v', 'version Number')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2016')
    .argv,
    fs = require('fs'),
    path = process.cwd(),
    // createName = process.argv[2],
    title = argv.t || "pageTitle",
    author = argv.a || "authorName",
    email = argv.e || author+"@zuoyebang.com",
    date = new Date(),
    month = date.getMonth()+1,
    createTime = date.getFullYear()+'-'+month+'-'+date.getDate();

var tpl = "<!--\n\
* Copyright (c) 2015 Baidu, All rights reseved.\n\
* @fileoverview "+title+"\n\
* @author "+author+" | "+email+"\n\
* @version 1.0 | "+createTime+" | "+author+"    // 初始版本\n\
-->",
    jsLess = "/**\n\
* Copyright (c) 2015 Baidu, All rights reseved.\n\
* @fileoverview "+title+"\n\
* @author "+author+" | "+email+"\n\
* @version 1.0 | "+createTime+" | "+author+"\n\
*/",
    json = "{\n\
\"errNo\": 0,\n\
\"errStr\": \"success\",\n\
\"data\": {}\n\
}";
if (argv.d === argv.c) {
  console.log("创建和删除的文件名一样，不可以哦~");
  return;
}
if (argv.c) {
  var createName = argv.c;
  createFile('page', createName);
  createFile('static', createName);
  createFile('test', createName);
}
if (argv.d) {
  var deleteName = argv.d;
  deleteFile('page', deleteName);
  deleteFile('static', deleteName);
  deleteFile('test', deleteName);
}
function createFile(targetDir, createName){
  var type = [],
      typeContent = tpl;
  if (targetDir === 'static') {
        type = ['.js','.less'];
        typeContent = jsLess;
      }else if (targetDir === 'page') {
        type = ['.tpl'];
        typeContent = tpl;
      }else{
        type = ['.json'];
        typeContent = json;
      };
  fs.exists(targetDir, function( exists ){
   if (exists) {
    fs.mkdir(path + '/'+targetDir+'/'+createName, function (err) {
      if(err) throw err;
      console.log(targetDir+'文件夹创建成功');
      for(var i = 0;i < type.length; i++){
        fs.writeFile(path + '/'+targetDir+'/'+createName+'/'+createName+type[i],typeContent,function (err) {
          if (err) throw err ;
          console.log(targetDir+"文件夹下的子文件创建成功");
        }) ;
      }
    });
   }else{
    console.log(targetDir+"文件夹不存在，创建相关文件失败。");
   }
 });
}
function deleteFile(targetDir, deleteName){
  var type = [];
  if (targetDir === 'static') {
        type = ['.js','.less'];
      }else if (targetDir === 'page') {
        type = ['.tpl'];
      }else{
        type = ['.json'];
      };
  fs.exists(targetDir, function( exists ){
   if (exists) {
    fs.readdir(path + '/'+targetDir+'/'+deleteName, function (err) {
      if(err) throw err;
      console.log('进入'+targetDir+'/'+deleteName+'文件夹');
      for(var i = 0;i < type.length; i++){
        fs.unlinkSync(path + '/'+targetDir+'/'+deleteName+'/'+deleteName+type[i]);
        console.log(targetDir+'/'+deleteName+'下的子文件删除成功');
      }
      fs.rmdirSync(path + '/'+targetDir+'/'+deleteName );
      console.log(targetDir+'/'+deleteName+'文件夹删除成功');
    });
   }else{
    console.log(targetDir+"文件夹不存在，删除失败。");
   }
 });
}
