
$(document).ready(function () {
    //var socket = io.connect("127.0.0.1:3004");
    var socket = io.connect();
    
  
    socket.emit('hello', {  username: $.cookie('username', { path: '/' })});

    socket.on('forumMsg', function (data) {
        console.log('data from socket on forumMsg: ', data);
        var e = $('.ForumMsgsPane');
        if (data.username == $.cookie('username', { path: '/' }))
            e.append('<div style="padding: 5px 0px; border-bottom: 1px solid rgb(230, 231, 235);"><span style="color:red">' + data.time + ' | אתה:<br/>' + data.message + '</span><br/></div>');
        else
            e.append('<div style="padding: 5px 0px; border-bottom: 1px solid rgb(230, 231, 235);">' + data.time + ' | '  + data.name +  '<br/> ' + data.message +  '<br/></div>' );
        scrollChat(e);
    });

    //newRideNotification
    socket.on('newRideNotification', function (data) {
        var faviArea = $.cookie('faviArea', { path: '/' });
        if (faviArea !== null)
            faviArea = "," + faviArea + ",";

        if (faviArea.indexOf(',' + data.srcAreaID + ',') > -1 || faviArea.indexOf(',' + data.dstAreaID + ',') > -1) {
            if(window.location.pathname == "/")
                $('.ReffreshIcon').show();
        }

    });

    socket.on('chat2allHistory', function (msgs) {

        var e = $('.ForumMsgsPane');
        var htm = '';
        for (var i = 0; i < msgs.length; i++) {
            var data = msgs[i];
            if (data.username == $.cookie('username', { path: '/' }))
                htm += '<div style="padding: 5px 0px; border-bottom: 1px solid rgb(230, 231, 235)"><span style="color:red">' + data.time + ' | אתה:<br/>' + data.message + '</span><br/></div>';
            else
                htm += '<div style="padding: 5px 0px; border-bottom: 1px solid rgb(230, 231, 235);">' + data.time + ' | '  + data.name +  '<br/> ' + data.message +  '<br/></div>';
        }
        e.html(htm);
        scrollChat(e);
    });

    socket.on('message2User', function (data) {
        if (data.message) {
            if (data.rideID) {
                var e = $('#ChatWin_' + data.rideID);
                if (data.username == $.cookie('username', { path: '/' })) 
                    e.append('<span style="color:red">' + data.time + ' | אתה:<br/>' + data.message + '</span><br/>');
                else
                    e.append(data.time + ' | ' + data.name + '<br/>' + data.message + '<br/>');
                scrollChat(e);
            }
        }
    });

    var interval1;
    socket.on('notify', function (msg) {
        $('.QuickNotifyMsg').prepend(notificationFotmat[msg.type](msg));
        $('#QuickNotify').show(400);
        unread = msg.count;
        $('.msgCount').html(unread).show();
        if (interval1)
            clearInterval(interval1);
        interval1 = setInterval(function () {
            $('#QuickNotify').hide();
            $('.QuickNotifyMsg').html('');
            clearInterval(interval1);
        }, 3500);
    });

    socket.on('message2Owner', function (data) {
        if (data.message) {
            if (data.rideID) {
                var e;
                if (data.username == $.cookie('username', { path: '/' })) {
                     e = $('#ChatWin_' + data.rideID + '_' + data.toUser).append('<span style="color:red">' + data.time + ' | אתה:<br/>' + data.message + '</span><br/>');
                     scrollChat(e);
                }
                else {
                    e = $('#ChatWin_' + data.rideID + '_' + data.username).append(data.time + ' | ' + data.name + '<br/>' + data.message + '<br/>');
                    scrollChat(e);
                }

            }
        }
    });
    //gotRideStatus
    socket.on('gotRideStatus', function (data) {
        if (data.isApproved) {
            $('#ride_' + data.rideID + '_' + data.username + '_pleaseWait').html('המחיר אושר, אנא אשר את ההסכם');
            $('#OpenAgrrementBtn_' + data.rideID + '_' + data.username).show(400);
        }
        else {
            $('#ride_' + data.rideID + '_' + data.username + '_pleaseWait').hide();
            $('#ride_' + data.rideID + '_' + data.username + '_isApproved').show();
            $('#approveRideBtn_' + data.rideID + '_' + data.username).show(400);
        }
    });



    socket.on('gotPrice', function (data) {
        $('#price_' + data.rideID).html(data.price + ' ש"ח');
        $('#approveDiv_' + data.rideID).show();
        $('#approveBtn_' + data.rideID).show();
        $('#disapproveBtn_' + data.rideID).show();
    });

    socket.on('rideClose', function (data) {
        if (data.to != $.cookie('username', { path: '/' })) {
            $('#ChatRow_' + data.rideID + '.hpChatRow').html('<td colspan="10"><h2>הנסיעה נסגרה איתכם הסליחה</h2></td>');
        }
        else
            $('#ChatRow_' + data.rideID + '.hpChatRow').html('<td colspan="10"><h2>הנסיעה אושרה</h2></td>');


        getAllNotifications();
    });

    window.send2All = function () {
        if ($.cookie('u', { path: '/' }) == 'demo') {
            alert('לא ניתן לבצע פעולות בגרסת דמו');
            return;
        }
        var d = new Date();
        var time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        socket.emit('send2all', { message: $('#forumTxt').val(), username: $.cookie('username', { path: '/' }), name: $.cookie('name', { path: '/' }), time: time});
        $('#forumTxt').val('');
    }


    window.getchat2allHistory = function () {
        socket.emit('getChat2allHistory', {});
    }



    window.sendChat = function (rideID, to) {
        if ($.cookie('username', { path: '/' }) == 'demo') {
            alert('לא ניתן לבצע פעולות בגרסת דמו');
            return;
        }
        var d = new Date();
        var time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        socket.emit('send', { message: $('#chatMsg_' + rideID).val(), rideID: rideID, username: $.cookie('username', { path: '/' }), name: $.cookie('name', { path: '/' }), time: time, toUser: to });
        $('#chatMsg_' + rideID).val("כתוב הודעה...");
    }

    window.sendChatFromOwner = function (rideID, to) {
        if ($.cookie('username', { path: '/' }) == 'demo') {
            alert('לא ניתן לבצע פעולות בגרסת דמו');
            return;
        }
        var d = new Date();
        var time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        socket.emit('reply', { message: $('#chatMsg_' + rideID + '_' + to).val(), rideID: rideID, username: $.cookie('username', { path: '/' }), name: $.cookie('name', { path: '/' }), time: time, toUser: to });
        $('#chatMsg_' + rideID + '_' + to).val('');
    }

    window.openAgreement = function (rideID, to) {
        ng.ws('getOwnerAgreement', { rideID: rideID, username: $.cookie('username', { path: '/' }), toUser: to }, function (d) {
           
            var html = ng.renderer.render('Agreement/Agreement', d);
            $('#AgreementLB').html(html);
            var date = new Date();
            var today = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
            $('#orderDate').html(today);
            openLightBox('#AgreementLB');
            $('#approveAgreementBtn').click(function () {
                socket.emit('ownerApprovedAgreement', { rideID: rideID, username: $.cookie('username', { path: '/' }), toUser: to, isApproved: true, name: $.cookie('name', { path: '/' }) });
                closeLightBox();
                ng.ReloadContainer("#InnerPane");
            });
        });
    };
    window.updateRidePrice = function (rideID, to, el) {
        var price = $('#ride_' + rideID + '_' + to + '_price').val();
        if (!price || isNaN(price)) {
            $('#ride_' + rideID + '_' + to + '_price').addClass('NotValid');
            return;
        }
        $(el).hide();
        
        $('#ride_' + rideID + '_' + to + '_isApproved').hide();
       // socket.emit('updateRidePrice', { rideID: rideID, price: price, username: $.cookie('username', { path: '/' }), toUser: to, name: $.cookie('name', { path: '/' }) });
        socket.emit('updateRidePrice', { rideID: rideID, price: price, username: $.cookie('username', { path: '/' }), toUser: to, name: $.cookie('name', { path: '/' }) });
        $('#ride_' + rideID + '_' + to + '_pleaseWait').show();


     
    };


    window.approveRideStatus = function (rideID,to, isApproved) {
       
        if (!isApproved) {
            $('#approveBtn_' + rideID).hide();
            $('#disapproveBtn_' + rideID).hide();
            $('#ride_' + rideID + '_' + to + '_pleaseWait').show();
            socket.emit('approveRideStatus', { rideID: rideID, username: $.cookie('username', { path: '/' }), toUser: to, isApproved: isApproved ,name: $.cookie('name', { path: '/' }) });
        }
        else {
            ng.ws('getAgreement', { rideID: rideID, username: $.cookie('username', { path: '/' }), toUser: to, isApproved: isApproved }, function (d) {
                var html = ng.renderer.render('Agreement/Agreement', d);
                $('#AgreementLB').html(html);
                var date = new Date();
                var today = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                $('#orderDate').html(today);
                openLightBox('#AgreementLB');
                $('#approveAgreementBtn').click(function () {
                    $('#approveBtn_' + rideID).hide();
                    $('#disapproveBtn_' + rideID).hide();
                    paymentApproved(rideID, to);
                });
                $('#approveAgreementPayBtn').click(function () {
                    $('#approveBtn_' + rideID).hide();
                    $('#disapproveBtn_' + rideID).hide();
                    
                    window.location = "paycal/?rideID=" + rideID + "&t=" + $.cookie('username', { path: '/' });
                   
                        //window.PayCal = {};
                        //window.PayCal.key = $('#approveAgreementPayBtn').data('calclientkey');
                        //window.PayCal.modal = false;
                        //window.PayCal.amount = d.price;
                        //window.PayCal.currency = 1;
                        //window.PayCal.creditBrands = [1, 2, 3];
                        //window.PayCal.transaction = "";
                        //window.PayCal.description = "";
                        //window.PayCal.isCvv2 = true;
                        //window.PayCal.isIdnumber = false;
                        //window.PayCal.creditTypes = [
                        //    { 'code': 1 },
                        //    { 'code': 8, 'maxPayments': 5 }
                        //];
                        //window.PayCal.additionalInformation = {
                        //    'key1': 1,
                        //    'key2': 'value2'
                        //};
                        //window.PayCal.logo = "http://google.com/logo.png";
                        //window.PayCal.doneCallback = "funcName";
                        //window.PayCal.buttonClass = "custom-button";
                        //window.PayCal.buttonSize = "medium";
                        //window.PayCal.buttonText = "payment button";
                        
                        //$.ajax({
                        //    url: $('#approveAgreementPayBtn').data('calurl') + 'payCalButton.js',
                        //    dataType: "script",
                        //    success: function () {
                        //        alert("ok");
                        //    }
                        //});


                });
                
            });
        }

       
    };

    window.paymentApproved = function (rideID, to) {
        $('#ride_' + rideID + '_' + to + '_pleaseWait').show();
        socket.emit('approveRideStatus', { rideID: rideID, username: $.cookie('username', { path: '/' }), toUser: to, isApproved: true , name: $.cookie('name', { path: '/' })});
        closeLightBox();
        $('#approveMsg_' + rideID).html('ממתין לאישור העיסקה');
    }    

});



