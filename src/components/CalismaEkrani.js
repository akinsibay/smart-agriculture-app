import React, { Component } from "react";
import "../style/CalismaEkrani.css";
import "../style/Genel.css";
import { Icon } from 'react-icons-kit'
// import {sun} from 'react-icons-kit/icomoon/sun'
// import {fire} from 'react-icons-kit/icomoon/fire'
import {lab} from 'react-icons-kit/icomoon/lab'
import {ic_schedule} from 'react-icons-kit/md/ic_schedule'
// import {ic_invert_colors} from 'react-icons-kit/md/ic_invert_colors'
import {starFull} from 'react-icons-kit/icomoon/starFull'
import {steam} from 'react-icons-kit/icomoon/steam'
import {cancelCircle} from 'react-icons-kit/icomoon/cancelCircle'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Container, Row, Col, Badge, Button, Table,Progress } from "reactstrap";
// import Thermometer from 'react-thermometer-ecotropy'
// import ReactSpeedometer from "react-d3-speedometer"
import alertify from 'alertifyjs'
import serverUrl from '../config/serverUrl'
import axios from 'axios'
export default class CalismaEkrani extends Component {

  activeProgramBadgeJSX = (item,index) => {
    return (
      <div>
       <Badge
        className="badges"
        key={index}
        color="success"
      >
      {item.programAdi}       
      </Badge>
      
      </div>        
    );
  };
  runningBadgeJSX = (status,item,index) => {
      return (
        <Badge
          key={index}
          color={status === 1 ? "success" : "warning"}
          style={{
            fontSize: "24px",
            marginLeft:'5px',
            marginTop:'5px',
            float:'right'
          }}
        >
          {status === 1 ? (item.programAdi+' çalışıyor').toUpperCase() : "ÇALIŞAN PROGRAM YOK"}
        </Badge>       
      );  
  };
  duraklat = () => {
    alert("duraklatıldı");
  };
  passiveProgram = (item) => {
    let title="PROGRAM PASİF ETME"
    let message=item.programAdi+' programını pasifleştiriyorsunuz.Program çalışıyorsa duracak.Emin misiniz?'
    
    alertify.confirm(title, message, 
                    ()=>this.props.passiveButton(item),
                    ()=>alertify.error('İşlem iptal edildi'))
  };
  acildurus = () => {
    let that = this;
    let zurl = serverUrl + '/acilStop'
    axios.get(zurl)
      .then(res=>{
        that.props.notification('','Acil Durduruldu','success')
      })
      .catch(err=>{
        that.props.notification('Modbus bağlantı hatası')
      })
  };

