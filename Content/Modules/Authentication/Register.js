function InitLoginInputs() {  
        $(".LoginInput").val("");
        $('body').addClass('BusBG');
}

$(".LoginInput").focus(function() {
        var placeHolderValue = $(this).attr("placeholder");
        if(placeHolderValue == "שם משתמש*")
            $(this).attr("placeholder", "")
        else if(placeHolderValue == "סיסמה*")
            $(this).attr("placeholder", "")

        $(this).addClass("EngDirection");
    });

$(".LoginInput").blur(function() {     
        var type = $(this).attr("type");
        var inputValue = $(this).val();
        if(inputValue == "" && type == "text")
            {
            $(this).attr("placeholder", "שם משתמש*")
            
            $(this).removeClass("EngDirection");
        }
        else if(inputValue == "" && type == "password")
            {
                $(this).attr("placeholder", "סיסמה*")
            
                $(this).removeClass("EngDirection");
        }

    });


function InitRegister1() {
    $('body').addClass('BusBG');
}

function register1Continue() {
    if (!ng.validate("Register"))
        return;
    var company = ng.getFormData("Company");
    company.dtl = ng.getFormData("CompanyDtl");
    company.dtl.email = company.email
    company.dtl.contactName = company.firstName + ' ' + company.lastName

    var companyExDtl = ng.getFormData("CompanyExDtl");
    company.dtl.extraDetails = companyExDtl.extraDetails

    ng.ws('addUser',company, function (d) {
        if (d) {
            var date = new Date();
            date.setTime(date.getTime() + (48 * 60 * 60 * 1000)); // 48H

            $.cookie('username', d.username, { path: '/' ,expires: date  });
            $.cookie('h', d.hash, { path: '/', expires: date });
            $.cookie('name', d.dtl.companyName, { path: '/', expires: date });
            window.location = '/';
        }
        else
            alert('error');
    });

}




function TryLogin(e) {
    if (e.keyCode == 13) {
        login();
    }
    else
        return false;
}

function logout() {
    $.cookie("username", null, { path: '/' });
    $.cookie("u", null, { path: '/' });
    $.cookie("h", null, { path: '/' });
    $.cookie("name", null, { path: '/' });
    window.location = "/";
}
function login(){
    if(!ng.validate("Login"))
        return;
    var l = ng.getFormData("Login");
     ng.ws('login',l,function(d){
         if(!d ){
             $('#logErrMsg').show();
        }
         else{
             $('#logErrMsg').hide()
             //_id:1,email:1,hash:1,firstName:1

             var date = new Date();
             date.setTime(date.getTime() + (72 * 60 * 60 * 1000)); // 72H
             $.cookie('u', d.username, { path: '/', expires: date });
             $.cookie('h', d.hash, { path: '/', expires: date });
             $.cookie('name', d.dtl.companyName, { path: '/', expires: date });
             $.cookie('username', d._id, { path: '/', expires: date });

             var options = { Container: '#Pane', ScrollTop: true };
             if (!d.favi) {
                 options.cb = function () { openFaviArea(); };
             }
             else {
                 
                 $.cookie('faviArea', d.favi.area, { path: '/' });
             }

            ng.Load('/',options);            
            }
        });
}


function isLogedin(){
    return ($.cookie('email',{path:'/'}) && $.cookie('h',{path:'/'}))
}

function openRegThanks(){
    var selector = '.regTY';
    $('#mask').show();
    var winH = $(window).height();
    var winW = $(window).width();
    //Set the popup window to center
    $(selector).css('top',  winH/2-$(selector).height()/2);
    $(selector).css('left', winW/2-$(selector).width()/2);
    
    $(selector).fadeIn(400);
    
    setTimeout(function(){
        if(window.location.search && window.location.search.indexOf('gts=1')>0)
                     ng.Load('/shipping',{Container:'#Pane',ScrollTop:true});
                 else
                      ng.Load("/בשרים/בשר-לגריל-ולתנור",{Container:'#Pane',ScrollTop:true});
        $('#mask').hide();
        },2500);
}

function openForgotPass(){
    var html = ng.renderer.render('Authentication/ForgotPass',{});
    $('#OS').html(html);
    openLightBox('#forgotPass');
}

function retrivePass(){
    $('#btnFp').html('אנא המתן...');
    ng.ws("retrivePass",$('#forgotPassEmail').val(),function(d){
        if(d.emailNotFound){
            $('#fpErrMsg').show();
            $('#btnFp').html('שחזר סיסמה')
            }
        else{
            $('#fp1').hide();
            $('#fp2').show();
        }
        });
}

function joinMailingList(){
    ng.ws('joinMailingList',$('#tbMailingList').val(),function(d){
        $('.mailForm').html('תודה שנרשמת');
    });
}

function gotoRegister(){
     if(window.location.search && window.location.search.indexOf('gts=1')>0)
            ng.Load('/register?gts=1',{Container:'#Pane',ScrollTop:true});
        else
            ng.Load("/register",{Container:'#Pane',ScrollTop:true});
}


function  UpdateUserDtl(){
    var ud = ng.getFormData("UserDtl");
    ud.email = $.cookie('email',{path:'/'});
    ng.ws('UserDtl',ud,function(d){
        var h =  ud.firstName +' '+ ud.lastName +' * '+ ud.street +' '+ ud.houseNumber +' '+ ud.city +'  *  טלפון לבירורים:' +ud.phone;
        if(!ud.private)
            h+= "<div>  מס' דירה:" +ud.appNumber+  " קומה:" + ud.flor + " כניסה:" +ud.entrance + '</div>';

        $('.shippingDtl').html(h);

        closeLightBox();
    });
}

function hideRegisterBtn () {
		$(".terms-checkbox").change(function() {
			if(this.checked) {
				$(".register-btn").show();  
			} else {
				$(".register-btn").hide();
			}
		});
}
