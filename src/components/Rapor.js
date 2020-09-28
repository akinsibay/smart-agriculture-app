import axios from 'axios'
import React, { Component } from 'react'
import { Table,DatePicker  } from 'antd';
import {Button} from 'reactstrap'
import { Link } from "react-router-dom";
import IslemRaporu from "./IslemRaporu";
import serverUrl from '../config/serverUrl'
export default class Rapor extends Component {
  state={
    data:[],
    baslangic:'',
    bitis:''
  }
  onChange= (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    this.setState({baslangic:dateString[0],bitis:dateString[1]})
  }
  
  onOk = (value) => {
    console.log('onOk: ',value);
  }
  componentDidMount(){
    document.title = "APRA TARIM - Rapor"
  }

  veriCek = () =>{
    let that = this
    let url = serverUrl + '/raporCek'
    let times = [that.state.baslangic,that.state.bitis]
    axios.post(url,times)
    .then(res=>{
      console.log(res.data)
      that.setState({data:res.data})
    })
    .catch(err=>console.log(err))
  }

  render() {
    const { RangePicker } = DatePicker;
    const {data} = this.state
    const columns = [
      {
        title: 'Sulama Zamanı',
        dataIndex: 'SulamaZamani',
        key: 'SulamaZamani',
        width:'35%'
      },
      {
        title: 'PH',
        dataIndex: 'PH',
        key: 'PH',
        width:'20%'
      },
      {
        title: 'EC (µS)',
        dataIndex: 'EC',
        key: 'EC',
        width:'20%'
      },
      {
        title: 'Tank Seviyesi (%)',
        dataIndex: 'TankSeviyesi',
        key: 'TankSeviyesi',
        width:'25%'
      },
    ];
    return (
      <div className="bgColor">
        <div style={{margin:'10px'}}>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          onChange={this.onChange}
          onOk={this.onOk}
        />
        <Button style={{marginLeft:'10px',fontSize:'2.3vh'}} color="warning" onClick={this.veriCek}>Rapor Getir</Button>
        </div>
        <Link to="/islemRaporu"><Button style={{marginLeft:'10px',fontSize:'2.3vh'}} color="warning">İşlem geçmişi için tıklayın</Button></Link>
  
        <Table bordered={true} pagination={{ position: ['topRight', 'none'] }} dataSource={data} columns={columns} />

      </div>
    )
  }
}
