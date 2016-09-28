const pie = Math.PI;
const length = 0.062;
const diameter = 0.012;
const calibrationFactor = 4.5;
const warningWaterUsePerDay = 10000;
const maxWaterUsePerDay = 30000;
//const warningFlowRate1 = 40;
//const warningFlowRate2 = 100;

var totalmillilitres = 0;
var count = 0;
var leakDetected = 0; // 0:no leak, 1:a little leak, 2:much leak

Meteor.startup(function() {
    console.log('started');


    // move the data from low-scale collection to high-scale collection and remove the useless data from collection
    Meteor.setInterval(Meteor.bindEnvironment(function() {
        var today = new Date(),
            oneDay = (1000 * 60 * 60 * 24),
            oneMonthAgo = new Date(today.valueOf() - (30 * oneDay)),
            oneDayAgo = new Date(today.valueOf() - (1 * oneDay)),
            oneHourAgo = new Date(today.valueOf() - (1000 * 60 * 60)), //for test
            fiveMinuteAgo = new Date(today.valueOf() - (5 * 1000 * 60)); //for test
        if (DEBUG) {
            // dealCurrentFlowRateCollection(oneDayAgo);
            // dealMonthFlowRateCollection(oneMonthAgo);

            //for testing purpose
            dealCurrentFlowRateCollection(fiveMinuteAgo);
            dealMonthFlowRateCollection(oneHourAgo);
        } else {
            // dealCurrentFlowRateCollection(oneDayAgo);
            // dealMonthFlowRateCollection(oneMonthAgo);
            // for test, if use it to product env, use above two lines.
            dealCurrentFlowRateCollection(oneHourAgo);
            dealMonthFlowRateCollection();
        }
    }), 6000);

    // monitor whether it is leaked
    // Meteor.setInterval(Meteor.bindEnvironment(function() {
    //     monitorLeak();
    // }), 6000);

    Meteor.setInterval(Meteor.bindEnvironment(function() {
        monitorLeakAdvance();
    }), 6000);

    // monitor the real-time flow rate
    Meteor.setInterval(Meteor.bindEnvironment(function() {
        //temperature
        //var n = (bin2dec(t1intresult) / bin2dec(t3intresult) - 1.077 + 0.004) / 0.004;
        //var tem = 20 + (n - 1) * 1;
        //var density = 1000 * (1 - ((tem + 288.9414) / (508929 * (tem + 68.129630))) * (tem - 3.9863) * (tem - 3.9863));
        //
        data([8]); // EVTMG2 start
        ss.writeSync(1);
        var upstream = bin2dec(getAVGupfrac()) * 0.0038145985401459854014598540146 + bin2dec(getAVGupin()) * 250.00000019790250962391171997642;
        var dnstream = bin2dec(getAVGdnfrac()) * 0.0038145985401459854014598540146 + bin2dec(getAVGdnin()) * 250.00000019790250962391171997642;
        var tofvalue = (upstream - dnstream).toFixed(4);
        if (DEBUG) tofvalue = Math.random() * 5000 + 5000;
        var flowrate = (tofvalue * pie * diameter * diameter * 1482 * 1482) / (8 * length * 1000000000);

        console.log('                  flowrate = ', (flowrate * 1000).toFixed(6), 'L/s');

        var date = new Date();
        //console.log("============================================================insert to CurrentFlowRate : ", flowrate, date.toISOString());
        CurrentFlowRate.insert({
            rate: flowrate,
            created_on: date
        }, function(error, result) {
           // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>insert to CurrentFlowRate count:" + CurrentFlowRate.find().count() + " resp : ", error, result);
        });

    }), 1000);

    var wrate = count / calibrationFactor;
    var flowmillilitres = (wrate / 60) * 1000;
    totalmillilitres += flowmillilitres;
    //water flow sensor input//
    input.watch(function(err, value) {
      data([4]);
      ss.writeSync(1);
    });

    //if there's nothing in the System collection
    if(State.find({}).count()=== 0) {
        //create some startup document
        State.insert({
            "leakDetected":false,
            "waterEnabled":true
        });
    }
});

