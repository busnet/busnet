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
var SNS = require('sns-mobile');
var SNS_KEY_ID = process.env['AWS_SECRET_KEY'],  
  SNS_ACCESS_KEY = process.env['AWS_ACCESS_KEY_ID'];
var ANDROID_ARN = process.env['SNS_ANDROID_ARN'];
var IOS_ARN = process.env['SNS_IOS_ARN'];

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
                    title: 'הוזרמה נסיעה חדשה בטראקנט',
                    body: 'הוזרמה נסיעה חדשה בטראקנט מ' + ride.area + ' אל ' + ride.destination + ' בתאריך ' + ride.aviliableDate + '. פרטים נוספים במערכת. תודה.'
                }
                break;
            case 2:
                msg = {
                    title: 'הוזרמה בקשה בטראקנט',
                    body: 'הוזרמה בקשה בטראקנט ל' + ride.vehicleType +' מ'+ ride.area + ' ל' + ride.destination + ' בתאריך ' + ride.aviliableDate + '. פרטים נוספים במערכת. תודה.'
                }
                break;
        }
        var SNSMsg = null;
        dal.getDeviceTokens(function(err, devices){
            _.forEach(devices, function(device){
                var SNSApp = null;
                if(device.platform=='android' && device.endpointArn){
                    SNSApp = new SNS({  
                      platform: SNS.SUPPORTED_PLATFORMS.ANDROID,
                      region: 'us-west-2',
                      apiVersion: '2010-03-31',
                      accessKeyId: SNS_ACCESS_KEY,
                      secretAccessKey: SNS_KEY_ID,
                      platformApplicationArn: ANDROID_ARN
                    });
                    SNSMsg = msg.body;
                }else if(device.platform=='ios' && device.endpointArn){
                   SNSApp = new SNS({  
                      platform: SNS.SUPPORTED_PLATFORMS.IOS,
                      region: 'us-west-2',
                      apiVersion: '2010-03-31',
                      accessKeyId: SNS_ACCESS_KEY,
                      secretAccessKey: SNS_KEY_ID,
                      platformApplicationArn: IOS_ARN,
                      sandbox: false
                    });
                    SNSMsg = {
                        aps : {
                            alert : {
                                title : msg.title,
                                body : msg.body,
                            },
                            sound: 'beep.wav'
                        }
                    };
                }
                if(SNSApp && device.endpointArn){
                    SNSApp.sendMessage(device.endpointArn, SNSMsg, function(err, messageId) {  
                        var record = {
                            ride: ride._id,
                            at: moment().format()
                        };
                        if(err) {
                            record.type = "push-error";
                            record.log = 'failed sending a message to device '+ device.endpointArn;
                            record.err = err;
                        } else {
                            record.type = "push-success";
                            record.log = 'Successfully sent a message to device '+ device.endpointArn +'. MessageID was '+ messageId; 
                        }
                        dal.logData(record);
                    });
                }
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
    getBusCompanies: function(name, cb){
        dal.getBusCompanies(name, cb);
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
    SNSRegisterAll: function(){
        dal.getDeviceTokens(function(err, devices){
            _.forEach(devices, function(device){
                ws.SNSRegister(device);
            });
        });
    },
    SNSRegister: function(device){
        var SNSApp = new SNS({  
          platform: device.platform == 'android' ? SNS.SUPPORTED_PLATFORMS.ANDROID : SNS.SUPPORTED_PLATFORMS.IOS,
          region: 'us-west-2',
          apiVersion: '2010-03-31',
          accessKeyId: SNS_ACCESS_KEY,
          secretAccessKey: SNS_KEY_ID,
          platformApplicationArn: device.platform == 'android' ? ANDROID_ARN : IOS_ARN
        });
        SNSApp.on(SNS.EVENTS.ADDED_USER, function(endpointArn, deviceId) { 
            dal.updateDeviceTokenArn(deviceId, endpointArn,  function(err, newDevice){
                var record = {
                    type: "push-register-success",
                    log: 'Successfully added device with deviceId: ' + deviceId + '. EndpointArn for user is: ' + endpointArn,
                    at: moment().format(),
                    device: device
                };
                dal.logData(record);
            });
        });
        SNSApp.addUser(device.deviceToken, null, function(err, endpointArn) {
            if(err) {
                var record = {
                    type: "push-register-failure",
                    log: 'failed to add device with device: ' + device.deviceToken,
                    at: moment().format(),
                    device: device
                };
                dal.logData(record);
            }
        });
    },
    login: function (loginInfo, cb) {
        var setToken = function(data, cb){
            var userDevice = null;
            if(loginInfo.android){
                userDevice = {
                    hash: data.hash,
                    userId: data._id,
                    platform: 'android',
                    deviceToken: loginInfo.android
                };
            }else if(loginInfo.ios){
                userDevice = {
                    hash: data.hash,
                    userId: data._id,
                    platform: 'ios',
                    deviceToken: loginInfo.ios
                };
            }
            if(userDevice){
                dal.findOne('deviceToken', userDevice, function(err, device){
                    if(!device){
                        dal.Save('deviceToken', userDevice, function(err, newDevice){
                            ws.SNSRegister(newDevice);
                            cb(err, data);
                            return;
                        });
                    }
                    cb(null, data);
                });
            }
        };
        
        aMember.login(loginInfo.username, loginInfo.password, function (err, data) {
            var jData = null
            if (data)
                jData = JSON.parse(data);
            if (jData && jData.ok) {
                console.log('jdata:');
                console.log(jData);
                dal.findOne('BusCompany', { _id:jData.user_id }, { _id: 1, username: 1, hash: 1, firstName: 1, lastName: 1, "dtl.companyName":1,favi:1 }, function (err, d) {
                    if (d) {
                        users[loginInfo.username] = d.hash;
                        if(loginInfo.android || loginInfo.ios){
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
                            if(loginInfo.android || loginInfo.ios){
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
module.exports.SNSRegisterAll = ws.SNSRegisterAll;


