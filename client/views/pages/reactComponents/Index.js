/**
 * Created by singh on 12/09/2016.
 */
import React from 'react';

export default class Index extends React.Component{
    constructor(props){
        super(props);
        this.getRuleItems = this.getRuleItems.bind(this);
    }

    getRuleItems(){
            // Meteor.subscribe('leakRules');
        return {rulesItems:LeakRuleCollection.find().fetch()};
    }

    render(){
        return <RuleList items={this.getRuleItems} />
    }
}