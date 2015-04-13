function openRide(rideID)
{
    var currentBallID = "#Ball" + rideID;
    var bidRideID = "#BidRide" + rideID;

    if($('#ChatRow_' + rideID).css("display") == "none")
    {
        $(currentBallID).removeClass("RedBall").addClass("GreenBall");
        $(bidRideID).html("סגור התקשרות");

        $('#ChatRow_' + rideID).show();
    }
    else
    {
        $(currentBallID).removeClass("GreenBall").addClass("RedBall");
        $(bidRideID).html("פתח התקשרות");

        $('#ChatRow_' + rideID).hide();
    }
}

function deleteRideFormMyRides(rideID) {
    var answer = confirm("אישור לחיצה יימחק נסיעה זו, האם למחוק?");
    
    if (answer == true) {
        
        ng.ws('deleteRideFormMyRides', { rideID: rideID, username: $.cookie('u', { path: '/' }), h: $.cookie('h', { path: '/' }) }, function (data) {
           ng.ReloadContainer("#InnerPane");
        });
    } 
}

fixHeigth ();

