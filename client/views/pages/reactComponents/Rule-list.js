/**
 * Created by singh on 12/09/2016.
 */
import React from 'react';
import Index from './Index';

export default class RuleList extends React.Component{
    constructor(props){
        super(props);
        this.state = {editing:null};
        this.renderItemOrEditField = this.renderItemOrEditField.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);

    }

    deleteItem(event,id){
        event.preventDefault();
        console.log(this._id);
        LeakRuleCollection.remove({_id:id});
    }

    toggleEditing(itemId){
        this.setState({editing:itemId});
    }

    renderItemOrEditField(item){
        let listStyle = {
            float:'right',
            fontSize:'10'

        }
        if(this.state.editing === item._id){
            //handle rendering here for editing fields here
        }else {
            return (<li onClick={this.toggleEditing(item._id)}
                        key = {item._id}
                        className="list-group-item">
                AmountFlow: {item.flow}, TimeRange: {item.timeFrame}, Action: {item.action.actionStatement}} <a href="#" className="delete-rule" onClick={this.deleteItem(event,item._id)} style={listStyle}>delete</a>
            </li>);
        }
    }

    render(){
       return (<ul className="list-group">
           {this.props.items.rulesItems.map((item)=>{
               return this.renderItemOrEditField(item);
           })}
           </ul>);
    }
}