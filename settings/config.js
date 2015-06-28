module.exports = {
    autoPack:true,
    listen:{
        host: "localhost",
	    port: 3002
    },
    serve:{
        //host: "localhost",
        host: "app.trucknet.co.il",
        port: 80
    },
    db:{
        name:"trucknet",
        server:"ip-172-31-25-81.us-west-2.compute.internal"
        //server: "localhost"
    },
    wasup:
    {
        //url: "localhost:3000/wasup/send",
        url: "ip-172-31-18-6.us-west-2.compute.internal:3000/wasup/send"
    },
    notifications:
    {
        //host: "81.218.164.217",
        host: "ec2-52-24-21-6.us-west-2.compute.amazonaws.com",
        //host: "ip-172-31-33-223.us-west-2.compute.internal",
        //host: "87.68.81.220",
        port: 444
    }
}

