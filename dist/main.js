'use strict';var os=require('os'),fs=require('fs-extra'),ip=require('l3x-ip'),_platform=os.platform(),isMac='darwin'===_platform,OSUsername=isMac?os.userInfo().username:os.hostname(),OSPlatform=isMac?'macOS':_platform;module.exports=function(a){a=a||__dirname+'/devinfo.json';var b=function(d,e){return fs.writeJson(a,d,{spaces:2}).then(function(){return console.log('\x1B[40m'+a+'\x1B[0m ',e)})},c={username:OSUsername,platform:OSPlatform,'IP Record':[ip]};fs.exists(a).then(function(d){var e='New user \x1B[31m'+c.username+'\x1B[0m IP: \x1B[33m'+ip+'\x1B[0m';d?fs.readJSON(a).then(function(f){var g=!1,h=function(){return f.map(function(j,k){return delete f[k]['Current IP']})};f.map(function(j){if(j.username===c.username){g=!0;var k='\x1B[31m'+j.username+'\x1B[0m',l='\x1B[33m'+ip+'\x1B[0m';j['IP Record'].includes(ip)?j['Current IP']!==ip&&(1<f.length||1<j['IP Record'].length)&&(h(),j['Current IP']=ip,b(f,k+' current IP update: '+l)):(j['Current IP']=ip,j['IP Record'].push(ip),b(f,k+' added IP: '+l))}}),g||(h(),f.push(Object.assign(c,{'Current IP':ip})),b(f,e))}):(fs.ensureFileSync(a,function(){}),b([c],e))})};