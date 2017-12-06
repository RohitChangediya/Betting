import React from 'react';
import {  Alert} from 'reactstrap';

export default class AlertMsg extends React.Component {
  constructor(props) {
    super(props);
    this.onDismiss = this.onDismiss.bind(this);
  }
  onDismiss()
  {
    console.log(this.props.visible)
    this.props.onSubmit('No_Error')
  }
  render() {
    return (
      <Alert color="info" isOpen={this.props.visible} toggle={this.onDismiss}>
        {this.props.msg}
      </Alert>
    );
  }
}
