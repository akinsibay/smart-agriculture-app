import React, { Component } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { Switch } from "antd";
export default class test extends Component {
  state = {
    switchValue: false,
    switch1:false,
    valf1:false,valf2:false,valf3:false,valf4:false,valf5:false,valf6:false,valf7:false,valf8:false
  };
  onChangeSwitch = checked => {
    this.setState({ switchValue: checked });
    console.log("eventte");
  };
  testChange = (checked,event) =>{
    let name = event.target.name
    let value = checked
    this.setState({
      [name]: value
    });
  }
  test2Change = (event) =>{
    let name = event.target.name
    let value = event.target.checked
    this.setState({
      [name]: value
    });
  }
  render() {
    return (
      <div style={{width:'500px', height:'200px'}}>
        <ReactSpeedometer
          fluidWidth={true}
          value={4}
          // segments={3}
          customSegmentStops={[0, 2, 3, 4, 5]}
          minValue={0}
          maxValue={5}
          needleColor="steelblue"
          needleTransitionDuration={3000}
          needleTransition="easeElastic"
          textColor={"black"}
        />

        <ReactSpeedometer
          value={4}
          // segments={3}
          customSegmentStops={[0, 2, 3, 4, 5]}
          minValue={0}
          maxValue={5}
          needleColor="steelblue"
          needleTransitionDuration={3000}
          needleTransition="easeElastic"
          textColor={"black"}
        />
         
        <Switch onChange={this.onChangeSwitch}></Switch>
        <h3
          style={
            this.state.switchValue === true
              ? { color: "green" }
              : { color: "red" }
          }
        >
          {this.state.switchValue.toString()}
        </h3>
        <Switch name="switch1" onClick={this.testChange}></Switch>
        <div style={{width:"100px",height:"100px"}}><input style={{width:"100px",height:"100px"}} name="valf1" type="checkbox" onClick={this.test2Change}/></div>
        
        <input name="valf2" type="checkbox" onClick={this.test2Change}/>
        <input name="valf3" type="checkbox" onClick={this.test2Change}/>
        <input name="valf4" type="checkbox" onClick={this.test2Change}/>
        <input name="valf5" type="checkbox" onClick={this.test2Change}/>
        <input name="valf6" type="checkbox" onClick={this.test2Change}/>
        <input name="valf7" type="checkbox" onClick={this.test2Change}/>
        <input name="valf8" type="checkbox" onClick={this.test2Change}/>

      </div>
    );
  }
}
