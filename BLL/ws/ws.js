var dal = require("../../DAL/dal").instance;
var order = require("../Orders/Order");
var aMember = require("../aMember");
var crypto = require('crypto');
var mailer = require("../Mailer.js");
var rss = require("../Rss.js");
var request = require("request");
//var needle = require("needle");
//var request = require("request");
var net = require('net');
var config = require("../../settings/config");
var _ = require('lodash');
//var http = require('http');
//var querystring = require('querystring');
var iconv = require('iconv-lite');
var moment = require('moment');

/*
 wsReq ={ 
            funcName:funName,
            params:params,
            reqNumber:wsReqCount++
        };
*/

var users = [];

var ws = {
    updateBusCompanyDtl: function (company, cb) {
        dal.SaveDoc('BusCompany', company, cb);
    },
    getBusCompanyDtl: function (busCompany, cb) {
        dal.findOne('BusCompany', { _id: parseInt(busCompany.username), hash: busCompany.h }, {  }, cb);
    },
    addRide: function (ride, cb) {
        dal.findOne('BusCompany', { _id: parseInt(ride.username) }, { _id: 1, "dtl.companyName": 1 }, function (err, d) {
            delete ride.h;
            ride.companyID = d._id;
            ride.company = d.dtl.companyName;
            ride.isApproved = false;
            
            console.log(ride.aviliableDate);
            var dateString = ride.aviliableDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            var year = parseInt(dateString[3]);
            var month = parseInt(dateString[2]) - 1;
            var day = parseInt(dateString[1]) + 1;
            var aviliableDateObj = new Date(year, month, day, ride.aviliableHour.split(":")[0],0,0,0);
    
            ride.aviliableDateObj = aviliableDateObj;
            ride.fix1 = 1;
           
            dal.SaveDoc('Rides', ride, cb);
            ws.sendNotification(ride);
        });
    },
    sendNotification: function(ride){
        var msg = {};
        switch(_.parseInt(ride.type)){
            case 1:
                msg = {
                    title: 'הוזרמה נסיעה חדשה בבאסנט',
                    body: 'הוזרמה נסיעה חדשה בבאסנט מ' + ride.area + ' אל ' + ride.destination + ' בתאריך ' + ride.aviliableDate + '. פרטים נוספים במערכת. תודה.'
                }
                break;
            case 2:
                msg = {
                    title: 'הוזרמה בקשה בבאסנט',
                    body: 'הוזרמה בקשה בבאסנט ל' + ride.vehicleType +' מ'+ ride.area + ' ל' + ride.destination + ' בתאריך ' + ride.aviliableDate + '. פרטים נוספים במערכת. תודה.'
                }
                break;
        }

        dal.getDeviceTokens(function(err, devices){
            var client = net.connect({
                host: config.notifications.host, 
                port: config.notifications.port
            },function() { //'connect' listener
              console.log('connected to notification server!');
                _.forEach(devices, function(device){
                    msg.deviceToken = device.deviceToken;
                    msg.source = "busnet";
                    msg.provider = 'google';
                    client.write(JSON.stringify(msg) + '\r\n', function(){
                        console.log('Notification %s to %s sent: ', msg.title, msg.body);
                    });
                });
                client.end();
            });
            client.on('data', function(data) {
                //dal.logData(data);
                var res = data.toString('utf8');
                var record = {
                    type: "push",
                    at: moment().format(),
                    data: res,
                    ride: ride._id
                };
                dal.logData(record);
            });
            client.on('error', function(err) {
              console.log('server connection error:', err);
            });
        });
    },
    getCities: function(filter, cb){
        dal.getCities(filter, function(err, data){
            cb(err, data);
        });
    },
    getSubContactionRides: function (a,cb) {
        dal.getSubContactionRides(function(err,data){
            var r = {};
            r.res = data;
            cb(err, r);
        });
    },
    saveBusiness: function (business, cb) {
        dal.SaveDoc('IndexBusinesses', business, cb);
        
    },
    saveFaviArea: function (favi, cb) {
        dal.saveFaviArea(favi, cb)
    },
    userAskRide: function (cr, cb) {
        var v = {}
        v["requests." + cr.username + ".msgs"] = 1;
        v["requests." + cr.username + ".price"] = 1;
        v["requests." + cr.username + ".isApproved"] = 1;
        v["requests." + cr.username + ".ApprovalDate"] = 1;
        dal.findOne('Rides', { _id: cr.rideID }, v, cb);
    },
    getAgreement: function (ride, cb) {
    
        var v = {}
        v["requests." + ride.username + ".msgs"] = 0;
        v["requests." + ride.username + ".price"] = 1;

        var r = null;
        dal.findOne('Rides', { _id: parseInt(ride.rideID) }, {}, function (err,d) {
            r = d;
            r.price = r.requests[ride.username].price;
            delete r.requests;

            dal.findOne('BusCompany', { _id: r.companyID }, {dtl:1}, function (err2,c) {
                r.owner = c.dtl;
                dal.findOne('BusCompany', { _id: parseInt(ride.username) }, { dtl: 1 }, function (err3,cus) {
                    r.customer = cus.dtl;
                    cb(err,r);
                });
            });
        });
            
    },
    getOwnerAgreement: function (ride, cb) {

        var v = {}
        v["requests." + ride.toUser + ".msgs"] = 0;
        v["requests." + ride.toUser + ".price"] = 1;

        var r = null;
        dal.findOne('Rides', { _id: parseInt(ride.rideID) }, {}, function (err, d) {
            r = d;
            r.price = r.requests[ride.toUser].price;
            delete r.requests;

            dal.findOne('BusCompany', { _id: r.companyID }, { dtl: 1 }, function (err2, c) {
                r.owner = c.dtl;
                dal.findOne('BusCompany', { _id: parseInt( ride.toUser) }, { dtl: 1 }, function (err3, cus) {
                    r.customer = cus.dtl;
                    cb(err, r);
                });
            });
        });

    },
    getCompanyDtl: function(username, cb) {
        dal.findOne('BusCompany', { "_id": parseInt( username )  }, {dtl: 1}, cb);
    },
    getBusCompany: function (id, cb) {
        dal.findOne('BusCompany', { "_id": id }, { }, cb);
    },
    getRide: function (rideID, cb) {
        dal.findOne('Rides', { _id: parseInt(rideID) }, {requests:0}, cb);
    },
    getUnreadNotificationCount: function (username, cb) {
        dal.getUnreadNotificationCount(username, cb);
    },
    getNotifications: function (username, cb) {
        dal.getNotifications(username, cb);
    },
    notifyRead: function (msg, cb) {
        dal.notifyRead(msg, cb);
    },
    getRss: function (p,cb) {
        rss.getRss(cb);
    },
    getDateReinders: function (d,cb) {
        dal.getReminders(d, cb);
    },
    saveReminder: function (r, cb) {
        dal.SaveDoc('Reminders', r, function (err, d) {
            dal.getReminders(r, cb);
        });
    },
    getMonthReminders: function (d, cb) {
        dal.getMonthReminders(d, cb);
    },
    deleteRideFormMyRides: function (r, cb) {      
        if (users[r.username] && users[r.username] == r.h) {
            dal.deleteRide(parseInt(r.rideID), cb);
            dal.removeRideNotification(r.rideID);
        }
        else
            cb('you are not authorized', null);
    },
    addUser:function(company,cb){
        aMember.addUser(company, function (err,data) {
            if (err) {
                cb(err, null);
                return;
            }
            var jData = null
            if (data)
                jData = JSON.parse(data);
            if (jData && jData[0]) {
                company._id = jData[0].user_id;
                company.dtl._id = jData[0].user_id;
                company.hash = crypto.createHash('md5').update(company.password).digest("hex");
                users[company.username] = company.hash;
                dal.SaveDoc('BusCompany', company, cb);
            }
            else
                cb(err, null);
        });
    },
    login: function (loginInfo, cb) {
        var setToken = function(data, cb){
            var userDevice = {
                hash: data.hash,
                userId: data._id,
                type: 'google',
                deviceToken: loginInfo.google.regid
            };
            dal.findOne('deviceToken', userDevice, function(err, device){
                if(!device){
                    dal.Save('deviceToken', userDevice, function(err, newDevice){
                        cb(err, data);
                        return;
                    });
                }
                cb(null, data);
            });
        };
        aMember.login(loginInfo.username, loginInfo.password, function (err, data) {
            var jData = null
            if (data)
                jData = JSON.parse(data);
            if (jData && jData.ok) {
                dal.findOne('BusCompany', { _id:jData.user_id }, { _id: 1, username: 1, hash: 1, firstName: 1, lastName: 1, "dtl.companyName":1,favi:1 }, function (err, d) {
                    if (d) {
                        users[loginInfo.username] = d.hash;
                        if(loginInfo.google){
                            setToken(d, cb);
                        }
                        cb(null, d);
                    }else{
                        var busCompany = loginInfo;
                        busCompany._id = jData.user_id;
                        busCompany.hash = crypto.createHash('md5').update(loginInfo.password).digest("hex");
                        busCompany.email = jData.email;
                        busCompany.firstName = jData.name_f;
                        busCompany.lastName = jData.name_l;
                        users[loginInfo.username] = busCompany.hash;
                        dal.SaveDoc('BusCompany', busCompany, setToken(busCompany, function(err, data){
                            if(loginInfo.google){
                                setToken(data, cb);
                            }else{
                                cb(null, cb);
                            }
                        })); 
                    }
                });
            }else{
                cb(null, null);
            }
        });  
    },
    loginWithThirdParty: function (loginInfo, cb) {
        aMember.login(loginInfo.username, loginInfo.password, function (err, data) {
            var setToken = function(data, cb){
                var userDevice = {
                    hash: data.hash,
                    type: 'google',
                    deviceToken: loginInfo.google.regid
                };
                dal.findOne('deviceToken', userDevice, function(err, data){
                    if(!data){
                        dal.SaveDoc('deviceToken', userDevice, cb);
                    }
                    cb(null, data);
                });
            };
            var jData = null;
            if (data){
                jData = JSON.parse(data);
            }
            if (jData && jData.ok) {
                dal.findOne('BusCompany', { _id: jData.user_id }, { _id: 1, username: 1, hash: 1, firstName: 1, lastName: 1, "dtl.companyName":1,favi:1 }, function (err, d) {
                    if (d) {
                        users[loginInfo.username] = d.hash;
                        setToken(d, cb);
                    }
                    else {
                        var busCompany = loginInfo;
                        busCompany._id = jData.user_id;
                        busCompany.hash = crypto.createHash('md5').update(loginInfo.password).digest("hex");
                        busCompany.email = jData.email;
                        busCompany.firstName = jData.name_f;
                        busCompany.lastName = jData.name_l;
                        users[loginInfo.username] = busCompany.hash;
                        dal.SaveDoc('BusCompany', busCompany, setToken(busCompany, cb));
                    }
                });
            } else { // login falid
                cb(null, null);
            }
        });
        //dal.findOne('Customers',loginInfo,{_id:1,email:1,hash:1,firstName:1},cb);
    },
    getFaviArea: function (ud,cb) {
        dal.findOne('BusCompany', { username: ud.username, hash: ud.hash }, { _id: 1,  favi: 1 }, function (err, d) {
            cb(null, d);
        });
    },
     adminLogin:function(loginInfo,cb){
        dal.findOne('Operators',loginInfo,{_id:1,email:1,hash:1,firstName:1},cb);
        },
     joinMailingList:function(email,cb){
         dal.SaveDoc('MailingList',{email:email,type:'SiteVisitor',jDate: new Date(),isApproved:true},cb);
         },
     UserDtl:function(ud,cb){
         dal.updateUserDtl(ud,cb);
         },
     retrivePass:function(email,cb){
         dal.findOne('Customers',{email:email},{_id:1,email:1,password:1,firstName:1}, function(err,d){
             if(d && d.password){
                  mailer.send(
                {
                    from: "Shlomi <shlomi@busnet.co.il>",
                   to:      d.firstName + " <"+d.email+">",
                   subject: "שחזור סיסמה בסנט"
                }
                ,"ForgotPass",d
                ,function(err,data){
                    cb(err,data);
                });
            }else
                cb(err,{emailNotFound:true});
        });
        },
      sendContactUs:function(msgData,cb){
       var body = ""
            mailer.send(
                {
                    from: "dave <me@reydavid.com>",
                    to: "dave <me@reydavid.com>,Shlomi <shlomi@busnet.co.il>",
                   subject: "Contact Us"
                }
                ,"ContactUs",msgData
                ,function(err,data){
                    cb(err,data);
           });

        cb(null,msgData);
        },
    saveCustomer: function(cust,cb){
        var customer = cust;
         if(customer.password)
         customer.hash = crypto.createHash('md5').update(customer.password).digest("hex");
       
            if(!customer._id){
                dal.isExistCustomerEmail(cust.email,function(err,count){
                    if(count>0)
                        cb(null,{errorID:1,msg:"email already exist"});
                    else
                       dal.SaveDoc('Customers',customer,cb);
                });
            }
            else
                dal.SaveDoc('Customers',customer,cb);
    }
    , PayByCal: function (rideID, to, tid,cb) {
        dal.findOne('Rides', { _id: parseInt(rideID) }, {}, function (err, d) {
            r = d;
            if (r.requests[to])
                r.price = r.requests[to].price;
            delete r.requests;

            dal.findOne('BusCompany', { _id: r.companyID }, { dtl: 1 }, function (err2, c) {
                r.owner = c.dtl;
                var requestData = {
                    AuthenticateGuid: r.owner.calServerKey, // מזהה צד סרבר
                    PaymentId: tid, // מזהה כרטיס אשראי (טוקן)
                    Amount: r.price, // סכום לתשלום
                    Currency: 1, // מטבע
                    CreditType: 1, // סוג אשראי מבוקש (0 – רגיל, 1 – תשלומים רגיל, 2 – תשלומים קרדיט)
                    PaymentsCount: 1 // מס' תשלומים
                };
                var url = 'https://amember.busnet.co.il/api/users';
                request.post({
                    headers: { 'content-type': 'application/json' },
                    url: url,
                    body: JSON.stringify(requestData)
                }, function (error, response, body) {
                    cb(null, body);
                });
            });
        });
       
    }
    };

module.exports.getAgreement = function (params,cb) {
    ws.getAgreement(params, cb);
}

module.exports.getOwnerAgreement = function (params, cb) {
    ws.getOwnerAgreement(params, cb);
}
module.exports.process =  function(wsReq,socket){
    var  wsRes ={ 
            reqNumber:wsReq.reqNumber
        };
    
    var sckt = socket;
    ws[wsReq.funcName](wsReq.params, function(err,data){
            wsRes.err = err;
            wsRes.data = data;
            sckt.emit('ws',wsRes);
    });
};

module.exports.processAjax =  function(wsReq,response){
    var  wsRes ={ 
            reqNumber:wsReq.reqNumber
        };
    
    var res = response;
    ws[wsReq.funcName](wsReq.params, function(err,data){
            wsRes.err = err;
            wsRes.data = data;
            res.end(JSON.stringify( wsRes));
    });
};

module.exports.isLogedIn = function (request){
    var username = request.cookies['u']
               , hash = request.cookies['h'];
   //return true;
    return (username && users[username] == hash);
};

module.exports.login = ws.login;
module.exports.addRide = ws.addRide;
module.exports.getNotifications = ws.getNotifications; 


