function showCompanyDtl(username) {
    ng.ws('getCompanyDtl',  username , function (d) {
            var html = ng.renderer.render('HomePage/CompanyDetails', d);
            $('#CompanyDeatils').html(html);            
            openLightBox('#CompanyDeatils');
        });
}


function openFaviArea() {
    var html = ng.renderer.render('HomePage/FaviArea', {});
    $('#FaviArea').html(html);
    openLightBox('#FaviArea');
    var items = $('#FaviArea input');
    var faviArea = $.cookie('faviArea', { path: '/' });
    if (faviArea !== null)
        faviArea = "," +faviArea + ",";
    
    for (var i = 0; i < items.length; i++) {
        var el = $(items[i]);
        if (faviArea === null || faviArea.indexOf("," + el.attr('area-id') + ",") > -1)
            el.prop('checked',true);
    }
}

function saveFaviArea() {
    var items = $('#FaviArea input');
    var faviCities = "",faviArea="";

    for (var i = 0; i < items.length; i++) {
        var el = $(items[i]);
        if (el.prop('checked')) {

            if (faviCities != "")
                faviCities+=","
            faviCities += el.attr('cities');

            if (faviArea != "")
                faviArea += ","
            faviArea += el.attr('area-id');
        }
    }

  //  $.cookie('faviCities', faviCities, { path: '/' });
    $.cookie('faviArea', faviArea, { path: '/' });

    ng.Load('/', { Container: '#InnerPane', ScrollTop: true }); 
    ng.ws('saveFaviArea', {
        favi: {
            cities: faviCities
        , area: faviArea
        }
        , username: $.cookie('username', { path: '/' })
        , h: $.cookie('h', { path: '/' })
    }
        , function () {
            closeLightBox();
        });
}

function initCitySearch() {
    setTimeout(function () {
        $('#CityList').hide();
        $('.ui-input-search input').click(function (event) { event.stopPropagation(); }).focus(function (event) { event.stopPropagation(); $('#CityList').show(); });
        $('html').click(function () { $('#CityList').hide(); });
    }, 1000);
    loadFaviArea();
}

function loadFaviArea() {
//changeRideRowColor ();
    if (!$.cookie('faviArea')) {
        ng.ws('getFaviArea', { username: $.cookie('username', { path: '/' }), hash: $.cookie('h', { path: '/' }) }, function (d) {
            if (!d.favi) {
                openFaviArea();
            }
            else {
                var date = new Date();
                date.setTime(date.getTime() + (240 * 60 * 60 * 1000)); // 10D
                $.cookie('faviArea', d.favi.area, { path: '/', expires: date });
                ng.ReloadContainer('#InnerPane');
            }
        });
        
    }
}
/*
function changeRideRowColor () {
$("td:contains('קבלנות משנה')").css('background-color','#B6C4E2').css('color','white');
$("td:contains('קבלנות משנה')").siblings().css('background-color','#B6C4E2').css('color','white');
$("td:contains('קבלנות משנה')").parent().css('background-color','#B6C4E2').css('color','white');
$("td:contains('קבלנות משנה')").parent().find(".CompanyNameClick").css('color','white');
$("td:contains('קבלנות משנה')").parent('tr').next().find('td').css('background-color','#B6C4E2').css('color','white');
}
*/

