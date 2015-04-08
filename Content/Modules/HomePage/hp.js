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
    /*setTimeout(function () {
        $('#CityList').hide();
        $('.ui-input-search input').click(function (event) { event.stopPropagation(); }).focus(function (event) { event.stopPropagation(); $('#CityList').show(); });
        $('html').click(function () { $('#CityList').hide(); });
    }, 1000);*/
    loadFaviArea();
    $( ".filterable" ).on( "listviewbeforefilter", function ( e, data ) {
    var $ul = $( this ),
    $input = $( data.input ),
    value = $input.val();

    $ul.html( "" );
    if ( value && value.length > 1 ) {
        $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
        $ul.show();
        $ul.html( "<li></li>" );
        ng.ws('getCities', value,function (data) {
            var area = "";
            $.each(data, function ( i, city ) {
                if(city.area != area){
                    $ul.append($("<li data-role=\"list-divider\" role=\"heading\" class=\"ui-li-divider ui-bar-inherit\" >"+ city.area +"</li>"));
                }
                area = city.area;
                var li = $("<li data-cityid=\""+ city._id +"\" data-areaid=\""+ city.areaId +"\" data-filtertext=\""+ city.city +"\"><a href=\"javascript:false;\">"+ city.city +"</a></li>");
                li.click(function() {
                    var selection = $(this).text();
                    $input.val(selection);
                    $input.data("cityid", $(this).data().cityid);
                    $input.data("areaid", $(this).data().areaid);
                    $ul.hide();
                });
                $ul.append(li);
                $ul.listview( "refresh" );
                $ul.trigger( "updatelayout");
            });
        });
    }
});
}

function loadFaviArea() {
changeRideRowColor ();
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

function changeRideRowColor () {
$("td:contains('קבלנות משנה')").css('background-color','#499c4a').css('color','white');
$("td:contains('קבלנות משנה')").siblings().css('background-color','#499c4a').css('color','white');
$("td:contains('קבלנות משנה')").parent().css('background-color','#499c4a').css('color','white');
$("td:contains('קבלנות משנה')").parent().find(".CompanyNameClick").css('color','white');
}
