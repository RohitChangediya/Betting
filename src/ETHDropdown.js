import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


export default class ETHDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {selectValue:'Choose Coin',
      dropdownOpen: false
    };
  }
  handleChange(event)
  {
    this.setState({selectValue:event.target.value})
    this.props.onSubmit(event.target.value);
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    return (
      <div>

      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} color="info" size="lg" value={this.state.selectValue} onChange={this.handleChange} >
        <DropdownToggle caret>
          {this.state.selectValue}
        </DropdownToggle>

        <DropdownMenu>
          <DropdownItem value="BTC" onClick={this.handleChange}>BTC</DropdownItem>
          <DropdownItem value="ETH" onClick={this.handleChange}>ETH</DropdownItem>
          <DropdownItem value="METAL" onClick={this.handleChange}>METAL</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      </div>
    );
  }
}
