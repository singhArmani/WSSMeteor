Meteor.methods({
    getflowRateVal: function() {

        // var upstream = bin2dec(up) * 0.0038145985401459854014598540146 + bin2dec(upin) * 250.00000019790250962391171997642;
        // var dnstream = bin2dec(dn) * 0.0038145985401459854014598540146 + bin2dec(dnin) * 250.00000019790250962391171997642;
        // var tofvalue = (upstream - dnstream).toFixed(4);
        // var flowrate = (tofvalue * pie * diameter * diameter * 1482 * 1482) / (8 * length * 1000000000);
        // //inserting into the database
        // console.log("going to insert into " + (flowrate * 1000).toFixed(4) + " currentFlowRate collection");
        // CurrentFlowRate.insert({
        //     CurrentFlowRate: flowrate
        // });
        // return flowrate;
    },
    getTemp: function() {
        var n = (bin2dec(t1intresult) / bin2dec(t3intresult) - 1.077 + 0.004) / 0.004;
        return (20 + (n - 1)).toFixed(2);
    },
    updateSetting: function(name, value) {
        console.log(Settings.update({
            name: name
        }, {
            name: name,
            value: value
        }, {
            upsert: true
        }));
        // Settings.find({name: "litres"});
    },
    getSettings: function() {
        return Settings.find({}).fetch();
    },
    getSetting: function(id) {
        return Settings.find({
            _id: id
        }).fetch();
    },
    getFlowRates: function() {
        return FlowSamples.find({}).fetch();
    },
    getStatus: function() {
        var today = new Date(),
            oneDay = (1000 * 60 * 60 * 24),
            oneDayAgo = new Date(today.valueOf() - (1 * oneDay)),
            oneMonthAgo = new Date(today.valueOf() - (30 * oneDay)),
            oneYearAgo = new Date(today.valueOf() - (365 * oneDay));
        var day = FlowSamples.aggregate([{
            "$match": {
                "created_on": {
                    $gt: oneDayAgo.getTime()
                }
            }
        }, {
            "$group": {
                _id: null,
                "count": {
                    "$sum": 1
                },
                "totalValue": {
                    "$sum": "$rate"
                }
            }
        }]);

        var month = FlowSamples.aggregate([{
            "$match": {
                "created_on": {
                    $gt: oneMonthAgo.getTime()
                }
            }
        }, {
            "$group": {
                _id: null,
                "flowrate": {
                    "$sum": 1
                },
                "totalValue": {
                    "$sum": "$rate"
                }
            }
        }]);


        var year = FlowSamples.aggregate([{
            "$match": {
                "created_on": {
                    $gt: oneYearAgo.getTime()
                }
            }
        }, {
            "$group": {
                _id: null,
                "count": {
                    "$sum": 1
                },
                "totalValue": {
                    "$sum": "$rate"
                }
            }
        }]);

        return {
            leak: leakDetected,
            day: day,
            month: month,
            year: year
        };
    },
    getDayFlowRate: function() {
        var today = new Date(),
            oneDay = (1000 * 60 * 60 * 24),
            oneDayAgo = new Date(today.valueOf() - (1 * oneDay));
        var samples = FlowSamples.aggregate([{
            "$match": {
                "created_on": {
                    $gt: oneDayAgo.getTime()
                }
            }
        }, {
            "$group": {
                _id: null,
                "count": {
                    "$sum": 1
                },
                "totalValue": {
                    "$sum": "$rate"
                }
            }
        }]);
        return samples[0];
    },
    resetFlow: function() {
        FlowSamples.remove({});
        FlowSamples.insert({
            rate: count,
            created_on: new Date().getTime()
        });
        count = 0;
    },
    enableWater: function(status){
        check(status,Boolean);
        var id = State.findOne({})._id;
        State.update(id,{$set:{waterEnabled:status}})
    },
    setLeakRules: function(options){

        //receiving a right data for the server to process.
        console.log(options)

        var pattern = {
            ruleType:String,
            flow:Number,
            timeFrame:Number,
            action:Object
        }
            check(options,pattern);

        //inserting into the collection
        LeakRuleCollection.update(options,options,{upsert:true});
    }
});
