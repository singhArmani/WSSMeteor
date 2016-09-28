/**
 * Created by singh on 29/09/2016.
 */
/**
 * Created by singh on 29/09/2016.
 */

import React from 'react';
import ReactDOM from 'react-dom'

export default class SlowLeak extends React.Component{
    render(){
        return (
            <div className="col-sm-6">

                <h4 className="lead">Slow Leak</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Cras cursus nulla ex, malesuada sagittis dui tincidunt a.
                    Vivamus eget lorem ex. Donec suscipit nulla est,
                    quis lacinia urna venenatis vel. Etiam in ante vitae dui
                    blandit viverra non nec lacus. Nulla nec nisi turpis.
                    Integer ac ipsum eu turpis vestibulum molestie sagittis non urna.</p>
                <img  src="images/graphs/SlowLeak.png" className="img-responsive img-thumbnail" alt="Slow Leak"/>

            </div>
        );
    }
}