import React from 'react';
import StandardLeak from './StandardLeak'
import SlowLeak from './SlowLeak'

export default class Confirmation extends React.Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this._onBack = this._onBack.bind(this);
    }
    handleSubmit(event){
        event.preventDefault();
        //getting all values
        var typeOfRule = this.props.data.leakType;
        var flowVariable = parseFloat(this.props.data.amountOfWater);
        console.log("flowVariable",flowVariable)
        var timeRange = parseFloat(this.props.data.timePeriod);
        var action = this.props.data.action;

        var myObj = this.props.data;

        var actionDetail ;     //constructing an object based on chosen action

        if(typeof myObj.delayFor!=="undefined"){

            actionDetail = Object.assign({},{actionStatement:action,delayFor:myObj.delayFor});
        }else if(typeof myObj.sendSMSTo!== "undefined"){

            actionDetail = Object.assign({},{actionStatement:action,sendSMSTo:myObj.sendSMSTo});
        }
        else if(typeof myObj.emailTo!=="undefined"){
            actionDetail = Object.assign({},{actionStatement:action,emailTo:myObj.emailTo});
        }
        else{
            actionDetail = Object.assign({},{actionStatement:action});
        }

        var dataForServer = Object.assign({}, {ruleType:typeOfRule, flow: flowVariable, timeFrame: timeRange, action: actionDetail});

        console.log("dataForServer",dataForServer)
        //calling the method and inserting into collection
        Meteor.call('setLeakRules', dataForServer, (err, result)=> {
            if (err) {
                FlashMessages.sendError(err.reason, {hideDelay: 500});
            } else {
                FlashMessages.sendSuccess('Successfully set the new leak Rule',{hideDelay:500});
            }
        })
        this.props.updateFormData(this.props.data);
    }

    _onBack(event){
        event.preventDefault();
        console.log('back button hit..going one step back ');

        this.props.oneStepBack();
    }

    _renderLeak(leak){
        if(leak==='Standard Leak') {
            return (
                <StandardLeak/>
            );
        }else{
            return (
                <SlowLeak/>
            );
        }
    }

    render(){

        let renderLeakType = this._renderLeak(this.props.data.leakType);
        return (
            <div>
                {renderLeakType}
                <div className="col-sm-6 well clearfix">
                <h3 className="lead">Are you sure you want to set up this new Leak Rule? </h3>
                    <form onSubmit ={this.handleSubmit}>
                        <div>
                            <label>Type of Rule</label>:{this.props.data.leakType}
                        </div><br/>

                        <div>
                            <label>{this.props.data.leakType=='Standard Leak' ? 'Amount of Water' : 'Flow Rate'}</label>:{this.props.data.amountOfWater}
                        </div><br/>

                        <div>
                            <label>Time Range</label>:{this.props.data.timePeriod}
                        </div><br/>

                        <div>
                            <label>Action to Take</label>:{this.props.data.action}
                        </div><br/>

                        <button className="btn btn-success pull-right" type="submit">Confirm</button>
                        <button className="btn btn-success pull-left" onClick={this._onBack}>Back</button>
                    </form>
            </div>
            </div>
        );
    }
}