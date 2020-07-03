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
import axios from 'axios'
import serverUrl from '../config/serverUrl'
export default class Servis extends Component {
  state = {
    loginInfo: {
      girilenID: "",
      girilenSifre: "",
      ID: "apra",
      sifre: "1234",
      loginSuccess: false,
    },
    valfler:[1,2,3],
    onValfler:[],
    pompaStatus:false
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
  activeBadgeJSX = (item) => {
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
  runningBadgeJSX = (item,status) => {
    return (
      <Badge
        key={item.id}
        color={status === 1 ? "success" : "warning"}
        style={{
          fontSize: "28px",
          marginLeft:'5px'
        }}
      >
        {status === 1 ? item.programAdi : "Çalışan Program Yok"}
      </Badge>       
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
      <div>
      <Container fluid={true}>
        <Row>
        <Table dark className="calisanProgramTable">
              <thead>
                <tr>
                  <th>Çalışan Programlar</th>
                </tr>           
              </thead>
              <tbody>             
                  <tr>
                    <td>
                    {this.props.runningPrograms.length === 0 ? this.runningBadgeJSX("",0) : this.props.runningPrograms.map(item=>this.runningBadgeJSX(item,1))}
                    </td>
                  </tr>
              </tbody>
            </Table>
        </Row>
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
                          ? this.activeBadgeJSX(item)
                          : ""
                      )}
                      {this.props.activeCards.length === 0 ? (<Badge className="badges" color="warning" >Seçili Program Yok</Badge>) : ""}
                    </td>
                    <td>
                    {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map(item=><Badge key={item.programID} color="info" className="badges">{Number((item.calismaSuresiSaat*60+item.calismaSuresiDakika+item.calismaSuresiSaniye/60)*item.tekrar).toFixed(1)+' dk'}</Badge>)}
                    </td>
                    <td>
                    {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map(item=><Badge key={item.programID} color="info" className="badges">..</Badge>)}  
                    </td>
                    <td>
                      {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map(item=><Badge key={item.programID} color="info" className="badges">{/*item.Valfler.valf+' '*/'Valf 2'}</Badge>)}
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
      </Container>
      
      
      <Container fluid={true}>         
        <Row>
          <Col>
            <Table dark className="servisTable">
              <tbody>
                {this.state.valfler.map(item=>
                  <tr key={item}>
                    <td key={item}>Valf</td>
                    <td key={item}>{item}</td>
                    <td key={item}><Badge color="success" style={{cursor:'pointer'}} onClick={()=>this.valfOn(item)}>AÇ</Badge></td>
                    <td key={item}><Badge color="danger" style={{cursor:'pointer'}} onClick={()=>this.valfOff(item)}>KAPAT</Badge></td>
                    <td key={item}><Badge color={this.state.onValfler.find(itm=>itm===item) ? "success" : "danger"} style={{width:'80%'}}>{"    "}</Badge></td>
                    
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
          <Table dark className="servisTable">
              <tbody>
                <tr>
                  <td>Pompa</td>
                  <td><Badge color="success" style={{cursor:'pointer'}} onClick={()=>this.pompaOn()}>AÇ</Badge></td>
                  <td><Badge color="danger" style={{cursor:'pointer'}} onClick={()=>this.pompaOff()}>KAPAT</Badge></td>
                  <td><Badge color={this.state.pompaStatus === true ? "success" : "danger"} style={{width:'80%'}}>{"  "}</Badge></td>
                </tr>
              </tbody>
            </Table>    
          </Col>
        </Row>
      </Container>
    </div>
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
    let that = this;   
    let url = serverUrl + '/manuelValfOn'
    var valfObject = {'valf':item}    
    let message = 'Çalışan program var. Bu işlemi yapamazsınız. Program durduktan sonra yeniden deneyin.'
    if(this.props.runningPrograms.length > 0){
      this.props.notification('',message,'error')
    }
    else{
      axios.post(url,valfObject)
          .then(function(res){
            let tempArray = that.state.onValfler   
            tempArray.push(item)
            that.setState({onValfler:tempArray})
          })
          .catch(function(error){
            that.props.notification('','Modbus bağlantı hatası','error')
          })
    }
  }
  valfOff(item){
    let that = this;   
    let url = serverUrl + '/manuelValfOff'
    var valfObject = {'valf':item} 
    let message = 'Çalışan program var. Bu işlemi yapamazsınız. Program durduktan sonra yeniden deneyin.'
    if(this.props.runningPrograms.length > 0){
      this.props.notification('',message,'error')
    }
    else{
      axios.post(url,valfObject)
          .then(function(res){
            let tempArray = that.state.onValfler
            tempArray = tempArray.filter(itm=>itm !== item)
            that.setState({onValfler:tempArray})
          })
          .catch(function(error){
            that.props.notification('','Modbus bağlantı hatası','error')
          })
    }
  }
  pompaOn(){
    let that = this;   
    let url = serverUrl + '/pompaOnOff'
    let pompaStatus = {'pompaStatus':1} 
    let message = 'Çalışan program var. Bu işlemi yapamazsınız. Program durduktan sonra yeniden deneyin.'
    if(this.props.runningPrograms.length > 0){
      this.props.notification('',message,'error')
    }
    else{
      axios.post(url,pompaStatus)
          .then(function(res){
            that.setState({pompaStatus:true})
          })
          .catch(function(error){
            that.props.notification('','Modbus bağlantı hatası','error')
          })
    }
  }
  pompaOff(){
    let that = this;   
    let url = serverUrl + '/pompaOnOff'
    let pompaStatus = {'pompaStatus':0} 
    let message = 'Çalışan program var. Bu işlemi yapamazsınız. Program durduktan sonra yeniden deneyin.'
    if(this.props.runningPrograms.length > 0){
      this.props.notification('',message,'error')
    }
    else{
      axios.post(url,pompaStatus)
          .then(function(res){
            that.setState({pompaStatus:false})
          })
          .catch(function(error){
            that.props.notification('','Modbus bağlantı hatası','error')
          })
    }
  }
  componentDidMount() {
    document.title = "APRA TARIM - Servis"
  }
  
  render() {
    return (
      <div className="bgImage">
        {/* {this.state.loginInfo.loginSuccess === true
          ? this.servisSayfa()
          : this.loginScreen()} */}
          {this.servisSayfa()}
      </div>
    );
  }
}
