lineChartFLowRate = null;
var handleCurrentFlowRateQuery = null;
Template.dashboard3.rendered = function() {
    Chart.defaults.global.animation.duration = 0;
    initializing = true;
    Meteor.subscribe('todayFlowRate');
    Meteor.subscribe('shareInfo');

    //setting the default session variable
    Session.setDefault("selectedDateRange","1");

    $('body').addClass('light-navbar');
    $('#page-wrapper').addClass('sidebar-content');
    var heightWithoutNavbar = $("body > #wrapper").height() - 61;
    $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

    //Reactive Computation for CurrentFlowRate Collection
    if(Session.get("selectedDateRange"))
    handleCurrentFlowRateQuery = CurrentFlowRate.find().observeChanges({
        added: function(id, fields) {
            // console.log("added ", id, fields);
            //console.log(lineChartFLowRate)
            if (!initializing) {
                var allSamples = CurrentFlowRate.find({}, {
                    limit:60,sort:{created_on:-1}
                }).fetch();

                var len = allSamples.length;
                // console.log(len)
                if (len == 60) {
                    var total = 0;
                    var dataC = [];
                    var labels = [];

                    if (!lineChartFLowRate) {

                        var data = {
                            labels: labels,
                            datasets: [{
                                label: "FLow Rate (L/s)",
                                fill: true,
                                lineTension: 0.2,
                                backgroundColor: "rgba(60,141,188,0.9)",
                                borderColor: "rgba(60,141,188,0.9)",
                                borderCapStyle: 'round',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderColor: "rgba(60,141,188,0.9)",
                                pointBackgroundColor: "rgba(60,141,188,0.9)",
                                pointBorderWidth: 0,
                                pointHoverRadius: 0,
                                pointHoverBackgroundColor: "rgba(60,141,188,0.9)",
                                pointHoverBorderColor: "rgba(60,141,188,0.9)",
                                pointHoverBorderWidth: 0,
                                pointRadius: 0,
                                pointHitRadius: 0,
                                data: dataC,
                            }]
                        };
                        var ctx = document.getElementById("lineChartFLowRate").getContext("2d");
                        lineChartFLowRate = new Chart(ctx, {
                            type: 'line',
                            data: data,
                            options: {
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            min: 0,
                                            //max: 100,
                                            //stepSize: 10,
                                            beginAtZero: true
                                        }
                                    }]

                                }
                            }
                        });
                    }
                    //filling up the data and keep pushing it
                    // console.log("the lenght of allSamples is: ",allSamples.length);
                    for (var i = allSamples.length - 1; i >= 0; i--) {

                        var val = allSamples[i];
                        dataC.push((val.rate * 1000).toFixed(4));
                        total += val.rate;
                        labels.push('');
                        //console.log("flowRate Info", val.rate, new Date(val.created_on).toISOString());
                    }

                    lineChartFLowRate.data.labels = labels;
                    lineChartFLowRate.data.datasets[0].data = dataC;
                    lineChartFLowRate.update();
                    // console.log("The new data array is ",dataC)

                    //Session.set('totalFlowRate', data[data.length - 1][1]);
                }

            }
        }
    });


    var handleInfoQuery = Info.find({
        "key": "leakDetected"
    }).observeChanges({
        changed: function(id, fields) {
            console.log(fields);
            FlashMessages.clear();
            if (fields.value == 1) {
                FlashMessages.sendWarning(["There is a litte leak"]);
            } else if (fields.value == 2) {
                FlashMessages.sendError(["There is much leak"]);
            }
        }
    });

    initializing = false;
};
Template.dashboard3.helpers({
    getFlowRateClient: function() {
        return Session.get('totalFlowRate');
    },
    getFlowRateDaily: function() {
        var total = Info.findOne({
            "key": "dailyFlowRate"
        });
        if (total && total.value) {
            return (total.value * 1000).toFixed(0);
        } else {
            return "";
        }
    },
    getFlowRateMonthly: function() {
        var total = Info.findOne({
            "key": "monthlyFlowRate"
        });
        if (total && total.value) {
            return (total.value * 1000).toFixed(0);
        } else {
            return "";
        }
    },
    getFlowRateYearly: function() {
        var total = Info.findOne({
            "key": "yearlyFlowRate"
        });
        if (total && total.value) {
            return (total.value * 1000).toFixed(0);
        } else {
            return "";
        }
    },
    getLeakDetected: function() {
        return Session.get('leakDetected');
    },

    getCurrentFlow: function() {
        if (CurrentFlowRate.findOne() && CurrentFlowRate.findOne().rate) {
            return (CurrentFlowRate.findOne({}, {
                sort: {
                    created_on: -1
                }
            }).rate * 1000).toFixed(4);
        } else {
            return 0;
        }
    },
    getTem: function() {
        return Session.get('getTemp');
    },

});