//function userAskRide(rideID) {
//    var user = $.cookie('username', { path: '/' });
//    ng.ws('userAskRide', { rideID:parseInt( rideID), username:user  }, function (ride) {
//        var chatMsgs = ride.chats[user];
//        $('#ChatWin_' + rideID).html('');
//        for (var i = 0; i < chatMsgs.length; i++) {
//            var data = chatMsgs[i];
//            if (data.username == $.cookie('username', { path: '/' }))
//                $('#ChatWin_' + data.rideID).append('<span style="color:red">' + data.time + ' | אתה:<br/>' + data.message, '</span><br/>');
//            else
//                $('#ChatWin_' + data.rideID).append(data.time + ' | ' + data.name + '<br/>' + data.message, '<br/>');
//        }
//    });

//    $('#ChatRow_' + rideID).show();
//}

function toggleChatMsg(rideID)
{
    var currentMsgID = "#chatMsg_" + rideID;
    if($(currentMsgID).val() == "כתוב הודעה...")
        $(currentMsgID).val("");
    else if($(currentMsgID).val() == "")
        $(currentMsgID).val("כתוב הודעה...");
}

function userAskRide(rideID) {
    
    var currentBallID = "#Ball" + rideID;
    var bidRideID = "#BidRide" + rideID;
    var closeBidRideBtn = "#CloseBidRideBtn" + rideID;
    var extaFild = "#rideRowExtra_" + rideID;
    var user = $.cookie('username', { path: '/' });

    if($('#ChatRow_' + rideID).css("display") == "none")
    {
        $(bidRideID).parents("tr").addClass("CurrentRow");
        $(currentBallID).removeClass("RedBall").addClass("GreenBall");
		$(extaFild).hide();
		
        //$(bidRideID).removeClass("BidRideBtn").addClass("CloseBidRideBtn").html("סגור חלון");
        $("#BidRide" + rideID).hide();
        $(closeBidRideBtn).show();

        ng.ws('userAskRide', { rideID: parseInt(rideID), username: user }, function (ride) {
            if (ride.requests) {
                var chatMsgs = ride.requests[user].msgs;
                $('#ChatWin_' + rideID).html('');
                for (var i = 0; i < chatMsgs.length; i++) {
                    var data = chatMsgs[i];
                    if (data.username == $.cookie('username', { path: '/' }))
                        $('#ChatWin_' + data.rideID).append('<span style="color:red">' + data.time + ' | אתה:<br/>' + data.message + '</span><br/>');
                    else
                        $('#ChatWin_' + data.rideID).append(data.time + ' | ' + data.name + '<br/>' + data.message + '<br/>');

                    scrollChat($('#ChatWin_' + data.rideID));
                }
            }
        if (ride.requests[user].price) {
            $('#price_' + rideID).html(ride.requests[user].price + ' ש"ח');
            $('#approveDiv_' + rideID).show();
        }
        if (ride.requests[user].isApproved === false) {
            $('#approveBtn_' + rideID).hide();
            $('#disapproveBtn_' + rideID).hide();
        }
        else if (ride.requests[user].ApprovalDate) {
            $('#approveBtn_' + rideID).hide();
            $('#disapproveBtn_' + rideID).hide();
            $('#approveMsg_' + rideID).html('ממתין לאישור העיסקה');
        }
        });
       
        $('#ChatRow_' + rideID).show();

        $(".RedBall").addClass("AdjustRedBall");
    }
    else
    {
        $(bidRideID).parents("tr").removeClass("CurrentRow");
        $(currentBallID).removeClass("GreenBall").addClass("RedBall");
        //$(bidRideID).removeClass("CloseBidRideBtn").addClass("BidRideBtn").html("הזמן נסיעה");
        $("#BidRide" + rideID).show();
        $(closeBidRideBtn).hide();
		$(extaFild).show();

        $('#ChatRow_' + rideID).hide();

        $(".RedBall").removeClass("AdjustRedBall");
    }
	
}

