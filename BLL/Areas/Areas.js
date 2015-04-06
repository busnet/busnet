var dal = require("../../DAL/dal").instance;

var areas = {};
dal.getAreas(function (err, areaArray) {
    for (i = 0; i < areaArray.length; i++)
        areas[areaArray[i]._id] = areaArray[i];
});



function GetFaviCities(request) {
    var faviArea = "";
    if (request.cookies["faviArea"])
        faviArea = request.cookies["faviArea"];

    var faviCities = "";
    var selectedAreas = faviArea.split(",");
    for (var i = 0; i < selectedAreas.length; i++) {
        if (faviCities != "")
            faviCities += ","
        if (selectedAreas[i] == "" )
            continue;
        faviCities += areas[selectedAreas[i]].cities;
    }
    if (faviCities == "")
        faviCities = "9999";
    var res = JSON.parse('{"$in":[9999]}');
    try {
        res = JSON.parse('{"$in":[' + faviCities + ']}');
    } catch (e) {
        console.log(faviCities);
        console.log(areas);
        
    }
    return res;
}

module.exports = { GetFaviCities: GetFaviCities };