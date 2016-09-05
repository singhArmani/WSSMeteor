import React from 'react';


export default class LeakRule extends React.Component {
    //E6 new style

    constructor(props){
        super(props);
        this.state = {amountOfWater:'',timePeriod:'', action:'turn off water immediate', error:false};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this._onBack = this._onBack.bind(this);
        this.validateInput = this.validateInput.bind(this);

    }
    
    handleSubmit(event){
        event.preventDefault();

        //update the form values here
        var formData = {amountOfWater:this.state.amountOfWater,
                        timePeriod:this.state.timePeriod,
                        action:this.state.action};

        if(this.validateInput()) this.props.updateFormData(formData); //submitting the form after full validation
    }

    validateInput(){

        //defining the type of error depending upon the field being not filled
        if(this.state.amountOfWater === ''){
            this.setState({error:'Please Enter Amount of Water!'});
        }else if(this.state.timePeriod === ''){
            this.setState({error:'Please Enter a time range!'});
        }else {
            this.setState({error:false});
            return true;
        }
    }
    
    handleChange(event,attribute){
        var newState = this.state; //grabbing the intial value of state here
        newState[attribute] = event.target.value; //putting the new changed value into respective attribute
        this.setState(newState); //setting this as new state
    }

    _onSelect(value){
        console.log('You selected', value);
        this.setState({action:value})
    }


    //Render Error
    renderError(){
        if(this.state.error){
            return (
                <div className="alert alert-danger">
                    {this.state.error}
                </div>
            );
        }
    }

    //label For leaktype
    getLabel(){
        var leakInfo= {};
        if (this.props.leaktype==='Standard Leak'){
            leakInfo.label ='Amount of Water';
            leakInfo.placeholder = 'Amount of Water in lts'
        }else{
            leakInfo.label ='Flow rate';
            leakInfo.placeholder = 'Flow rate in lt/min'
        }
        return leakInfo;
    }
    _onBack(event){
        event.preventDefault();
        console.log('back button hit..going one step back ');

        this.props.oneStepBack();
    }

    
    render(){
        var errorMessage = this.renderError();

        var leakInfo = this.getLabel();

        return (
            <div className="well clearfix">
                <h3 className="lead">Please Enter your LeakRule for {this.props.leaktype}</h3>
                {errorMessage}
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                           <label>{leakInfo.label}</label>
                            <input type="text"  className="form-control" placeholder={leakInfo.placeholder} value={this.state.amountOfWater} onChange={(event) => this.handleChange(event,'amountOfWater')}/>
                        </div>

                        <div className="form-group">
                            <label>Time Range: </label>
                            <input type="text" className="form-control" placeholder="Enter time in seconds" value={this.state.timePeriod} onChange={(event) => this.handleChange(event,'timePeriod')}/>
                        </div>

                        <div className="form-group">
                            <label>Select Action:</label>
                            <select className="form-control" id="actionLeak" onChange={(event) => this._onSelect(event.target.value)}>
                                <option value="turn of water Immediate">Turn Off the Water Immediately</option>
                                <option value="delay it">Delay the Alarm</option>
                                <option value="send sms">Send SMS</option>
                                <option value="send email">Send Email</option>
                            </select>
                        </div>

                            <button className="btn btn-success pull-right " type="submit">Next</button>
                        <button className="btn btn-success pull-left" onClick={this._onBack} type="button">Back</button>
                    </form>

            </div>
        );
    }
}