function OpenRequest(rideID,requestFrmUsernam) {

    var currentBallID = "#Ball" + rideID + "_" + requestFrmUsernam;
    var bidRideID = "#BidRide" + rideID + "_" + requestFrmUsernam;
    var user = $.cookie('username', { path: '/' });

    if ($('#ChatRow_' + rideID + "_" + requestFrmUsernam).css("display") == "none") {
        $(bidRideID).parents("tr").addClass("CurrentRow");
        $(currentBallID).removeClass("RedBallIcon").addClass("GreenBallIcon");
        $(bidRideID).removeClass("OpenRideBtn").addClass("CloseRideBtn").html("סגור חלון");

        
        $('#ChatRow_' + rideID + "_" + requestFrmUsernam).show();
        var e = $('#ChatWin_' + rideID + '_' + requestFrmUsernam)
        scrollChat(e);

        $(".RedBallIcon").addClass("AdjustRedBallIcon");
    }
    else {
        $(bidRideID).parents("tr").removeClass("CurrentRow");
        $(currentBallID).removeClass("GreenBallIcon").addClass("RedBallIcon");
        $(bidRideID).removeClass("CloseRideBtn").addClass("OpenRideBtn").html("פתח");
        $('#ChatRow_' + rideID + "_" + requestFrmUsernam).hide();

        $(".RedBallIcon").removeClass("AdjustRedBallIcon");
    }

    notifyRead({ rideID: parseInt(rideID), from: requestFrmUsernam, to: $.cookie('username', { path: '/' }) });
}

