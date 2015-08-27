var email = require('../node_modules/emailjs/email.js');
var ECT = require('ect');
var renderer = ECT({ root : './Content/EmailTemplates', ext : '.htm' });
var fs = require('fs');


var server     = email.server.connect({
    user: "send@busnet.co.il",
    password: "SRZHyqo8",
    host: "mail.busnet.co.il",
   ssl:     false,
   domain: 'busnet.co.il'
});


module.exports.toHtml = function(template,dataName,cb){
    fs.readFile('./Content/EmailTemplates/'+ dataName +'.json','utf8',function(err,data){
         if (data.indexOf('\uFEFF') === 0) {
                    data = data.substring(1, data.length);
                }
        var d = JSON.parse(data);
        var body = renderer.render(template, d);
         cb(body);
     });
}


module.exports.send = function(hreader,template,msgData,cb){
    var body = renderer.render(template, msgData);
   // hreader.text = body;
  
    hreader.attachment = [{data:body, alternative:true}];

    server.send(hreader, cb);
}
