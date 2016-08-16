Meteor.publish('samples', function() {
    //console.log("============================================================publish samples");
    return FlowSamples.find({}, {
        sort: {
            created_on: -1
        },
        limit: 60
            // ,
            // fields: {
            //     'rate': 1
            // }
    });
});
Meteor.publish('todayFlowRate', function() {
    //console.log("============================================================publish DumFlowRate");
    return CurrentFlowRate.find({}, {
        sort: {
            created_on: -1
        },
        limit: 60
            // ,
            // fields: {
            //     'rate': 1
            // }
    });
});


Meteor.publish('shareInfo', function() {
    return Info.find();
});
