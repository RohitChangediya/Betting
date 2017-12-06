import React from 'react';
import { Input } from 'reactstrap';

export default class Amount extends React.Component{
  constructor(props)
  {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event)
  {
    this.props.onValueSubmit(event.target.value);
  }
  render()
  {
    return(
        <Input placeholdername="Amount" type="number" step="0.01" defaultValue="0.1" max="1" min="0.1" id={this.props.field}  onChange={this.handleChange}/>
    );
  }
}
