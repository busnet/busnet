function Responder(request,response,params){
    this.request = request;
    this.response = response;
    this.Params = params;
}

Responder.prototype.GetData = function(){ /*console.log(this.template)*/ };

module.exports = Responder;
