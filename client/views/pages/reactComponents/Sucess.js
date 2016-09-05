/**
 * Created by singh on 16/07/2016.
 */
import React from 'react';

export default class Success extends React.Component {
    render(){
        var numberOfDays = "1 to 2";
        if(this.props.data.delivaryOption === 'Normal') numberOfDays = "3 to 4";

        return (
            <div>
                <h2>Thank you for Shopping with us {this.props.data.fullName}</h2>
                <h4>
                    You will soon get {this.props.data.selectedBooks.join(",")} at {this.props.data.shippingAddress} in approximately {numberOfDays} days;
                </h4>
            </div>
        );
    }
}
