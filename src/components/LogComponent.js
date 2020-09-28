import React, { Component } from 'react'
import axios from 'axios'
import serverUrl from '../config/serverUrl'
import {Alert} from 'reactstrap'
export default class LogComponent extends Component {
  state={
    logState:{}
  }
    componentDidMount() {
      setInterval(() => {
        this.checkLog() 
      }, 1000);   
    }
    checkLog = () =>{
      let that = this;
      let url = serverUrl + '/logCek'
      axios.get(url)
      .then(res=>{
        console.log(res.data[0])
        that.setState({logState:res.data[0]})
      })
      .catch(err=>{
        console.log(err)})
    } 
    render() {
      const {islemKodu} = this.state.logState
        return (
          <div>
          <header style={{
            backgroundColor:Number(islemKodu) === 200 ? "#43a047"  : (Number(islemKodu) === 300 ? "#ff9800" : "#e53935") ,
            color:'white',padding:'10px',fontSize:'3vh',textAlign:'center'
          }}
          >
            {this.state.logState.message}
          </header>        
        </div>
        )
    }
}