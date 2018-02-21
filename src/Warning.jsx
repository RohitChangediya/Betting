import React from 'react';
import './App.css';
import {Jumbotron, Container} from 'reactstrap'

export default class Warning extends React.Component{
  render(){

    return (<div>
      <Jumbotron style={{ 'textAlign': 'center','backgroundColor':'#262f4a'}} fluid>
      <Container>
      You do not seem to have Metamask extension installed. Please install from <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer"> metamask.io</a>
    </Container>
    </Jumbotron>
    </div>)
  }
}
