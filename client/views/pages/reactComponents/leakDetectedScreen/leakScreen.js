/**
 * Created by singh on 4/10/2016.
 */
import React from 'react';

export default class LeakScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {poppedOut:false}
        this.popout = this.popout.bind(this)
    }

    popout(){
        this.setState({poppedOut:true});
    }
    render(){
        return(<div>
                <Header/>
                <DetectedLeakInfo/>
            </div>
        );
    }
}