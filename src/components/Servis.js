import React, { Component } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Badge,
  Form,
  FormGroup,
  Input,
} from "reactstrap";
import "../style/Servis.css";
import "../style/Login.css";
import "../style/Genel.css";
import { UserOutlined } from "@ant-design/icons";
import alertify from 'alertifyjs'
export default class Servis extends Component {
  state = {
    loginInfo: {
      girilenID: "",
      girilenSifre: "",
      ID: "apra",
      sifre: "1234",
      loginSuccess: false,
    },
    valfler:[1,2,3,4,5,6,7,8],
    pompalar:['Pompa 1','Pompa 2','Pompa 3','EC Pompası','Asit Pompası']
  };

  login = () => {
    const { girilenID, girilenSifre, ID, sifre } = this.state.loginInfo;

    if (girilenID === ID && girilenSifre === sifre) {
      this.setState({ loginInfo: { loginSuccess: true } });
    }
  };

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      loginInfo: {
        ...this.state.loginInfo,
        [name]: value,
      },
    });
  };
  badgeJSX = (item) => {
    return (
      <div>
       <Badge
        className="badges"
        key={item.id}
        color="success"
      >
      {item.programAdi}       
      </Badge>
      
      </div>        
    );
  };

  loginScreen = () => {
    const { girilenID, girilenSifre } = this.state.loginInfo;
    return (
      <Container className="box">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <Form >
              <UserOutlined style={{ fontSize: "96px", color: "white" }} />
              <FormGroup>
                <Input
                  style={{ fontSize: "20px" }}
                  name="girilenID"
                  value={girilenID}
                  id="exampleEmail"
                  placeholder="Kullanıcı Adı"
                  onChange={this.handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="password"
                  style={{ fontSize: "20px" }}
                  name="girilenSifre"
                  value={girilenSifre}
                  id="exampleEmail"
                  placeholder="Şifre"
                  onChange={this.handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Input type="submit" value="Giriş Yap" onClick={this.login} />
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  };

  servisSayfa = () => {
    return (
      <Container >
        <Row>
          <Col style={{marginTop:'15px'}}>
          <Table dark className="sulamaProgrami">
            <tbody>
                  <tr className="sulamaProgramiUst">                 
                    <th style={{width:'25%'}}> Aktif Program</th>
                    <th style={{width:'25%'}}> Sulama Süresi</th>
                    <th style={{width:'20%'}}> Kalan Süre</th>
                    <th style={{width:'25%'}}> Valf</th>
                    <th style={{width:'5%'}}></th>                                
                  </tr>
                  <tr>
                    <td>
                      {this.props.cards.map((item) =>
                        this.props.activeCards.find((itm) => itm.programID === item.id)
                          ? this.badgeJSX(item)
                          : ""
                      )}
                      {this.props.activeCards.length === 0 ? (<Badge className="badges" color="warning" >Seçili Program Yok</Badge>) : ""}
                    </td>
                    <td>
                    {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map(item=><Badge key={item.programID} color="info" className="badges">{item.calismaSuresiSaat+' sa '+item.calismaSuresiDakika+' dk '+item.calismaSuresiSaniye+' sn'}</Badge>)}
                    </td>
                    <td>
                    {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map(item=><Badge key={item.programID} color="info" className="badges">..</Badge>)}  
                    </td>
                    <td>
                      {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map(item=><Badge key={item.programID} color="info" className="badges">{item.Valfler.valf+' '}</Badge>)}
                    </td>
                    <td>
                      {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map(item=>
                      <Badge key={item.programID} className="badges" style={{cursor:'pointer'}} onClick={()=>this.passiveProgram(item)}color="danger">X</Badge>)                                                                 
                      }
                    </td>
                  </tr>
                </tbody>
       </Table>
          </Col>        
        </Row>      
        <Row>
          <Col>         
            <Table dark className="servisTable">
              <tbody>
                {this.state.pompalar.map(item=>
                  <tr key={item}>
                    <td key={item}>{item}</td>
                    <td key={item}><Badge color="success" style={{cursor:'pointer'}} onClick={()=>this.pompaOn(item)}>RUN</Badge></td>
                    <td key={item}><Badge color="danger" style={{cursor:'pointer'}} onClick={()=>this.pompaOff(item)}>STOP</Badge></td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>

          <Col>
            <Table dark className="servisTable">
              <tbody>
                {this.state.valfler.map(item=>
                  <tr key={item}>
                    <td key={item}>Valf</td>
                    <td key={item}>{item}</td>
                    <td key={item}><Badge color="success" style={{cursor:'pointer'}} onClick={()=>this.valfOn(item)}>ON</Badge></td>
                    <td key={item}><Badge color="danger" style={{cursor:'pointer'}} onClick={()=>this.valfOff(item)}>OFF</Badge></td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  };
  passiveProgram = (item) => {
    //alert(item.programAdi,"bitirildi");
    let title="PROGRAM PASİF ETME"
    let message=item.programAdi+' programını pasifleştiriyorsunuz.Program çalışıyorsa duracak.Emin misiniz?'
    
    alertify.confirm(title, message, 
                    ()=>this.props.passiveButton(item),
                    ()=>alertify.error('İşlem iptal edildi'))
  };

  valfOn(item){
    let title="VALF ON/OFF"
    let message='Aktif program var! Açtığınız valf programın çalışmasını etkileyebilir. İşlemi gerçekleştirmek istediğinize emin misiniz?'
    if(this.props.activeCards.length > 0){
      alertify.confirm(title, message, 
        ()=>alert('Valf On '+item),
        ()=>alertify.error('İşlem iptal edildi'))
    }
    else{
      alert('Valf On '+item)
    }
  }
  valfOff(item){
    let title="VALF ON/OFF"
    let message='Aktif program var! Kapattığınız valf programın çalışmasını etkileyebilir. İşlemi gerçekleştirmek istediğinize emin misiniz?'
    if(this.props.activeCards.length > 0){
      alertify.confirm(title, message, 
        ()=>alert('Valf Off '+item),
        ()=>alertify.error('İşlem iptal edildi'))
    }
    else{
      alert('Valf Off '+item)
    }
  }
  pompaOn(item){
    let title="POMPA ON/OFF"
    let message='Aktif program var! Açtığınız pompa programın çalışmasını etkileyebilir. İşlemi gerçekleştirmek istediğinize emin misiniz?'
    if(this.props.activeCards.length > 0){
      alertify.confirm(title, message, 
        ()=>alert(item+' ON'),
        ()=>alertify.error('İşlem iptal edildi'))
    }
    else{
      alert(item+' ON')
    }
  }
  pompaOff(item){
    let title="POMPA ON/OFF"
    let message='Aktif program var! Kapattığınız pompa programın çalışmasını etkileyebilir. İşlemi gerçekleştirmek istediğinize emin misiniz?'
    if(this.props.activeCards.length > 0){
      alertify.confirm(title, message, 
        ()=>alert(item+' OFF'),
        ()=>alertify.error('İşlem iptal edildi'))
    }
    else{
      alert(item+' OFF')
    }
  }
  render() {
    return (
      <div className="test">
        {this.state.loginInfo.loginSuccess === true
          ? this.servisSayfa()
          : this.loginScreen()}
      </div>
    );
  }
}
