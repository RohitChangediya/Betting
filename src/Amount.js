import React from 'react';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';

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
        <Input placeholdername="Amount" type="number" id={this.props.field} value={this.props.value} onChange={this.handleChange}/>
    );
  }
}
