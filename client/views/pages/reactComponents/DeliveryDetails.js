import React from 'react';




export default class DeliveryDetails extends React.Component {
    //E6 new style

    constructor(props){
        super(props);
        this.state = {delivaryOption:'Primary'};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    handleSubmit(event){
        event.preventDefault();
        console.log("form submitted!");
        this.props.updateFormData(this.state); 

    }

    handleChange(event){

        this.setState({delivaryOption:event.target.value}); //setting a new state


    }

    render(){
        return (
            <div>
                <h1>Choose your Delivery Options Here.</h1>
                <div style={{width:200}}>
                    <form action="" onSubmit={this.handleSubmit}>
                        <div className="radio">
                            <label>
                                <input type="radio"
                                       value="Primary"
                                       onChange={this.handleChange}
                                        checked={this.state.delivaryOption === 'Primary'}
                                />
                                Pirmary--Next Day Delivery
                            </label>
                        </div>

                        <div className="radio">
                            <label>
                                <input type="radio"
                                       value="Normal"
                                       onChange ={this.handleChange}
                                       checked={this.state.delivaryOption === 'Normal'}
                                />
                                Normal -- 3-4 Days
                            </label>
                        </div>
                        <button className="btn btn-success">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}
