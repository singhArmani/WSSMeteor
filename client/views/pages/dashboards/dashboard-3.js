lineChartFLowRate = null;
 myBarChart = null;
var initializing = true;

var handleCurrentFlowRateQuery = null;
Template.dashboard3.rendered = function() {
    Chart.defaults.global.animation.duration = 0;

    Meteor.subscribe('todayFlowRate');
    Meteor.subscribe('shareInfo');

    //Adding subscription for
     //TODO:Remove autopublish

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

                if (len ==60) {
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
            case '1':

                console.log("Yes I exist...",lineChartFLowRate);
                //console.log("....Drawing first time.... line chart....");

                //Clear the old bar graph
                if (myBarChart){
                    console.log(myBarChart)
                    myBarChart.data.datasets[0].data =[]; //empty the data
                    myBarChart.destroy();
                }

                var total = 0, dataLineChart = [], labelsLineChart = [];
                var allSamples = CurrentFlowRate.find({}, {limit:60,sort:{created_on:-1}}).fetch();
                console.log("all samples is..",allSamples)
                for (var i =  59; i >=0; i--) {

                    var val = allSamples[i];
                    console.log(val);
                    dataLineChart.push((val.rate * 1000).toFixed(4));
                    total += val.rate;
                    labelsLineChart.push('');
                }
                drawLineChart(labelsLineChart,dataLineChart);


                //lets handle the change of date now

                handleCurrentFlowRateQuery = CurrentFlowRate.find().observeChanges({
                added: function(id, fields) {
                        console.log(fields);

                            //Removing one item from the beginning
                            lineChartFLowRate.data.datasets[0].data.shift()


                            //adding one item from the end
                            lineChartFLowRate.data.datasets[0].data.push((fields.rate*1000).toFixed(4))

                            lineChartFLowRate.update();


                            //Session.set('totalFlowRate', data[data.length - 1][1]);



                }
            });
                break;
            case '7': console.log("switch statement's value 7");

                console.log(lineChartFLowRate);
                //stopping the live query
                handleCurrentFlowRateQuery.stop();

                // //clearing the old data
                // lineChartFLowRate.data.datasets[0].data=[];
                //
                // //clearing the canvas
                // lineChartFLowRate.clear();

                lineChartFLowRate.destroy()

                //step 1. Getting all the records 15 minutes ago
                var today = new Date();//present day

                var fifteenMinutesAgo = new Date(today.valueOf()-15*60*1000);
                console.log(fifteenMinutesAgo);

                //we will getting ten collection coz it's fifteen minutes ago(dev environ)
                var SamplesFiveteenMinutesAgo = MonthFlowRate.find({created_on:{$gte:fifteenMinutesAgo}}).fetch();

                console.log(SamplesFiveteenMinutesAgo);

                var dataC = []; //creating an empty data for the new chart
                var labels=[];
                SamplesFiveteenMinutesAgo.forEach((obj)=>{
                    dataC.push((obj.rate *1000).toFixed(4))
                    labels.push(moment((obj.created_on)).fromNow())
                });

                //updating the chart
                var barChartctx = document.getElementById("lineChartFLowRate").getContext("2d");
                //setting up the data
                var data = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Flow Rates",
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(12, 255, 222, 0.2)',
                                'rgba(183, 135, 232, 0.2)',
                                'rgba(49, 115, 85, 0.2)'


                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(12, 255, 222, 1)',
                                'rgba(183, 135, 232, 1)',
                                'rgba(49, 115, 85, 1)'
                            ],
                            borderWidth: 1,
                            data: dataC,
                        }
                    ]
                };

                myBarChart = new Chart(barChartctx,{
                    type:'bar',
                    data:data,
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:false
                                }
                            }]
                        }
                    }
                });
                // myBarChart = new Chart(barChart).Bar(data);

                // lineChartFLowRate.update()

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


function drawLineChart(labels,dataC){

    //preparing the data
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

    //getting the context
    var ctx = document.getElementById("lineChartFLowRate").getContext("2d");

    //Drawing the Chart
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