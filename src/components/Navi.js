import React, { Component } from "react";
import { Menu } from "antd";
import {
  ExperimentOutlined,
  FileDoneOutlined,
  DashboardOutlined,
  ControlOutlined,
  SettingOutlined
} from "@ant-design/icons";
import '../style/Navi.css'
import {Link} from 'react-router-dom'
import logo from "../assets/apralogo.jpg";
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
    const imgStyle = {
      height:'%1',
      width:'%20'
    };
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
            <Link to='/calismaekrani'>Ana Sayfa</Link>        
          </Menu.Item>
          
          <Menu.Item/>
          
          <Menu.Item key="programlar" className="decoration">
            <DashboardOutlined style={{fontSize:'36px'}} />
            <Link to='/programlar'>Otomatik Sulama</Link>
          </Menu.Item>
          
          <Menu.Item/>

          {/* <Menu.Item key="saha"  className="decoration">
            <AreaChartOutlined style={{fontSize:'36px'}} />
            <Link to='/sahaizleme'>Saha İzleme</Link>
          </Menu.Item>
          
          <Menu.Item/>   */}

          <Menu.Item key="servis"  className="decoration">
           <ControlOutlined style={{fontSize:'36px'}}/>
            <Link to='/servis'>Manuel İşlemler</Link>
          </Menu.Item>

          <Menu.Item/>

          <Menu.Item key="rapor"  className="decoration">
           <FileDoneOutlined style={{fontSize:'36px'}}/>
            <Link to='/rapor'>Sulama Geçmişi</Link>
          </Menu.Item>
          <Menu.Item/>
          
          <Menu.Item key="ayarlar"  className="decoration">
           <SettingOutlined style={{fontSize:'36px'}}/>
            <Link to='/ayarlar'>Ayarlar</Link>
          </Menu.Item>

          <Menu.Item className="decoration" style={{float:'right'}}>
          {/* eslint-disable-next-line */}
          <a href="https://www.apradanismanlik.com" target="_blank"  rel="noopener" ><img src={logo} alt="alt" class="center" style={imgStyle} /></a>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
