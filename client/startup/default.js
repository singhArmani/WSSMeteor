// Run this when the meteor app is started
Meteor.startup(function() {

    var intervalId = Meteor.setInterval(Meteor.bindEnvironment(function () {


        //finding the highest rate value since this client is connect

        var currentFlowRateVariable = CurrentFlowRate.find({}, {sort: {rate: -1}, limit: 1}).fetch();


        if(currentFlowRateVariable.length >0) {
            if (currentFlowRateVariable[0].rate > 0.01) {

                console.log("Time water usage started!");

                //TODO: setting up the Time water usage started variable here

                //stop the setInterval
                clearInterval(intervalId)
            }
        }

    }), 1000)
});

FlashMessages.configure({
    autoHide: true,
    hideDelay:5000,
    autoScroll: true
});
