

Meteor.publish('todayFlowRate', function() {
    return CurrentFlowRate.find({}, {
        sort: {
            created_on: -1
        },
        limit: 60

    });
});

//we can change the limit if needed
Meteor.publish('monthFlowRate',function(){return MonthFlowRate.find({},{sort:{created_on:-1},limit:20});})

Meteor.publish('shareInfo', function() {
    return Info.find();
});


Meteor.publish('stateInfo', function() {
    return State.find();
});

Meteor.publish('yearFlowRate', function(){return YearFlowRate.find({},{sort:{created_on:-1},limit:10})})

Meteor.publish('leakRules',function(options){
    check(options,{limit:Number});

    var queryOptions = {
        limit: options.limit
    }

    return LeakRuleCollection.find({},queryOptions);
});