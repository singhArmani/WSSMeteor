/**
 * Created by singh on 30/08/2016.
 */



import setRuleByReact from './reactComponents/setLeakRuleReact.js';
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
    var templateInstance = this;
    //subscribing to the leakRule publication
        var subscription = templateInstance.subscribe('leakRules');

    //Autorun : for setting up the limits
    // templateInstance.autorun(function(computation){
    //
    //     //get the limit
    //     var limit = templateInstance.limit.get();
    //
    //
    //
    //     //if subscription is ready, set limit to new limit
    //     if(subscription.ready()){
    //         templateInstance.limit.set(limit);
    //     }else{
    //         console.log("subscription not ready yet..");
    //     }
    // });
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
Template.setLeakRuleReact.helpers({
    MySetRulesReact(){
        return setRuleByReact;
    }
});