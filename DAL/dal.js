var fs = require("fs");
var Mongolian = require("mongolian")
var config = require("../settings/config.js");
var server = new Mongolian(config.db.server);
var db = server.db(config.db.name)


function getNewID(collection,cb) {
 db.collection("Counters").findAndModify(
          {
            query: { _id: collection },
            update: { $inc: { seq: 1 } },
            new: true
          },
          function(err,d){
              cb(d.seq);
        }
   );
 
};

var dal ={
        updateCityArea: function(cb){
            db.collection("Cities").find().forEach(function(city){
                var areaName = city.area;
                db.collection("Area").findOne({area: {$eq: areaName}}, function(err, area){
                    var areaId = area._id;
                    db.collection('Cities').update({_id: {$eq: city._id}}, {
                        areaId: areaId,
                        area: area.area,
                        city: city.city
                    }, function(err){
                        console.log('finished update of city', city._id, ' with area:', areaId);
                });
            });
        });
        cb(null);
        },
        getCities: function(filter, cb){
            db.collection("Cities").find({city:{$regex: filter}}).toArray(cb);
        },
        getUrlPull: function(cb){
                var pages = db.collection("Pages")
                var p=[];
                pages.find().forEach(function (page) {
                    p[page.url] = page;
                },function(){ cb(p)});
        },
        getOperators:function(cb){
            db.collection("Operators").find().toArray(cb);
        },
        getAreas: function (cb) {
            db.collection("Area").find().toArray(cb);
        },
        getPhoneNumbers: function(exclude_user, cb){
            var data = db.collection("BusCompany");
            var numbers=[];
            data.find({_id:{$ne:exclude_user}}, {dtl:1}).forEach(function (company) {
                if(company.dtl && company.dtl.phoneNumber){
                    var number = company.dtl.phoneNumber;
                    number = number.replace(/-/i, '');
                    number = '972' + number.substr(1);
                    var pattern = /^9725\d{8}$/
                    if(number.match(pattern)){
                        numbers.push(number);
                    }
                }
                },function(){ cb(null, numbers)});
        },
        SaveDoc: function(collection,doc,cb){
            if(!doc._id){
                var cbl = cb;
              getNewID(collection,function(id){
                    doc._id = id;
                    db.collection(collection).save(doc,cbl);
              });
            }
            else
                db.collection(collection).save(doc,cb);
        },
        findOne:function(collection,criteria,fileds,cb){
            db.collection(collection).findOne(criteria,fileds,cb);
        },
        isExistCustomerEmail: function(email,cb){
           db.collection('Customers').find({email:email},{_id:1}).count(cb);
        }
        ,updateUserDtl: function(ud,cb){
            db.collection('Customers').update({email:ud.email},{$set:ud},cb)
        }
        ,addChatToRide: function (rideID, chatWith,from, cb) {
            var c = {};
            c["requests." + chatWith] = {};
            c["requests." + chatWith].msgs = []
            c["requests." + chatWith].from = from;

            db.collection('Rides').update({ _id: parseInt(rideID) }, { $set: c }, cb);
        }
       
        , addMsgToChat: function (rideID, chatWith,msg, cb) {
            var c = {},f = {};
            c["requests." + chatWith + ".msgs"] = msg;
           // f["requests." + chatWith + ".from"] = msg.name;

            db.collection('Rides').update({ _id: parseInt(rideID) }, { $push: c}, cb)
        }
        , addPrice2Ride: function (rideID, chatWith, price, cb) {
            var c = {};
            c["requests." + chatWith + ".price"] = price;
            var u = {};
            u["requests." + chatWith + ".isApproved"] = "";
            db.collection('Rides').update({ _id: parseInt(rideID) }, { $set: c , $unset:u}, cb)
        }

        // customer approve agreement, still need owner approval
        , approveRideStatus: function (rideID, chatWith, isApproved, approvalDate, cb) {
            var c = {};

            if (isApproved) {
                //  db.collection('Rides').update({ _id: parseInt(rideID) }, { $set: { isApproved: isApproved, soldTo: chatWith, approvalDate: approvalDate } }, cb)
                c["requests." + chatWith + ".isApproved"] = true;
                c["requests." + chatWith + ".ApprovalDate"] = new Date();
            }
            else {
               
                c["requests." + chatWith + ".isApproved"] = false;
                c["requests." + chatWith + ".ApprovalDate"] = null;
            }
            db.collection('Rides').update({ _id: parseInt(rideID) }, { $set: c }, cb)

        },
        ownerApprovedAgreement: function (rideID, chatWith, approvalDate, cb) {
            db.collection('Rides').update({ _id: parseInt(rideID) }, { $set: { isApproved: true, soldTo: chatWith, approvalDate: approvalDate } }, function () {
                db.collection('Notifications').remove({ rideID: rideID }, cb);
            });
        }
        , notify: function (msg, cb) {
            db.collection('Notifications').update({ from: msg.from, to: msg.to, rideID:msg.rideID }, msg, { upsert: true })
        }
        , getUnreadNotificationCount: function (username, cb) {
            db.collection('Notifications').count({ to: username, read: false }, cb)
        }
        , getNotifications: function (username, cb) {
            db.collection('Notifications').find({ to: username }).limit(50).skip(0).sort({ date: -1 }).toArray(cb);
        }
        , getAllNotifications: function (cb) {
            db.collection('Notifications').find({}).toArray(cb);
        }
        
        , removeNotification: function (notification, cb) {
            db.collection('Notifications').remove({ _id: notification._id },cb);
        }
        , removeRideNotification: function (rideID, cb) {
            db.collection('Notifications').remove({ _id: rideID }, cb);
        },
        notifyRead: function (msg, cb) {
            db.collection('Notifications').update(msg, {$set:{read:true}},cb);
        }
        , getReminders: function (d, cb) {
            db.collection('Reminders').find({ username: d.username,date:d.date }).limit(50).skip(0).sort({ date: -1, datetime: 1 }).toArray(cb);
        }
        , getMonthReminders:function(d,cb){
            db.collection('Reminders').find({ username: d.username, date: { $regex: d.month + "/" + d.year } }, {date:1}).limit(500).skip(0).sort({ date: -1 }).toArray(cb);
        }
        , getSubContactionRides: function (cb) {
            db.collection('Rides').find({ type: "2", aviliableDateObj: { $gte: new Date() } }, { requests: 0 }).skip(0).sort({ date: -1 }).toArray(cb);
        }
        , saveFaviArea: function (favi, cb) {
            db.collection('BusCompany').update({ username: favi.username, hash: favi.h }, { $set: { favi: favi.favi } }, cb);
        }
        , deleteRide: function (rideID, cb) {        
            db.collection('Rides').remove({ _id: rideID }, cb);
            db.collection('Notifications').remove({ rideID: rideID }, cb);
        }

        , fixAviliableDateObj: function () {
            var lastYear = new Date();
            lastYear.setFullYear(2013);
            db.collection('Rides').update({ aviliableDateObj: { $exists: false } }, { $set: { aviliableDateObj: lastYear } }, false, true)
        }

        , fixDates: function () {
            //fix: {$ne:1} // 
            db.collection('Rides').find({ fix: { $ne: 2 } }).toArray(function (err, rides) {
                for (r in rides) {
                    if (rides[r].aviliableDate && rides[r].aviliableHour) {
                        var dateString = rides[r].aviliableDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
                        var year = parseInt(dateString[3]);
                        var month = parseInt(dateString[2]) - 1;
                        var day = parseInt(dateString[1]) ;
                        var aviliableDateObj = new Date(year, month, day, rides[r].aviliableHour.split(":")[0], 0, 0, 0);
                        aviliableDateObj.setHours(aviliableDateObj.getHours() + (aviliableDateObj.getTimezoneOffset() / -60));
                        rides[r].aviliableDateObj = aviliableDateObj;
                        rides[r].fix = 2;
                        db.collection('Rides').save(rides[r], function (err, rd) { console.log(rd) });
                    }
                }
            });
        }
        , fixUsernames: function () {
            var comp = {};
            db.collection('BusCompany').find({}, { _id: 1, username: 1 }).toArray(function (err, busCompany) {
                for (var bc in busCompany  ) {
                    comp[busCompany[bc].username] = busCompany[bc]._id.toString();
                }
                
                db.collection('Rides').find({ fix1: { $ne: 1 } }).toArray(function (err, rides) {
                    for (r in rides) {
                        rides[r].username = comp[rides[r].username];
                        
                        if (rides[r].soldTo)
                            rides[r].soldTo = comp[rides[r].soldTo];

                        var requests = {};

                        for (req in rides[r].requests) {
                            var cr = rides[r].requests[req]
                            while (!cr.msgs && cr[0])
                                cr = cr[0];
                            if (!cr.msgs)
                                continue;
                            var user = cr.msgs[0].username;
                            for (var m in cr.msgs) {
                                cr.msgs[m].username = comp[cr.msgs[m].username];
                                cr.msgs[m].toUser = comp[cr.msgs[m].toUser];
                            }

                            requests[comp[user]] = cr;

                        }

                        rides[r].requests = requests;
                        rides[r].fix1 = 1;
                        db.collection('Rides').save(rides[r], function (err,rd) { console.log(rd) });
                    }
                });
            });
        }
    }

exports.instance = dal;