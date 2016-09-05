/**
 * Created by singh on 5/09/2016.
 */
import React from 'react';
import BookList from './BookList';
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
    }

    updateFormData(formData){

        var formValues = Object.assign({},this.state.formValues,formData);
        this.setState({currentStep:this.state.currentStep+1,formValues:formValues});
    }

    oneStepBack(formData){

        this.setState({currentStep:this.state.currentStep-1});
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
                return <Success data = {this.state.formValues} />;
            default:
                return <BookList updateFormData ={this.updateFormData} />;
        }
    }

}