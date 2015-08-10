module.exports = {
    autoPack:true,
    listen:{
        host: "localhost",
	    port: 3002
    },
    serve:{
<<<<<<< HEAD
        host: "localhost",
        //host: "app.busnet.co.il",
        //port: 80
        port: 3002
=======
        //host: "localhost",
        //host: "192.168.1.15",
        host: "app.busnet.co.il",
        port: 80
        //port: 3002
>>>>>>> 5b438a6ecaa479b58cce2a941fd0cc0ad064126c

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
    },
    notifications:
    {
        //host: "81.218.164.217",
        //host: "ec2-52-24-21-6.us-west-2.compute.amazonaws.com",
        host: "ip-172-31-33-223.us-west-2.compute.internal",
        port: 444
    }
}

