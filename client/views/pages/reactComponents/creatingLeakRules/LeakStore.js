/**
 * Created by singh on 5/09/2016.
 */
import React from 'react';
import LeakRule from './LeakRule';
import Confirmation from './Confirmation';
import Success from './Sucess'

//new here
import LeakTypeInfo from './LeakTypeInfo'

export default class LeakStore extends React.Component{
    //E6 style
    constructor(props){
        super(props);

        //state
        this.state = {currentStep:1,formValues:{}};

        //updating form
        this.updateFormData = this.updateFormData.bind(this);

        //going one step back
        this.oneStepBack = this.oneStepBack.bind(this);

        this.setUpNewRule = this.setUpNewRule.bind(this);
    }

    updateFormData(formData){
        console.log("formData",formData)
        var formValues = Object.assign({},this.state.formValues,formData);
        console.log("formValues",formValues)
        this.setState({currentStep:this.state.currentStep+1,formValues:formValues});
    }

    oneStepBack(formData){

        this.setState({currentStep:this.state.currentStep-1});
    }

    setUpNewRule(){
        //bring to start again
        this.setState({currentStep:1});
    }

    render(){
        switch (this.state.currentStep){
            case 1:
                return <LeakTypeInfo updateFormData ={this.updateFormData}/>;
            case 2:
                return <LeakRule updateFormData ={this.updateFormData}
                                 oneStepBack = {this.oneStepBack}
                                 data = {this.state.formValues}
                />;
            case 3:

                return <Confirmation  data = {this.state.formValues}
                                      updateFormData ={this.updateFormData}
                                      oneStepBack = {this.oneStepBack}/>;
            case 4:
                return <Success data = {this.state.formValues} step = {this.setUpNewRule}/>;
            default:
                return <LeakStore updateFormData ={this.updateFormData} />;
        }
    }

}