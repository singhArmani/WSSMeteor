/**
 * Created by singh on 30/08/2016.
 */



import LeakStore from './reactComponents/creatingLeakRules/LeakStore.js';
import './admin.html';
import { Template } from 'meteor/templating'

Template.setLeakRules.events({
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
                FlashMessages.sendError(err.reason, {hideDelay: 500});
            } else {
                FlashMessages.sendSuccess('Successfully set the new leak Rule',{hideDelay:500});
            }
        })


    }
})


Template.showLeakRules.onCreated(function(){
    //subscribing to the leakRule publication
        var subscription = this.subscribe('leakRules');

});

Template.showLeakRules.helpers({
    getLeakRules:()=>LeakRuleCollection.find({}),
    getLeaKRulesCount:()=>LeakRuleCollection.find().count(),
});


Template.leakRule.events({
    'click .delete-rule': function(event){
        event.preventDefault();
        console.log(this._id);
        var documentId = this._id;
        LeakRuleCollection.remove({_id:documentId});
    }
});

//React Integration
Template.LeakStore.helpers({
    getLeakStore(){
        return LeakStore;
    }
});

Template.leakPopUp.onCreated(function(){
    var instance = this;
    instance.subscribe('stateInfo');
    instance.subscribe('leakDetectedHistory');
    instance.subscribe('leakRules');
    instance.subscribe('waterUsageState')
})

Template.leakPopUp.helpers({
    isLeakDetected:function() {
        console.log("the state is ", State.find({}).fetch()[0])
        return State.find({}).fetch()[0].leakDetected;
    },
    showModal(){
        let leakObjectHistory=  LeakDetectedHistory.find({},{
            sort:{leakTriggeredAt:-1},limit:1
        }).fetch()[0];

        //getting the leak rule type info which triggered the leak
        let leakRuleObject = LeakRuleCollection.find({_id:leakObjectHistory.leakRuleId}).fetch()[0];

        //getting the dataset for the graph
        let dateSinceWaterUsage = WaterUsageState.find({}).fetch()[0].createdAt;
        let value = CurrentFlowRate.find({"created_on":{$gte:dateSinceWaterUsage}}).fetch();
        console.log("graph values ",value);

        let leakObject = Object.assign({},{leakRuleObject:leakRuleObject,leakTriggeredAt:leakObjectHistory.leakTriggeredAt})

        Modal.show('leakModal',leakObject);
    }

})