var Responder = require("./Responder");
var Mongolian = require("mongolian");
var config = require("../../settings/config.js");
var areas = require("../../BLL/Areas/Areas.js");
var server = new Mongolian(config.db.server);
var db = server.db(config.db.name);
var urlLib = require("url");

function DBFindResponder (request,response){
    this.request = request;
    this.response = response;
    this.url = urlLib.parse(request.url,true);
    this.params = {};
    }

DBFindResponder.prototype = new Responder();

DBFindResponder.prototype.GetData = function (templateData, cb, params) {
    this.params = params
    that = this;
    var t = JSON.parse(JSON.stringify(templateData));
    this.SetValues(t.Criteria);
    this.SetValues(t.Options);
    var cur = db.collection(t.Collection).find(t.Criteria, t.Fileds);
    var pager = {};
    if (t.Options) {
        if (t.Options.pager == 1) {
            cur.count(function (err, c) {
                pager.count = c;
            });
            t.Options.skip = (t.Options.pn - 1) * t.Options.ps;
            t.Options.limit = t.Options.ps;
        }
        if (t.Options.sort) {
            cur = cur.sort(t.Options.sort);
            pager.sort = t.Options.sort;
        }
        pager.skip = 0;
        if (t.Options.skip) {
            cur = cur.skip(t.Options.skip);
            pager.skip = t.Options.skip;
        }
        if (t.Options.limit) {
            cur = cur.limit(t.Options.limit);
            pager.limit = t.Options.limit;
        }
    }

    //console.log(cur);
    cur.toArray(function (err, data) {
        var r = {};
        if (t.ToArray)
            for (var f =0 ; f< t.ToArray.length;f++) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i][t.ToArray[f]]) {
                        var s = JSON.stringify(data[i][t.ToArray[f]]);
                        var obj = JSON.parse(s);
                        data[i][t.ToArray[f]] = [];
                        for (o in obj) {
                            if (obj.hasOwnProperty(o)) {
                                var ai = obj[o];
                                ai.key = o;
                                data[i][t.ToArray[f]].push(ai);
                            }
                        }
                    }
                }
            }
        r.res = data;
        r.Params = that.params;
        r.pager = pager;
        cb(err, r);
    });

}

DBFindResponder.prototype.SetValues = function(o){
    for (var i in o) {
        if (i  == '$exists') {
            var exs = o[i];
            delete o[i];
            var f = exs.prefix + "." + this.GetVal(exs.$$Param)
            o[f] = { '$exists': true };
        }
        else
         if(o[i] && o[i].$$Param){
            o[i] = this.GetVal(o[i].$$Param);
            if(!o[i])
                delete o[i];
        }
         else if(typeof(o[i])=="object")
             this.SetValues(o[i]);      
    }
}

function $in(val) {
    return JSON.parse('{"$in":[' + val + ']}');
}

DBFindResponder.prototype.GetVal = function (param) {
    var system = {
        today: function () {
            var d = new Date()
            d.setHours(d.getHours() + (d.getTimezoneOffset() / -60));
            return d
        },
        time: function(){
            var d = new Date()
            d.setHours(d.getHours() + (d.getTimezoneOffset() / -60));
            return d.getHours() +":"+ d.getMinutes();

        }
    };
    function like(txt) {
        return new RegExp(txt);
    }
    if (param.From == "Params" && this.params[param.Key]) {
        var v = this.params[param.Key];
        if (param.ParseFnc) {
            v = eval(param.ParseFnc + "(" + v + ")");
        }
        return v;
    }

    if (param.From == "System" && system[param.Key]) {
        var v = system[param.Key]();
      
        return v;
    }

    if (param.From == "QueryString" && this.url.query[param.Key]) {
        var v = this.url.query[param.Key];
        if (param.ParseFnc) {
            v = eval(param.ParseFnc + "('" + v + "')");
        }
        return v;
    }
    if (param.From == "Cookie") {
        var v = param.DefaultValue;
        if (this.request.cookies[param.Key])
            v = this.request.cookies[param.Key];
        if (param.ParseFnc && v) {
            v = eval(param.ParseFnc + "('" + v + "')");
        }
        return v;
    }

    if (param.From == "Area") {
        
        return areas[param.Key](this.request);
    }
    return param.DefaultValue;
}

module.exports = DBFindResponder;