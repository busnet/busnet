module.exports = {
    autoPack:true,
    listen:{
        host: "localhost",
	    port: 3002
    },
    serve:{
        host: "localhost",
        //host: "busnet-v103-kzub3gtaju.elasticbeanstalk.com",
        port: 3002
    },
    db:{
        name:"BusNet",
        //server:"ip-172-31-25-81.us-west-2.compute.internal"
        server: "localhost"
    },
    wasup:
    {
        //url: "localhost:3000/wasup/send",
        url: "ip-172-31-18-6.us-west-2.compute.internal:3000/wasup/send"
    }
}

