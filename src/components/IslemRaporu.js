import axios from 'axios'
import React, { Component } from 'react'
import { Table,DatePicker  } from 'antd';
import {Button} from 'reactstrap'
import serverUrl from '../config/serverUrl'
export default class Rapor extends Component {
  state={
    data:[],
    baslangic:'',
    bitis:''
  }

  componentDidMount(){
    document.title = "APRA TARIM - Rapor"
    let that = this
    let url = serverUrl + '/islemRaporuCek'
    axios.post(url)
    .then(res=>{
      console.log(res.data)
      that.setState({data:res.data})
    })
    .catch(err=>console.log(err))
  }
  
  render() {
    const {data} = this.state
    const columns = [
    {
        title: 'İşlem',
        dataIndex: 'message',
        key: 'İşlem',
        width:'70%'
    },   
    {
        title: 'Zaman',
        dataIndex: 'Zaman',
        key: 'Zaman',
        width:'30%'
    },
    ];
    return (
        <div className="bgColor">
        <Table bordered={true} pagination={{ position: ['topRight', 'none'] }} dataSource={data} columns={columns} />
      </div>
    )
  }
}