Template.dashboard3.events = {
    'click .currentflow': function(evt) {
        evt.preventDefault();
        console.log('currentflow Button clicked');
        CurrentFlowRate.find().fetch();
    },
    'change #DateRange': (event)=>{

        // console.log(event.currentTarget.value);
        Session.set('selectedDateRange',event.currentTarget.value);
        switch(Session.get("selectedDateRange")){
            case '1': handleCurrentFlowRateQuery = CurrentFlowRate.find().observeChanges({
                added: function(id, fields) {
                    // console.log("added ", id, fields);
                    //console.log(lineChartFLowRate)
                    if (!initializing) {
                        var allSamples = CurrentFlowRate.find({}, {
                            limit:60,sort:{created_on:-1}
                        }).fetch();

                        var len = allSamples.length;
                        // console.log(len)
                        if (len == 60) {
                            var total = 0;
                            var dataC = [];
                            var labels = [];

                            if (!lineChartFLowRate) {

                                var data = {
                                    labels: labels,
                                    datasets: [{
                                        label: "FLow Rate (L/s)",
                                        fill: true,
                                        lineTension: 0.2,
                                        backgroundColor: "rgba(60,141,188,0.9)",
                                        borderColor: "rgba(60,141,188,0.9)",
                                        borderCapStyle: 'round',
                                        borderDash: [],
                                        borderDashOffset: 0.0,
                                        borderJoinStyle: 'miter',
                                        pointBorderColor: "rgba(60,141,188,0.9)",
                                        pointBackgroundColor: "rgba(60,141,188,0.9)",
                                        pointBorderWidth: 0,
                                        pointHoverRadius: 0,
                                        pointHoverBackgroundColor: "rgba(60,141,188,0.9)",
                                        pointHoverBorderColor: "rgba(60,141,188,0.9)",
                                        pointHoverBorderWidth: 0,
                                        pointRadius: 0,
                                        pointHitRadius: 0,
                                        data: dataC,
                                    }]
                                };
                                var ctx = document.getElementById("lineChartFLowRate").getContext("2d");
                                lineChartFLowRate = new Chart(ctx, {
                                    type: 'line',
                                    data: data,
                                    options: {
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    min: 0,
                                                    //max: 100,
                                                    //stepSize: 10,
                                                    beginAtZero: true
                                                }
                                            }]

                                        }
                                    }
                                });
                            }
                            //filling up the data and keep pushing it
                            // console.log("the lenght of allSamples is: ",allSamples.length);
                            for (var i = allSamples.length - 1; i >= 0; i--) {

                                var val = allSamples[i];
                                dataC.push((val.rate * 1000).toFixed(4));
                                total += val.rate;
                                labels.push('');
                                //console.log("flowRate Info", val.rate, new Date(val.created_on).toISOString());
                            }

                            lineChartFLowRate.data.labels = labels;
                            lineChartFLowRate.data.datasets[0].data = dataC;

                            lineChartFLowRate.update();

                            // console.log("The new data array is ",dataC)

                            //Session.set('totalFlowRate', data[data.length - 1][1]);
                        }

                    }
                }
            });
                break;
            case '7': console.log("switch statement's value 7");
                console.log(lineChartFLowRate);
                //destroying the old chart
                handleCurrentFlowRateQuery.stop();
                lineChartFLowRate.clear();
               // lineChartFLowRate.destroy();


                // lineChartFLowRate.data.datasets[0].data = [];
                // lineChartFLowRate.update();

                break;
            default: break;
        }

    }

};

Template.dashboard3.destroyed = function() {

    // Remove extra view class
    $('body').removeClass('light-navbar');
    $('#page-wrapper').removeClass('sidebar-content');
};


// //Testing purpose
// Tracker.autorun(()=>{
//     console.log("Current Selected Range autorun is "+Session.get("selectedDateRange"));
//     //we can redraw the new graph and destroy the old one depending upong the value in the drop down list
// })