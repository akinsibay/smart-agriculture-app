import React, { Component } from "react";
import "../style/CalismaEkrani.css";
import "../style/Genel.css";
import { Icon } from 'react-icons-kit'
import {calendar} from 'react-icons-kit/fa/calendar'
import {lab} from 'react-icons-kit/icomoon/lab'
import {ic_schedule} from 'react-icons-kit/md/ic_schedule'
import {starFull} from 'react-icons-kit/icomoon/starFull'
import {cancelCircle} from 'react-icons-kit/icomoon/cancelCircle'
import {ic_check_circle} from 'react-icons-kit/md/ic_check_circle'
import {ic_help} from 'react-icons-kit/md/ic_help'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Container, Row, Col, Badge, Button, Table,Progress } from "reactstrap";
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
          {status === 1 ? (item.programAdi+' programı çalışıyor').toUpperCase() : "ÇALIŞAN PROGRAM YOK"}
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
    if(this.props.activeCards.length>0){
      axios.get(zurl)
      .then(res=>{
        that.props.notification('','Acil Durduruldu.','success')
        setTimeout(() => {
          window.location.reload() 
        }, 5000); 
      })
      .catch(err=>{
        that.props.notification('Modbus bağlantı hatası.Tekrar deneyiniz.')
      })
    }
    else{
      this.props.notification('','Aktif program yok. Tüm valf ve pompalar kapalı durumda.','error')
    }
  };

  kalanSure = ()=>{  
      return(
        <Badge color="info" className="badges">{this.props.programKalanSure}</Badge>               
      )                      
          
  }
  tablesJSX=()=>{
    const { ph, ec,tankSeviyesi,asitPompaStatus,gubrePompaStatus,anaSuValfi,sulamaValfi,sirkulasyonValfi,sulamaPompasi } = this.props.sahaVerileri;
    const {runningPrograms} = this.props;
    return(
      <Container fluid={true}>
        <Button color="danger" className="acilStop" onClick={this.acildurus}><Icon size={28} icon={cancelCircle}/> Acil Duruş</Button>
        {/* {runningPrograms.length > 0 ? runningPrograms.map((item,index)=>this.runningBadgeJSX(1,item,index)) : this.runningBadgeJSX(0,'',1)} */}
          <Row>
            <Col xs={12} lg={8} md={8} style={{ marginTop: "10px" }}>
              <Table dark className="sulamaProgrami">
                <thead>
                  <tr>
                    <th colSpan="5">SULAMA PROGRAMI</th>
                  </tr>
                </thead>
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
                          <th style={{width:'100%'}}><Icon size={32} icon={ic_schedule}/> Sulama Süresi</th>
                          <td>
                          {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map((item,index)=><Badge key={index} color="info" className="badges">{Number((item.calismaSuresiSaat*60+item.calismaSuresiDakika+item.calismaSuresiSaniye/60)*item.tekrar).toFixed(1)+' dk'}</Badge>)}
                          </td>
                          </tr> 

                          <tr> 
                          <th style={{width:'100%'}}><Icon size={32} icon={ic_help}/> İstenen</th>
                          <td>
                          {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map((item,index)=><Badge key={index} color="info" className="badges">{item.tekrar}</Badge>)}
                          </td>
                          </tr>

                          <tr>   
                          <th style={{width:'100%'}}><Icon size={32} icon={ic_check_circle}/> Yapılan</th>
                          <td>
                          {this.props.activeCards.length === 0 ? "" : this.props.programTekrar.map((item,index)=><Badge key={index} color="info" className="badges">{item.tekrarAdet}</Badge>)}
                          </td>                           
                          </tr>
                          

                          <tr> 
                          <th style={{width:'100%'}}></th>
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

            <Col xs={12} lg={4} md={4} style={{ marginTop: "10px" }}>
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
                            ec > 2000
                              ? "red"
                              : ec < 1000
                              ? "orange"
                              : "#2ecc71",
                          textColor:
                            ec > 2000
                              ? "red"
                              : ec < 1000
                              ? "orange"
                              : "#2ecc71",
                        })}
                      />                                           
                    </td>
                  </tr>
                  <tr>
                    <td className="tankSeviye">Tank Seviye</td>
                    <td>
                      <div className="progressDiv">%{tankSeviyesi}</div>
                      <Progress striped className="progress" value={tankSeviyesi} />
                      <Badge color="info" style={{fontSize:'24px',marginTop:'5px',width:'100%'}}>{Number((tankSeviyesi/100)*1200-120).toFixed(1)} litre</Badge>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
          <Col xs={12} lg={12} md={12} style={{ marginTop: "10px" }}>
            <Table dark className="suHazirlama">
                <thead>
                  <tr>
                    <th colSpan="6">VALF VE POMPA DURUMLARI</th>
                  </tr>
                </thead>
                <tr>
                  <th className="valfVePompa">Asit Pompası</th>
                  <th className="valfVePompa">Gübre Pompası</th>
                  <th className="valfVePompa">Ana Su Valfi</th>
                  <th className="valfVePompa">Sulama Valfi</th>
                  <th className="valfVePompa">Sirkülasyon Valfi</th>
                  <th className="valfVePompa">Sulama Pompası</th>
                </tr>
                <tbody>
                  <tr>              
                    <td>
                      <Badge color={asitPompaStatus === 0 ? 'danger' : (asitPompaStatus===1 ? 'warning' : 'success')} style={{fontSize:'2.5vh',borderRadius:'48px', width:'100%'}}>{asitPompaStatus === 0 ? 'KAPALI' : (asitPompaStatus===1 ? 'OTOMATİK' : 'AÇIK')}</Badge>
                    </td>
                    <td>
                      <Badge color={gubrePompaStatus === 0 ? 'danger' : (gubrePompaStatus===1 ? 'warning' : 'success')} style={{fontSize:'2.5vh',borderRadius:'48px',width:'100%'}}>{gubrePompaStatus === 0 ? 'KAPALI' : (gubrePompaStatus===1 ? 'OTOMATİK' : 'AÇIK')}</Badge>
                    </td>
                    <td>
                      <Badge color={anaSuValfi === false ? 'danger' :  'success'} style={{fontSize:'2.5vh',borderRadius:'48px',width:'100%'}}>{anaSuValfi === false ? 'KAPALI' :  'AÇIK'}</Badge>
                    </td>
                    <td>
                      <Badge color={sulamaValfi === false ? 'danger' :  'success'} style={{fontSize:'2.5vh',borderRadius:'48px',width:'100%'}}>{sulamaValfi === false ? 'KAPALI' :  'AÇIK'}</Badge>
                    </td>
                    <td>
                      <Badge color={sirkulasyonValfi === false ? 'danger' :  'success'} style={{fontSize:'2.5vh',borderRadius:'48px',width:'100%'}}>{sirkulasyonValfi === false ? 'KAPALI' :  'AÇIK'}</Badge>
                    </td>
                    <td>
                      <Badge color={sulamaPompasi === false ? 'danger' :  'success'} style={{fontSize:'2.5vh',borderRadius:'48px',width:'100%'}}>{sulamaPompasi === false ? 'KAPALI' :  'AÇIK'}</Badge>
                    </td>
                  </tr>                             
                </tbody>
              </Table>
            </Col>
          </Row>
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