function monitorLeak() {
    var today = new Date(),
        oneHourAgo = new Date(today.valueOf() - (1000 * 60 * 60)),
        oneMinuteAgo = new Date(today.valueOf() - (1000 * 60));
    var minuteRate = CurrentFlowRate.aggregate([{
        "$match": {
            "created_on": {
                $gt: oneMinuteAgo
            }
        }
    }, {
        "$group": {
            _id: null,
            "rate": {
                "$avg": "$rate"
            }
        }
    }])[0];

    var hourRate = CurrentFlowRate.aggregate([{
        "$match": {
            "created_on": {
                $gt: oneHourAgo
            }
        }
    }, {
        "$group": {
            _id: null,
            "rate": {
                "$avg": "$rate"
            }
        }
    }])[0];

    var dayRate = CurrentFlowRate.aggregate([{
        "$group": {
            _id: null,
            "rate": {
                "$avg": "$rate"
            },
            "sum": {
                "$sum": "$rate"
            }
        }
    }])[0];

    var monthRate = MonthFlowRate.aggregate([{
        "$group": {
            _id: null,
            "rate": {
                "$avg": "$rate"
            },
            "sum": {
                "$sum": "$rate"
            }
        }
    }])[0];

    var yearRate = YearFlowRate.aggregate([{
        "$group": {
            _id: null,
            "rate": {
                "$avg": "$rate"
            },
            "sum": {
                "$sum": "$rate"
            }
        }
    }])[0];

    var miRate = minuteRate.rate;
    var hoRate = hourRate.rate;
    var daRate = dayRate ? dayRate.rate : hoRate;
    var moRate = monthRate ? monthRate.rate : daRate;
    var daySum = dayRate.sum;
    var monthSum = monthRate ? (monthRate.sum * 60 + daySum) : daySum;
    var yearSum = yearRate ? (yearRate.sum * 60 * 60 + monthSum) : monthSum;





    if (daRate > moRate * 2 || hoRate > moRate * 4 || miRate > moRate * 6 || daySum > warningWaterUsePerDay) {
        leakDetected = 1;

        //updating the state
        var id = State.findOne({})._id;
        State.update(id,{$set:{leakDetected:true}})

        if (daRate > moRate * 4 || hoRate > moRate * 6 || miRate > moRate * 8 || daySum > maxWaterUsePerDay) {
            leakDetected = 2;
            //TODO: turn off the pipe
        }
        // if flow rate become low, there is no leak
        if (miRate < hoRate) {

            leakDetected = 0;
            State.update(id,{$set:{leakDetected:false}})
        }
    } else {
        leakDetected = 0;
        State.update(id,{$set:{leakDetected:false}})
    }


    //console.error(daySum, monthSum, yearSum);
    saveInfo("leakDetected", leakDetected);
    saveInfo("dailyFlowRate", daySum);
    saveInfo("monthlyFlowRate", monthSum);
    saveInfo("yearlyFlowRate", yearSum);
}



