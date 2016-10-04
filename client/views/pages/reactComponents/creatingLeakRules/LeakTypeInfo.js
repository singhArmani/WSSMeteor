/**
 * Created by singh on 5/09/2016.
 */
import React from 'react'
import StandardLeak from './StandardLeak'
import SlowLeak from './SlowLeak'

export default class LeakTypeInfo extends React.Component{
    constructor(props){
        super(props);

        //setting up the initial state to standardLeak
        this.state = {leakType:'Standard Leak'};
        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event,leak){
        event.preventDefault();
        console.log("event is fired",event);
        console.log(typeof leak);
        this.setState({leakType:leak});
        console.log(this.state);
       this.props.updateFormData({leakType:leak});

    }

    render(){
        return (
            <div>

                    <div>
                       <h3 className="lead"> Rules are used to help the system understand when there is a water leak in your house. There are two rule based methods to detecting leaks:</h3>
                        <h3 className="label" style={{color:'#1ab394'}}>Click to create a rule</h3>
                    </div>
                <div className="row">
                    <a href="#"  onClick={(event)=> this.handleClick(event,'Standard Leak')}>
                     <StandardLeak/>
                    </a>

                    <a href="#" onClick={(event)=> this.handleClick(event,'Slow Leak')}>
                        <SlowLeak/>
                    </a>
                </div>

            </div>
        );
    }
}