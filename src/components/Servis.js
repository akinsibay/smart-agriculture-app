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
import { Icon } from 'react-icons-kit'
import {calendar} from 'react-icons-kit/fa/calendar'
import {ic_schedule} from 'react-icons-kit/md/ic_schedule'
// import {ic_invert_colors} from 'react-icons-kit/md/ic_invert_colors'
import {starFull} from 'react-icons-kit/icomoon/starFull'
import {steam} from 'react-icons-kit/icomoon/steam'
import {cancelCircle} from 'react-icons-kit/icomoon/cancelCircle'
import {ic_check_circle} from 'react-icons-kit/md/ic_check_circle'
import {ic_help} from 'react-icons-kit/md/ic_help'
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
    valfler:[{valfAdi:'Ana Su Valfi',valfNo:1},{valfAdi:'Sulama Valfi',valfNo:2},{valfAdi:'Sirkülasyon Valfi',valfNo:3}],
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
  activeProgramBadgeJSX = (item) => {
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
          fontSize: "3.5vh",
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
        {/* <Row style={{marginTop:'5px',width:'100%'}}>
        {this.props.runningPrograms.length === 0 ? this.runningBadgeJSX("",0) : this.props.runningPrograms.map(item=>this.runningBadgeJSX(item,1))}
        </Row> */}
        <Row>
          <Col style={{marginTop:'15px'}}>
          <Table dark className="sulamaProgrami">
                <tbody>
                <tr className="sulamaProgramiUst">                 
                          <tr>
                          <th style={{width:'100%'}}><Icon size={32} icon={starFull}/> Aktif Program</th>
                          <td>
                          {this.props.cards.map((item,index) =>
                            this.props.activeCards.find((itm) => itm.programID === item.id)
                              ? this.activeProgramBadgeJSX(item,index)
                              : ""
                          )}
                          {this.props.activeCards.length === 0 ? (<Badge className="badges" color="warning" >Seçili Program Yok</Badge>) : ""}
                          </td></tr>

                          <tr>  
                          <th style={{width:'75%'}}><Icon size={32} icon={ic_schedule}/> Başlama Saati</th>
                          <td>
                          {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map((item,index)=><Badge key={index} color="warning" className="badges">{item.baslamaSaat}</Badge>)}
                          </td>
                          </tr>

                          <tr>   
                          <th style={{width:'100%'}}><Icon size={32} icon={calendar}/> Sulama Günleri</th>
                          <td>
                          {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map((item,index)=><Badge key={index} color="info" className="badges">{String(item.Gunler.gun).toUpperCase()}</Badge>)}
                          </td>   
                          </tr>

                          <tr>  
                          <th style={{width:'75%'}}><Icon size={32} icon={ic_schedule}/> Sulama Süresi</th>
                          <td>
                          {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map((item,index)=><Badge key={index} color="info" className="badges">{Number((item.calismaSuresiSaat*60+item.calismaSuresiDakika+item.calismaSuresiSaniye/60)*item.tekrar).toFixed(1)+' dk'}</Badge>)}
                          </td>
                          </tr> 

                          <tr> 
                          <th style={{width:'75%'}}><Icon size={32} icon={ic_help}/> İstenen</th>
                          <td>
                          {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map((item,index)=><Badge key={index} color="info" className="badges">{item.tekrar}</Badge>)}
                          </td>
                          </tr>

                          <tr>   
                          <th style={{width:'75%'}}><Icon size={32} icon={ic_check_circle}/> Yapılan</th>
                          <td>
                          {this.props.activeCards.length === 0 ? "" : this.props.programTekrar.map((item,index)=><Badge key={index} color="info" className="badges">{item.tekrarAdet}</Badge>)}
                          </td>   
                          </tr>

                          <tr> 
                          <th style={{width:'75%'}}></th>
                          <td>
                          {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map((item,index)=>
                          <Badge key={index} className="badges" style={{cursor:'pointer'}} onClick={()=>this.passiveProgram(item)}color="danger">PASİF ET</Badge>)                                                                 
                          }
                          </td>
                          </tr> 
                  </tr>
                </tbody>
              </Table>
          </Col>        
        </Row>  
      </Container>

      <Container fluid={true}>
        <Badge color="info" className="badges" style={{fontSize:'3.5vh'}}>{'PH:'+this.props.sahaVerileri.ph}</Badge>
        <Badge color="info" className="badges" style={{fontSize:'3.5vh',marginLeft:'5px'}}>{'EC:'+this.props.sahaVerileri.ec}</Badge>                
        <Badge color={this.props.sahaVerileri.tankSeviyesi >=90 ? "danger":"info"} className="badges" style={{fontSize:'3.5vh',marginLeft:'5px'}}>{'Su Seviyesi: %'+this.props.sahaVerileri.tankSeviyesi}</Badge>                
      </Container>   

      <Container fluid={true}>         
        <Row>
          <Col>
            <Table dark className="servisTable">
              <tbody>
                {this.state.valfler.map(item=>
                  <tr style={{fontSize:'3.5vh'}} key={item}>
                    <td style={{width:'100%'}} key={item.valfNo}>{item.valfAdi}</td>
                    <td key={item.valfNo}><Badge color="success" style={{cursor:'pointer'}} onClick={()=>this.valfOn(item.valfNo)}>AÇ</Badge></td>
                    <td style={{float:'right'}} key={item.valfNo}><Badge color="danger" style={{cursor:'pointer'}} onClick={()=>this.valfOff(item.valfNo)}>KAPAT</Badge></td>
                    {/* <td key={item.valfNo}><Badge color={this.state.onValfler.find(itm=>itm===item.valfNo) ? "success" : "danger"} style={{width:'80%'}}>{"    "}</Badge></td> */}
                    
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
                <tr style={{fontSize:'3.5vh'}}>
                  <td style={{width:'100%'}}>Sulama Pompası</td>
                  <td><Badge color="success" style={{cursor:'pointer'}} onClick={()=>this.pompaOn()}>AÇ</Badge></td>
                  <td style={{float:'right'}}><Badge color="danger" style={{cursor:'pointer'}} onClick={()=>this.pompaOff()}>KAPAT</Badge></td>
                  {/* <td><Badge color={this.state.pompaStatus === true ? "success" : "danger"} style={{width:'80%'}}>{"  "}</Badge></td> */}
                </tr>
              </tbody>
            </Table>    
          </Col>
        </Row>

        <Row>
          <Col>
          <Table dark className="servisTable">
              <tbody>
                <tr style={{fontSize:'3.5vh'}}>
                  <td style={{width:'100%'}}>Asit Pompası</td>
                  <td><Badge color="success" style={{cursor:'pointer'}} onClick={()=>this.asitPompa(2)}>AÇ</Badge></td>
                  <td><Badge color="danger" style={{cursor:'pointer'}} onClick={()=>this.asitPompa(0)}>KAPAT</Badge></td>
                  <td style={{float:'right'}}><Badge color="warning" style={{cursor:'pointer'}} onClick={()=>this.asitPompa(1)}>OTO</Badge></td>
                </tr>
                <tr style={{fontSize:'3.5vh'}}>
                  <td style={{width:'100%'}}>Gübre Pompası</td>
                  <td><Badge color="success" style={{cursor:'pointer'}} onClick={()=>this.gubrePompa(2)}>AÇ</Badge></td>
                  <td><Badge color="danger" style={{cursor:'pointer'}} onClick={()=>this.gubrePompa(0)}>KAPAT</Badge></td>
                  <td style={{float:'right'}}><Badge color="warning" style={{cursor:'pointer'}} onClick={()=>this.gubrePompa(1)}>OTO</Badge></td>
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
    console.log(this.props.runningPrograms) 
    let message = 'Aktif program varken manuel işlemler yapamazsınız. Programı pasife alıp tekrar deneyin.'
    if(this.props.runningPrograms.length > 0){
      this.props.notification('',message,'error')
    }
    else{
      if(valfObject.valf === 1 && that.props.sahaVerileri.tankSeviyesi > 90){
        that.props.notification('','Ana tank dolu. Daha fazla su alamazsınız.','error')
      }
      else{
        axios.post(url,valfObject)
          .then(function(res){
            let tempArray = that.state.onValfler
            if(valfObject.valf === 1){             
              that.props.notification('','Ana su valfi açıldı.','info')
            }
            else if(valfObject.valf === 2){
              that.props.notification('','Sulama valfi açıldı.','info')
            }
            else{
              that.props.notification('','Sirkülasyon valfi açıldı.','info')
            }   
            tempArray.push(item)
            that.setState({onValfler:tempArray})
          })
          .catch(function(error){
            that.props.notification('','Modbus bağlantı hatası','error')
          })
      }
      
    }
  }
  valfOff(item){
    let that = this;   
    let url = serverUrl + '/manuelValfOff'
    var valfObject = {'valf':item}
    let message = 'Aktif program varken manuel işlemler yapamazsınız. Programı pasife alıp tekrar deneyin.'
    if(this.props.runningPrograms.length > 0){
      this.props.notification('',message,'error')
    }
    else{
      axios.post(url,valfObject)
          .then(function(res){
            let tempArray = that.state.onValfler
            if(valfObject.valf === 1){
              that.props.notification('','Ana su valfi kapatıldı.','info')
            }
            else if(valfObject.valf === 2){
              that.props.notification('','Sulama valfi kapatıldı.','info')
            }
            else{
              that.props.notification('','Sirkülasyon valfi kapatıldı.','info')
            }   
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
    let message = 'Aktif program varken manuel işlemler yapamazsınız. Programı pasife alıp tekrar deneyin.'
    if(this.props.runningPrograms.length > 0){
      this.props.notification('',message,'error')
    }
    else{
      axios.post(url,pompaStatus)
          .then(function(res){
            that.setState({pompaStatus:true})
            that.props.notification('','Sulama pompası açıldı.','info')
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
    let message = 'Aktif program varken manuel işlemler yapamazsınız. Programı pasife alıp tekrar deneyin.'
    if(this.props.runningPrograms.length > 0){
      this.props.notification('',message,'error')
    }
    else{
      axios.post(url,pompaStatus)
          .then(function(res){
            that.setState({pompaStatus:false})
            that.props.notification('','Sulama pompası kapatıldı.','info')
          })
          .catch(function(error){
            that.props.notification('','Modbus bağlantı hatası','error')
          })
    }
  }

  asitPompa(output){
    let that = this;   
    let url = serverUrl + '/asitPompasi'
    var outputObject = {'output':output} 
    let message = 'Aktif program varken manuel işlemler yapamazsınız. Programı pasife alıp tekrar deneyin.'
    if(this.props.runningPrograms.length > 0){
      this.props.notification('',message,'error')
    }
    else{
      axios.post(url,outputObject)
          .then(function(res){
            if(output===0){
              that.props.notification('','Asit pompası durduruldu.','info')
            }
            else if(output===1){
              that.props.notification('','Asit pompası otomatikte.','info')
            }
            else{
              that.props.notification('','Asit pompası açıldı.','info')
            }
          })
          .catch(function(error){
            that.props.notification('','Modbus bağlantı hatası','error')
          })
    }
    
  }
  gubrePompa(output){
    let that = this;   
    let url = serverUrl + '/gubrePompasi'
    var outputObject = {'output':output} 
    let message = 'Aktif program varken manuel işlemler yapamazsınız. Programı pasife alıp tekrar deneyin.'
    if(this.props.runningPrograms.length > 0){
      this.props.notification('',message,'error')
    }
    else{
      axios.post(url,outputObject)
          .then(function(res){
            if(output===0){
              that.props.notification('','Gübre pompası durduruldu.','info')
            }
            else if(output===1){
              that.props.notification('','Gübre pompası otomatikte.','info')
            }
            else{
              that.props.notification('','Gübre pompası açıldı.','info')
            }
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
        {this.state.loginInfo.loginSuccess === true
          ? this.servisSayfa()
          : this.loginScreen()}
          {/* {this.servisSayfa()} */}
      </div>
    );
  }
}