function monitorLeakAdvance(){
    // the rules of whether it is leaked

    // create a collection to store rules with follow parameters: flow, time, action
    // every time we check for leaks, do a for each of each item in the rules collection
    // write code that checks the following parameters from rules

    // if more than "flow" amount of water has been detected in "time" range period, execute "action"
    // action is a string, which will have a switch case to decide what to do.
    // Possible actions: "setLeak", "disableWater"

    // to implement the loop that checks this, there should be an interval that runs every 5 seconds. This will check the previous time range from now to see if "flow" water has passed.

    //amount of water flow in last 6 seconds

    var leakRules = LeakRuleCollection.find({}).fetch(); //getting all the rules

    //iterating over all the leakRules
    leakRules.forEach(function(item){

        console.log("leak Item is ",item);

        //destructuring
        let { ruleType, flow, timeFrame, action} = item;

        switch(ruleType) {
            case "Standard Leak":
                var amountOfWaterInDesiredTimeFrame = flow;
                var timeRange = timeFrame*1000;//in milliseconds

                var today = new Date();
                var desiredTimeFrame  = new Date(today.valueOf() - (timeRange));
                var rateForDesiredTimeFrameObj = CurrentFlowRate.aggregate([{
                    "$match": {
                        "created_on": {
                            $gt: desiredTimeFrame
                        }
                    }
                }, {
                    "$group": {
                        _id: null,
                        "rate": {
                            "$avg": "$rate"
                        }
                    }
                }])[0];
                console.log("rate for desired TimeFrame..",rateForDesiredTimeFrameObj.rate)


                var amountOfWaterFlowedInDesiredTimeFrame = timeRange*rateForDesiredTimeFrameObj.rate;
                console.log("amountOfWaterFlowed...",amountOfWaterFlowedInDesiredTimeFrame);
                if(amountOfWaterFlowedInDesiredTimeFrame>= item.flow){

                    switch (item.action){
                        case 'setLeak':
                            //TODO:implement set Leak coding functionality
                            console.log("setting the leak functionality")
                            break;
                        case 'disableWater':
                            //TODO:implement disable water flow functionality
                            console.log("disable water");
                            break;
                        default:
                            break;
                    }
                }
                break;
            case "Slow Leak": console.log("Slow Leak type");
                 //finding the minimum for that period of time
                var minimumAggregation

                break;
        }


    })
}

function saveInfo(key, value) {
    Info.upsert({
        "key": key
    }, {
        $set: {
            "value": value
        }
    });
}

// move data from todayFlowRate to monthFlowRate collection,
// and record the data per minute
function dealCurrentFlowRateCollection(time) {
    CurrentFlowRate.aggregate([{
        "$match": {
            "created_on": {
                $lt: time
            }
        }
    }, {
        "$group": {
            "_id": {
                hour: {
                    $hour: "$created_on"
                },
                minute: {
                    $minute: "$created_on"
                },
                month: {
                    $month: "$created_on"
                },
                day: {
                    $dayOfMonth: "$created_on"
                },
                year: {
                    $year: "$created_on"
                }
            },
            "rate": {
                "$avg": "$rate"
            }
        }
    }]).forEach(function(rateObj) {
        var r = rateObj._id;
        //var d = new Date(r.year + "-0" + r.month + "-" + r.day + "T" + r.hour + ":" + r.minute + ":00Z");
        var d = new Date(r.year + "-" + r.month + "-" + r.day + " " + r.hour + ":" + r.minute + ":00 GMT");
        MonthFlowRate.insert({
            rate: rateObj.rate,
            created_on: d
        });

        CurrentFlowRate.remove({
            "created_on": {
                $gte: new Date(d.getTime()),
                $lt: new Date(d.getTime() + 60 * 1000)
            }
        });
    });
}

// move data from monthFlowRate to yearFlowRate collection,
// and record the data per hour
function dealMonthFlowRateCollection(time) {
    MonthFlowRate.aggregate([{
        "$match": {
            "created_on": {
                $lt: time
            }
        }
    }, {
        "$group": {
            "_id": {
                hour: {
                    $hour: "$created_on"
                },
                month: {
                    $month: "$created_on"
                },
                day: {
                    $dayOfMonth: "$created_on"
                },
                year: {
                    $year: "$created_on"
                }
            },
            "rate": {
                "$avg": "$rate"
            }
        }
    }]).forEach(function(rateObj) {
        var r = rateObj._id;
        var d = new Date(r.year + "-" + r.month + "-" + r.day + " " + r.hour + ":00:00 GMT");
        YearFlowRate.insert({
            rate: rateObj.rate,
            created_on: d
        });

        MonthFlowRate.remove({
            "created_on": {
                $gte: new Date(d.getTime()),
                $lt: new Date(d.getTime() + 60 * 60 * 1000)
            }
        });
    });
}