function OpenApprovedRideRequest(rideID,requestFrmUsernam) {
    var currentBallID = "#Ball" + rideID + "_" + requestFrmUsernam;
    var bidRideID = "#BidRide" + rideID + "_" + requestFrmUsernam;
    var user = $.cookie('username', { path: '/' });

    if ($('#ChatRow_' + rideID + "_" + requestFrmUsernam).css("display") == "none") {
        $(bidRideID).parents("tr").addClass("CurrentRow");
        $(currentBallID).removeClass("ApprovedRedBallIcon").addClass("ApprovedGreenBallIcon");
        $(bidRideID).removeClass("OpenApprovedRideBtn").addClass("CloseApprovedRideBtn").html("סגור");

        
        $('#ChatRow_' + rideID + "_" + requestFrmUsernam).show();
        var e = $('#ChatWin_' + rideID + '_' + requestFrmUsernam)
        scrollChat(e);

        $(".ApprovedRedBallIcon").addClass("AdjustApprovedRedBallIcon");
    }
    else {
        $(bidRideID).parents("tr").removeClass("CurrentRow");
        $(currentBallID).removeClass("ApprovedGreenBallIcon").addClass("ApprovedRedBallIcon");
        $(bidRideID).removeClass("CloseApprovedRideBtn").addClass("OpenApprovedRideBtn").html("פתח");
        $('#ChatRow_' + rideID + "_" + requestFrmUsernam).hide();

        $(".ApprovedRedBallIcon").removeClass("AdjustApprovedRedBallIcon");
    }

    notifyRead({ rideID: parseInt(rideID), from: requestFrmUsernam, to: $.cookie('username', { path: '/' }) });
}

