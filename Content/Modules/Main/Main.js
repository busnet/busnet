var litghtBox = {};

var weekDays = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת",]

function openLightBox(selector){
    $('#mask').show();
    var winH = $(window).height();
    var winW = $(window).width();
    //Set the popup window to center
    $('#lb').css('top',  winH/2-$(selector).height()/2);
    $('#lb').css('left', winW/2-$(selector).width()/2);
    litghtBox.parent = $(selector).parent();
    litghtBox.selector = selector;
    $('#lb').append($(selector).show()).fadeIn(400);
    //test/
}

function closeLightBox(){
    litghtBox.parent.append($(litghtBox.selector).hide());
    $('#lb').hide();
    $('#mask').hide();
    litghtBox ={};
}

function InitRedBar(type){
   if(type!='HP')
       $('#HeaderText').html('');
    $('#redBgBar').attr( "class" ,'redBgBar'+type);
}


function reffreshHP() {
    var options = { Container: '#Pane', ScrollTop: true };
    options.cb = function () { $('.ReffreshIcon').hide(); };
    ng.Load('/', options);
}


function initTopDate() {
    var d = new Date();
    
    var hours = d.getHours();
    var minutes = d.getMinutes();

    if(hours < 10 )
        hours = "0" + hours;

    if(minutes < 10 )
        minutes = "0" + minutes;

    var dayIndex = d.getDay();
    var day = weekDays[dayIndex];
    var time = hours + ':' + minutes;    
    var date = d.getDate() + '.' + (d.getMonth() + 1) + "." + d.getFullYear();

    $('#topDay').html("יום " + day + " ");
    $('#topDate').html(date);
    $('#topTime').html(time);
    
    setTimeout(initTopDate, 20 * 1000);
}

function InitSearch() {
    initTopDate();
    initNotifications();
    $(".GoogleSearchInput").val("");
    initGoogleSearch();
    $('.CompanyTitle').html($.cookie('name', { path: '/' }));

    ng.ws('getRss',{}, function (d) {
        ng.render('RSS/Rss',d,function(htm){
            $('.NewsFlash').html(htm);
        });
    });

   
   

    //Localizing The Datepicker To Hebrew
    $.datepicker.regional['he'] = {
        closeText: 'סגור',
        prevText: '&#x3c;הקודם',
        nextText: 'הבא&#x3e;',
        currentText: 'היום',
        monthNames: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
        'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
        monthNamesShort: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יוני',
        'יולי', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
        dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
        dayNamesShort: ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'],
        dayNamesMin: ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'שבת'],
        weekHeader: 'Wk',
        dateFormat: 'dd/mm/yy',
        firstDay: 0,
        isRTL: true,
        showMonthAfterYear: false,
        yearSuffix: ''
    };

    $.datepicker.setDefaults($.datepicker.regional['he']);

    $("#dateInput").datepicker({ dateFormat: 'dd/mm/yy', minDate: new Date() });

    loadCalendar();    

    if (ng.QS['vt'])
        $('.sVehicleType').val(decodeURIComponent(ng.QS['vt']));
    if (ng.QS['ad'])
        $('#dateInput').val(ng.QS['ad']);
    if (ng.QS['area']) {
        $('#area').val(decodeURIComponent(ng.QS['area']));
        setTimeout(function () {
            $('.ui-filterable input').val(decodeURIComponent(ng.QS['area']));
            $(".ui-filterable input").change(function () {
                $('#area').val($(this).val());
                filter();
                $('#CityList').hide();
            });
        }, 500);
    }
    getSubContactionRides();

    $("#CityList li").click(function () {

        $('#area').val($(this).html());
        $('.ui-filterable input').val($(this).html());
        filter();
        $('#CityList').hide();
    });

   
}

function getSubContactionRides() {
    ng.ws('getSubContactionRides', {}, function (d) {
        ng.render('Board/SubContactionRides', d, function (htm) {
            $('.SubcontractionPane').html(htm);
        });
    });
}

function ClearInputs()
{
   // $(".SearchInput").val("הקלד עיר לחיפוש");
  //  $(".DateInput").val("");
}

//var isReportsMenueOpening = false;
//function OpenReportsMenu(event) {
//    event.stopPropagation();
//    isReportsMenueOpening = true;
//    $('#ReportsMenu').show(400);
//    setTimeout(function () { isReportsMenueOpening = false }, 500);
//}

//function CloseReportsMenu(event) {
//    event.stopPropagation();
//    if(!isReportsMenueOpening)
//        $('#ReportsMenu').hide();
//}

function filter() {
    var type = $('.sVehicleType').val();
    var url =  window.location.pathname + "?s=1";
    if(type)
        url+= '&vt='+type;
		
    var ad = $('#dateInput').val();
    if (ad)
        url += '&ad=' + ad;
		
    var area = $('#area').val();
    if (area)
        url += '&area=' + area;
    ng.Load(url, { Container: '#InnerPane' });

}

function initGoogleSearch() {

    $(".GoogleSearchBtn").click(function() {
    var href = "https://www.google.co.il/search?q=";
    var searchTerm = $(".GoogleSearchInput").val();
    if(searchTerm != "")
    {
        href += searchTerm;
        window.open(href, '_blank');
    }
});

    $(".GoogleSearchInput").bind('keypress', function(e) {
    var code = e.keyCode || e.which;
    if(code == 13) { //Enter keycode
        $(".GoogleSearchBtn").trigger("click");
    }
});

}
