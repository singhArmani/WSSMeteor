ManageController = RouteController.extend({
    subscriptions: function() {},
    waitOn: function() {

        var filter = {
            carrier: Session.get('manage_filterCarrier') ? Session.get('manage_filterCarrier') : undefined,
            lob: Session.get('manage_filterChannel') ? Session.get('manage_filterChannel') : undefined
        }

        //Meteor.subscribe('stores', filter, 9999);
        Meteor.subscribe('question_groups');
        Meteor.subscribe('visits');
        Meteor.subscribe('users');
        Meteor.subscribe('products');
    },
    data: function() {
        //return Stores.findOne({_id: this.params._id});
    },
    onRun: function() {
        this.next();
    },
    onRerun: function() {
        this.next();
    },
    onBeforeAction: function() {
        // if (!Roles.userIsInRole(Meteor.userId(), 'admin')) {
        //     console.log("no permission");
        //     Router.go('/');
        // }
        this.next();
    },
    action: function() {
        this.render();
    },
    onAfterAction: function() {},
    onStop: function() {}
});