function toggleOpenChatMsg(rideID, reqKey)
{
    var currentMsgID = "#chatMsg_" + rideID + "_" + reqKey;
    if($(currentMsgID).val() == "כתוב הודעה...")
        $(currentMsgID).val("");
    else if($(currentMsgID).val() == "")
        $(currentMsgID).val("כתוב הודעה...");
}

function openRquestNotification(rideID,user) {
    var rID = rideID;
    var u = user;
    ng.Load('/requests', { Container: '#Pane', cb: function () { OpenRequest(rID, u) } });
}

function openHPNotification(rideID, user) {
    var rID = rideID;
    var u = user;
    ng.Load('/', {
        Container: '#Pane', cb: function () {
            userAskRide(rID);
            $(".RidesPane").scrollTo("#rideRow_" + rID);
            notifyRead({ rideID: parseInt(rideID), from: user, to: $.cookie('username', { path: '/' }) });
        }
    });
}
function openOCRNotification(rideID, user) {
        var rID = rideID;
        var u = user;
        ng.Load('/ocr', {
            Container: '#Pane', cb: function () {
                OpenRequest(rID, u)
                notifyRead({ rideID: parseInt(rideID), from: user, to: $.cookie('username', { path: '/' }) });
            }
        });
}
    //openUCRNotification
function openUCRNotification(rideID, user) {
    var rID = rideID;
    var u = $.cookie('username', { path: '/' });
    ng.Load('/ucr', {
        Container: '#Pane', cb: function () {
            OpenRequest(rID, u)
            notifyRead({ rideID: parseInt(rideID), from: user, to: $.cookie('username', { path: '/' }) });
        }
    });
}
function scrollChat(e) {
    if(e[0])
        e.scrollTop(e[0].scrollHeight);
}

function sendChatFromOwnerOnEnter(event, rid, u) {
    if (event.keyCode == 13)
        sendChatFromOwner(rid, u);
}

function sendChatOnEnter(event, rid, u) {
    if (event.keyCode == 13)
        sendChat(rid, u);
}

function sendChat2AllOnEnter(event) {
    if (event.keyCode == 13)
        send2All();
}


jQuery.fn.scrollTo = function (elem) {
    $(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top);
    return this;
};