  kalanSure = ()=>{  
      return(
        <Badge color="info" className="badges">{this.props.programKalanSure}</Badge>               
      )                      
          
  }
  tablesJSX=()=>{
    const { ph, ec,tankSeviyesi } = this.props.sahaVerileri;
    const {runningPrograms} = this.props;
    return(
      <Container fluid={true}>
        <Button color="danger" className="acilStop" onClick={this.acildurus}><Icon size={28} icon={cancelCircle}/> Acil Duruş</Button>
        {runningPrograms.length > 0 ? runningPrograms.map((item,index)=>this.runningBadgeJSX(1,item,index)) : this.runningBadgeJSX(0,'',1)}
          <Row>
            <Col xs={12} lg={9} md={9} style={{ marginTop: "10px" }}>
              <Table dark className="sulamaProgrami">
                <thead>
                  <tr>
                    <th colSpan="5">SULAMA PROGRAMI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="sulamaProgramiUst">                 
                          <th style={{width:'25%'}}><Icon size={32} icon={starFull}/> Aktif Program</th>
                          <th style={{width:'25%'}}><Icon size={32} icon={ic_schedule}/> Sulama Süresi</th>
                          <th style={{width:'20%'}}><Icon size={32} icon={ic_schedule}/> Kalan Süre</th>
                          <th style={{width:'25%'}}><Icon size={32} icon={steam}/> Valf</th>
                          <th style={{width:'5%'}}></th>                                
                  </tr>
                  <tr>
                    <td>
                      {this.props.cards.map((item,index) =>
                        this.props.activeCards.find((itm) => itm.programID === item.id)
                          ? this.activeProgramBadgeJSX(item,index)
                          : ""
                      )}
                      {this.props.activeCards.length === 0 ? (<Badge className="badges" color="warning" >Seçili Program Yok</Badge>) : ""}
                    </td>
                    <td>
                    {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map((item,index)=><Badge key={index} color="info" className="badges">{Number((item.calismaSuresiSaat*60+item.calismaSuresiDakika+item.calismaSuresiSaniye/60)*item.tekrar).toFixed(1)+' dk'}</Badge>)}
                    </td>
                    <td>
                      {this.props.activeCards.length === 0 ? "" : this.kalanSure()}  
                    </td>
                    <td>
                      {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map((item,index)=><Badge key={index} color="info" className="badges">{/*item.Valfler.valf+' '*/'Valf 2'}</Badge>)}
                    </td>
                    <td>
                      {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map((item,index)=>
                      <Badge key={index} className="badges" style={{cursor:'pointer'}} onClick={()=>this.passiveProgram(item)}color="danger">X</Badge>)                                                                 
                      }
                    </td>
                  </tr>

                  {/* <tr className="sulamaProgramiUst">
                    <th colSpan="2"><Icon size={32} icon={lab}/> PH</th>
                    <th colSpan="2"><Icon size={32} icon={lab}/> EC</th>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="progressDiv">{ph}</div>
                      <Progress color={ph>11 ? "danger":(ph>9 ? "warning":"success")} className="progress" value={ph} max={14} />
                    </td>
                    <td colSpan="2">
                      <div className="progressDiv">{ec}</div>
                      <Progress color={ec>4.7 ? "danger":(ec>3.5 ? "warning":"success")} className="progress" value={ec} max={5} />
                    </td>
                  </tr> */}
                  
                  <tr>
                    
                  </tr>
                </tbody>
              </Table>
            </Col>

            <Col xs={12} lg={3} md={3} style={{ marginTop: "10px" }}>
            <Table dark className="suHazirlama">
                <thead>
                  <tr>
                    <th colSpan="2">SU HAZIRLAMA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="suHazirlamaUst">
                    <th><Icon size={32} icon={lab}/> PH</th>
                    <th><Icon size={32} icon={lab}/> EC</th>
                  </tr>
                  <tr>
                    <td>
                        <CircularProgressbar
                        value={ph}
                        maxValue={14}
                        text={`${ph}`}
                        background
                        backgroundPadding={6}
                        styles={buildStyles({
                          //   strokeLinecap: "butt", //kenarlar oval veya düz
                          trailColor: "#eee", //boş kalan kısım rengi #3E98C7
                          backgroundColor:'#4b6584',
                          textSize:'26px',
                          pathColor:
                            ph > 10
                              ? "red"
                              : ph < 7.5
                              ? "#2ecc71"
                              : "orange",
                          textColor:
                              ph > 10
                              ? "red"
                              : ph < 7.5
                              ? "#2ecc71"
                              : "orange",
                        })}
                      />                                          
                    </td>
                    <td>
                        <CircularProgressbar
                        value={ec}
                        maxValue={5}
                        text={`${ec}`}
                        background
                        backgroundPadding={6}
                        styles={buildStyles({
                          //   strokeLinecap: "butt", //kenarlar oval veya düz
                          trailColor: "#eee", //boş kalan kısım rengi #3E98C7
                          backgroundColor:'#4b6584',
                          textSize:'26px',
                          pathColor:
                            ec > 4.7
                              ? "red"
                              : ec < 3.5
                              ? "#2ecc71"
                              : "orange",
                          textColor:
                            ec > 4.7
                              ? "red"
                              : ec < 3.5
                              ? "#2ecc71"
                              : "orange",
                        })}
                      />                                           
                    </td>
                  </tr>
                  <tr>
                    <td className="tankSeviye">Tank Seviye</td>
                    <td>
                      <div className="progressDiv">%{tankSeviyesi}</div>
                      <Progress striped className="progress" value={tankSeviyesi} />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* <Row>
            <Col xs={12} md={12} lg={12} style={{ marginTop: "5px" }}>
            <Table dark className="sahaVerileri">
                <thead>
                  <tr>
                    <th colSpan="5">SAHA VERİLERİ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="sahaVerileriUst">
                    <th style={{width:'%24'}}><Icon size={32} icon={sun}/> Debi</th>
                    <th style={{width:'%24'}}><Icon size={32} icon={ic_invert_colors}/> Nem</th>
                    <th style={{width:'%4'}}><Icon size={32} icon={fire}/> Isı</th>
                    <th style={{width:'%24'}}><Icon size={32} icon={lab}/> PH</th>
                    <th style={{width:'%24'}}><Icon size={32} icon={lab}/> EC</th>
                  </tr>
                  <tr>
                      <td style={{width:'20%'}}>
                      <ReactSpeedometer
                            fluidWidth={true}
                            value={debi}
                            // segments={3}
                            customSegmentStops={[0,2,3,4,5]}
                            minValue={0}
                            maxValue={5}
                            needleColor="steelblue"
                            needleTransitionDuration={3000}
                            needleTransition="easeElastic"
                            textColor={'white'}
                            valueTextFontSize={'28px'}
                      />                                            
                    </td>
                    
                    <td style={{width:'20%'}}>
                      <ReactSpeedometer
                            fluidWidth={true}
                            value={nem}
                            // segments={3}
                            // customSegmentStops={[0,2,3,4,5]}
                            minValue={0}
                            maxValue={100}
                            needleColor="steelblue"
                            needleTransitionDuration={2000}
                            needleTransition="easeElastic"
                            textColor={'white'}
                            valueTextFontSize={'28px'}
                      />                                            
                    </td>
                    <td style={{width:'4%'}}>
                      {" "}
                      <Thermometer
                        theme="dark"
                        value={sicaklik}
                        max="50"
                        format="°C"
                        size="normal"
                        // height="150"
                      />
                    </td>
                    <td style={{width:'20%'}}>
                      <ReactSpeedometer
                            fluidWidth={true}
                            value={ph}
                            // segments={3}
                            // customSegmentStops={[0,2,3,4,5]}
                            minValue={0}
                            maxValue={14}                           
                            needleColor="steelblue"
                            needleTransitionDuration={3000}
                            needleTransition="easeElastic"
                            textColor={'white'}
                            valueTextFontSize={'28px'}
                          />                             
                    </td>
                    <td style={{width:'20%'}}>                     
                        <ReactSpeedometer
                          fluidWidth={true}
                          value={ec}
                          // segments={3}
                          customSegmentStops={[0,2,3,4,5]}
                          minValue={0}
                          maxValue={5}
                          needleColor="steelblue"
                          needleTransitionDuration={3000}
                          needleTransition="easeElastic"
                          textColor={'white'}
                          valueTextFontSize={'28px'}
                        />                                        
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>                   
          </Row> */}
        </Container>
    )
  }
  componentDidMount() {
    document.title = "APRA TARIM - Ana Sayfa"
  }
  
  render() {  
    return (
      <div className="bgImage">
         {this.tablesJSX()}
      </div>
    );
  }
}
