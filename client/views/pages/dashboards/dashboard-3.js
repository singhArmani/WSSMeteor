

var lineChartFLowRate = null,
    myBarChart = null,
    total = 0,
    dataLineChart = [],
    labelsLineChart = [],
    allSamples =[];

//live queries
handleCurrentFlowRateQuery = null;
handlefifteenMinuteLiveQuery= null;


//to subscribe to the data while Template is created
Template.dashboard3.onCreated(function(){
    var instance = this;
    instance.subscribe('todayFlowRate'); //subscribing to the
    instance.subscribe('shareInfo');
    instance.subscribe('stateInfo');
    instance.subscribe('monthFlowRate');
    instance.subscribe('yearFlowRate');
    instance.subscribe('leakRules')


    instance.autorun((computation)=>{
        allSamples = CurrentFlowRate.find({},{ sort: {
            created_on: -1
        }}).fetch();
        console.log(allSamples.length);


        //when we have all subscription ready for last one minute.
        if(instance.subscriptionsReady() && allSamples.length==60){
            for (var i =  allSamples.length-1; i >=0; i--) {
                console.log('i m here...');

                        var val = allSamples[i];
                        dataLineChart.push((val.rate * 1000).toFixed(4));
                        total += val.rate;
                        labelsLineChart.push('');
                    }
                    Session.set('ReadyToDrawLiveGraph',true);
                    computation.stop();
        }else{
            Session.set('ReadyToDrawLiveGraph',false);
            console.log("subscription is not ready yet")}
    })
})


Template.dashboard3.rendered = function() {



    Chart.defaults.global.animation.duration = 0;


    //Adding subscription for
     //TODO:Remove autopublish

    //setting the default session variable
    Session.setDefault("selectedDateRange","1");

    $('body').addClass('light-navbar');
    $('#page-wrapper').addClass('sidebar-content');
    var heightWithoutNavbar = $("body > #wrapper").height() - 61;
    $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");


    //Drawing the chart once we have data ready
    drawLineChart(labelsLineChart,dataLineChart);


    //handling live chart by observing the added fields


    handleCurrentFlowRateQuery = CurrentFlowRate.find().observeChanges({
                added: (id, fields)=> {

                    //Removing one item from the beginning
                    lineChartFLowRate.data.datasets[0].data.shift()


                    //adding one item from the end
                    lineChartFLowRate.data.datasets[0].data.push((fields.rate * 1000).toFixed(4))

                    lineChartFLowRate.update();

                }

            })



    var handleInfoQuery = Info.find({
        "key": "leakDetected"
    }).observeChanges({
        changed: function(id, fields) {
            console.log(fields);
            FlashMessages.clear();
            if (fields.value == 1) {
               //call a server method to update the State collection
                Meteor.call('changeLeakStatus',true)

                //flash a message for the user
                FlashMessages.sendWarning(["There is a litte leak"]);
            } else if (fields.value == 2) {

                //call a server method
                Meteor.call('changeLeakStatus',true)

                //flash a message for the use
                FlashMessages.sendError(["There is much leak"]);
            }
            else{

            }
        }
    });

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
    getEnabledStatus: function() {

        return State.findOne({}).waterEnabled ? 'checked' : 'unchecked'

    },
    isGraphReady:()=>Session.get('ReadyToDrawLiveGraph')

});


