/**
 * Created by singh on 31/08/2016.
 */
Template.topNavigation.events({
    'click #logout':function(event){
        event.preventDefault();
        //logging user out
        Meteor.logout();
    }
});