/**
 * Created by singh on 5/09/2016.
 */
import React from 'react'

export default class LeakTypeInfo extends React.Component{
    constructor(props){
        super(props);

        //setting up the initial state to standardLeak
        this.state = {leakType:'Standard Leak'};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        console.log("form submitted!");
        this.props.updateFormData(this.state);

    }

    handleChange(event){

        this.setState({leakType:event.target.value}); //setting a new state


    }

    render(){
        return (
            <div>
                <div className="col-md-6">
                    <h4 className="lead">Standard Leak</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Cras cursus nulla ex, malesuada sagittis dui tincidunt a.
                        Vivamus eget lorem ex. Donec suscipit nulla est,
                        quis lacinia urna venenatis vel. Etiam in ante vitae dui
                        blandit viverra non nec lacus. Nulla nec nisi turpis.
                        Integer ac ipsum eu turpis vestibulum molestie sagittis non urna.</p>
                </div>

                    <div className="row">
                        <div className="col-md-6 col-xs-6">
                            <img  src="images/graphs/StandardLeak.png" className="img-responsive img-thumbnail  hidden-xs" alt="Standard Leak"/>
                        </div>

                    </div>
                <hr/>

                <div className="col-md-6">
                    <h4 className="lead">Slow Leak</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Cras cursus nulla ex, malesuada sagittis dui tincidunt a.
                        Vivamus eget lorem ex. Donec suscipit nulla est,
                        quis lacinia urna venenatis vel. Etiam in ante vitae dui
                        blandit viverra non nec lacus. Nulla nec nisi turpis.
                        Integer ac ipsum eu turpis vestibulum molestie sagittis non urna.</p>
                </div>

                <div className="row">
                    <div className="col-md-6 col-xs-6">
                        <img  src="images/graphs/SlowLeak.png" className="img-responsive img-thumbnail  hidden-xs" alt="Standard Leak"/>
                    </div>

                </div>

                <h3 style={{color:'#1ab394'}}>Choose Type of leak you want to set the rule for</h3>
                <div className="row">
                    <div className="col-xs-12 well">
                    <form action="" onSubmit={this.handleSubmit}>
                        <div className="radio">
                            <label>
                                <input type="radio"
                                       value="Standard Leak"
                                       onChange={this.handleChange}
                                       checked={this.state.leakType === 'Standard Leak'}
                                />

                                Standard Leak
                            </label>
                        </div>

                        <div className="radio">
                            <label>
                                <input type="radio"
                                       value="Slow Leak"
                                       onChange ={this.handleChange}
                                       checked={this.state.leakType === 'Slow Leak'}
                                />
                                {/*<img src="../.././public/images/graphs/StandardLeak.png" alt="Standard Leak"/>*/}
                                Slow Leak
                            </label>
                        </div>
                        <button className="btn btn-success pull-right">
                            Next
                        </button>
                    </form>
                    </div>
                </div>
            </div>
        );
    }
}