Template.dashboard3.events = {
    'click .currentflow': function(evt) {
        evt.preventDefault();
        console.log('currentflow Button clicked');
        CurrentFlowRate.find().fetch();
    },
    'change #DateRange': (event)=>{

            event.preventDefault();
        // console.log(event.currentTarget.value);
        Session.set('selectedDateRange',event.currentTarget.value);
        switch(Session.get("selectedDateRange")) {
            case '1':

                //stopping the live query
                if (handlefifteenMinuteLiveQuery) handlefifteenMinuteLiveQuery.stop()



                //Clear the old bar graph
                if (myBarChart) {
                    myBarChart.data.datasets[0].data = []; //empty the data
                    myBarChart.destroy();
                }

                var total = 0, dataLineChart = [], labelsLineChart = [];
                var allSamples = CurrentFlowRate.find({},{ sort: {
                    created_on: -1
                }}).fetch();

                for (var i = 59; i >= 0; i--) {

                    var val = allSamples[i];
                    dataLineChart.push((val.rate * 1000).toFixed(4));
                    total += val.rate;
                    labelsLineChart.push('');
                }
                drawLineChart(labelsLineChart, dataLineChart);


                //lets handle the change of date now

                handleCurrentFlowRateQuery = CurrentFlowRate.find().observeChanges({
                    added: function (id, fields) {

                        //Removing one item from the beginning
                        lineChartFLowRate.data.datasets[0].data.shift()


                        //adding one item from the end
                        lineChartFLowRate.data.datasets[0].data.push((fields.rate * 1000).toFixed(4))

                        lineChartFLowRate.update();

                    }
                });
                break;
            case '7':
                console.log("switch statement's value 7");

                //stopping the live query
                handleCurrentFlowRateQuery.stop();

                //destroying old chart
               if(lineChartFLowRate) lineChartFLowRate.destroy()
                if(myBarChart) myBarChart.destroy()


                //step 1. Getting all the records 15 minutes ago
                var today = new Date();//present day

                var fifteenMinutesAgo = new Date(today.valueOf() - 15 * 60 * 1000);
                console.log(fifteenMinutesAgo);

                //we will getting ten collection coz it's fifteen minutes ago(dev environ)
                var SamplesFifteenMinutesAgo = MonthFlowRate.find({created_on: {$gte: fifteenMinutesAgo}}, {sort: {
                created_on: -1}}).fetch();


                var dataC = []; //creating an empty data for the new chart
                var labels = [];
                SamplesFifteenMinutesAgo.forEach((obj)=> {
                    dataC.push((obj.rate * 1000).toFixed(4))
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

                myBarChart = new Chart(barChartctx, {
                    type: 'bar',
                    data: data,
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: false
                                }
                            }]
                        }
                    }
                });


                // Handle live updates
                handlefifteenMinuteLiveQuery = MonthFlowRate.find().observeChanges({
                    added: (id, fields)=> {

                        //Removing one item from the beginning
                        myBarChart.data.datasets[0].data.shift()

                        //adding one item from the end
                        myBarChart.data.datasets[0].data.push((fields.rate * 1000).toFixed(4))

                        myBarChart.update();

                    }
                })

                break;
            case '30':

                //Clear the old bar graph
                if (myBarChart) {

                    myBarChart.data.datasets[0].data = []; //empty the data
                    myBarChart.destroy();
                }

                if(lineChartFLowRate){
                    lineChartFLowRate.data.datasets[0].data = [];
                    lineChartFLowRate.destroy()
                }

                //stopping the old live queries
                if (handleCurrentFlowRateQuery) {
                    handleCurrentFlowRateQuery.stop();
                }

                if(handlefifteenMinuteLiveQuery) handlefifteenMinuteLiveQuery.stop()


                //step 1. Getting all the records 5 hours ago
                today = new Date();//present day

                var fiveHoursAgo = new Date(today.valueOf() - 5 * 60 * 60 * 1000);
                console.log(fiveHoursAgo);

                //we will getting 5 docs coz it's 5 hours ago(dev environment)
                var SampleFiveHoursAgo = YearFlowRate.find({created_on: {$gte: fiveHoursAgo}},{ sort: {
                    created_on: -1
                }}).fetch();


                dataC = []; //creating an empty data for the new chart
                labels = [];
                console.log("sample 5 hours ago..",SampleFiveHoursAgo);
                SampleFiveHoursAgo.forEach((obj)=> {
                    dataC.push((obj.rate * 1000).toFixed(4))
                    labels.push(moment((obj.created_on)).fromNow())
                });

                //updating the chart
                barChartctx = document.getElementById("lineChartFLowRate").getContext("2d");

                //setting up the data
                data = {
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

                myBarChart = new Chart(barChartctx, {
                    type: 'bar',
                    data: data,
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: false
                                }
                            }]
                        }
                    }
                });
                break;

            default:
                break;
        }
    },
    'change #toggle-event': (event)=> {

        (event.currentTarget.checked) ? Meteor.call('enableWater',true) : Meteor.call('enableWater',false)
    },
    'click #setRuleBtn' :(event)=>{
        event.preventDefault();

        //grabbing the values from the input fields
         var flow = parseInt($('input[id=flow]').val());
         var time = parseInt($('input[id=time]').val());
         var action = $('#actionLeak').val();


            var dataForServer = Object.assign({}, {flow: flow, timeFrame: time, action: action});

            //calling the method
            Meteor.call('setLeakRules', dataForServer, (err, result)=> {
                if (err) {
                    FlashMessages.sendError(err.reason, {hideDelay: 2000});
                } else {
                    FlashMessages.sendSuccess('Successfully set the new leak Rule');
                }
            })


    },
}

Template.dashboard3.destroyed = function() {

    // Remove extra view class
    $('body').removeClass('light-navbar');
    $('#page-wrapper').removeClass('sidebar-content');
};




function drawLineChart(labels,dataC){

    //preparing the data
    var data = {
        labels: labels,
        datasets: [{
            label: "FLow Rate (L/s)",
            fill: false,
            lineTension: 0.2,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 1,
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