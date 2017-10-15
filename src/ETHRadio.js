import React from 'react';
import { ListGroup, ListGroupItem , Table, Button, ButtonGroup} from 'reactstrap';



export default class ETHRadio extends React.Component{
  constructor(props)
  {
    super(props);
    this.handleChange=this.handleChange.bind(this);
    this.state={rSelected:'',
                eth:'primary',
                btc:'primary',
                metal:'primary'
                };
  }
  handleChange(rSelected)
  {
    this.setState({ rSelected });
    console.log(rSelected);
    this.props.onSubmit(rSelected);
  }
  render()
  {
    return(
      <Table bordered>

        <thead>
          <tr>
            <th>Select a coin</th>
            <th>Price</th>
            <th>Odds</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>

          <tr>
            <th scope="row"> <Button className="betlist" onClick={() => this.handleChange("ETH")} active={this.state.rSelected === "ETH"} type="radio">ETH</Button></th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row"> <Button className="betlist" onClick={() => this.handleChange("BTC")} active={this.state.rSelected === "BTC"} type="radio">BTC</Button></th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row"> <Button className="betlist" onClick={() => this.handleChange("METAL")} active={this.state.rSelected === "METAL"}>METAL</Button></th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>

        </tbody>

      </Table>
    );
  }
}
