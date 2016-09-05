/**
 * Created by singh on 16/07/2016.
 */
import React from 'react';

export default class Success extends React.Component {
    render(){

        return (
            <div className="well">
                <p className="lead ">
                    <span className="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span> Your {this.props.data.leakType} rule has been stored successfully
                </p>
            </div>
        );
    }
}
