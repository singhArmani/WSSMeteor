/**
 * Created by singh on 16/07/2016.
 */
import React from 'react';

export default class Success extends React.Component {

    constructor(props){
        super(props);
        this.setUpNewRule = this.setUpNewRule.bind(this);
    }

    setUpNewRule(event){
        event.preventDefault();
        this.props.step(); //bringing to the initial stage
    }
    render(){

        return (
            <div className="well clearfix">
                <p className="lead ">
                    <span className="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span> Your {this.props.data.leakType} rule has been stored successfully
                </p>
                <a href="#" className="pull-left" onClick={this.setUpNewRule}>Set a New Rule </a>
            </div>
        );
    }
}
