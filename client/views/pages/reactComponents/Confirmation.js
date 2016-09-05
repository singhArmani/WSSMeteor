import React from 'react';

export default class Confirmation extends React.Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleSubmit(event){
        event.preventDefault();
        this.props.updateFormData(this.props.data);
    }

    render(){
        return (
            <div>
                <h1>Are you sure you want to submit the data? </h1>
                    <form onSubmit ={this.handleSubmit}>
                        <div>
                            <strong>Full Name</strong>:{this.props.data.fullName}
                        </div><br/>

                        <div>g
                            <strong>Contact Number</strong>:{this.props.data.contactNumber}
                        </div><br/>

                        <div>
                            <strong>ShippingAddress</strong>:{this.props.data.shippingAddress}
                        </div><br/>

                        <div>
                            <strong>Selected Books</strong>:{this.props.data.selectedBooks.join(",")}
                        </div><br/>

                        <button className="btn btn-success">Place Order</button>
                    </form>
            </div>
        );
    }
}