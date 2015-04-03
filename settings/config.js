module.exports = {
    autoPack:true,
    listen:{
	    //host: "ec2-52-11-65-151.us-west-2.compute.amazonaws.com",
        host: "localhost",
        //port: 3002,
        //host: "awseb-e-g-AWSEBLoa-1323WP9X79QUC-1828159266.us-west-2.elb.amazonaws.com",
	    port: 3002
    },
    serve:{
        //host: "ec2-52-11-65-151.us-west-2.compute.amazonaws.com",
        //host: "localhost",
        //port: 3002,
        host: "app.busnet.co.il",
        port: 80
    },
    db:{
        name:"BusNet",
        server:"ip-172-31-25-81.us-west-2.compute.internal"
        //server: "localhost"
    },
    wasup:
    {
        //url: "localhost:3000/wasup/send",
        url: "ip-172-31-18-6.us-west-2.compute.internal:3000/wasup/send"
    }
}

