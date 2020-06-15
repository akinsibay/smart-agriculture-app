import React, { Component } from "react";
import { Menu } from "antd";
import {
  ExperimentOutlined,
  SettingOutlined,
  AreaChartOutlined,
  DashboardOutlined,
  ControlOutlined
} from "@ant-design/icons";
import '../style/Navi.css'
import {Link} from 'react-router-dom'

export default class Navi extends Component {
  state = {
    current: '',
  };

  handleClick = (e) => {
    console.log("click ", e);
    this.setState({
      current: e.key,
    });
  };
  render() {
    return (
      <div>       
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
          theme="dark"
        >
          <Menu.Item key="mail"  className="decoration">
            <ExperimentOutlined style={{fontSize:'36px'}}/>
            <Link to='/calismaekrani'>Çalışma Ekranı</Link>        
          </Menu.Item>
          
          <Menu.Item/>
          
          <Menu.Item key="programlar" className="decoration">
            <DashboardOutlined style={{fontSize:'36px'}} />
            <Link to='/programlar'>Programlar</Link>
          </Menu.Item>
          
          <Menu.Item/>

          <Menu.Item key="saha"  className="decoration">
            <AreaChartOutlined style={{fontSize:'36px'}} />
            <Link to='/sahaizleme'>Saha İzleme</Link>
          </Menu.Item>
          
          <Menu.Item/>  

          <Menu.Item key="servis"  className="decoration">
           <ControlOutlined style={{fontSize:'36px'}}/>
            <Link to='/servis'>Servis</Link>
          </Menu.Item>

          <Menu.Item/>
          
          <Menu.Item key="ayarlar"  className="decoration">
           <SettingOutlined style={{fontSize:'36px'}}/>
            <Link to='/ayarlar'>Ayarlar</Link>
          </Menu.Item>

          <Menu.Item className="decoration" style={{float:'right'}}>
          APRA Mühendislik
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
