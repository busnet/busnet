var request = require("request");



function login(username, password,cb) {
    //var url = 'https://amember.busnet.co.il/api/check-access/by-login-pass?_key=RIUqIS2mMU0xjl4R0EH8&login=' + username + '&pass=' + password;
    var url = 'http://busbook.fanscard.co.il/api/check-access/by-login-pass?_key=RIUqIS2mMU0xjl4R0EH8&login=' + username + '&pass=' + password;
    //
    request(url, function (error, response, body) {
        cb(null,body);
    });
}


function addUser(userDtl,cb) {
    var u = userDtl;
    var url = 'https://amember.busnet.co.il/api/users';
    var url = 'http://busbook.fanscard.co.il/api/users';
    var body = '_key=RIUqIS2mMU0xjl4R0EH8&login=' + u.username + '&pass=' + u.password + '&email=' + u.email + '&name_f=' + u.companyName + '&name_l=' + u.contactPerson;
    request.post({
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: url,
        body: body
    }, function (error, response, body) {
        cb(null, body);
    });
}

module.exports.login = login;
module.exports.addUser = addUser;
