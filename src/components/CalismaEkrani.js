import React, { Component } from "react";
import "../style/CalismaEkrani.css";
import "../style/Genel.css";
import { Icon } from 'react-icons-kit'
import {sun} from 'react-icons-kit/icomoon/sun'
import {fire} from 'react-icons-kit/icomoon/fire'
import {lab} from 'react-icons-kit/icomoon/lab'
import {ic_schedule} from 'react-icons-kit/md/ic_schedule'
import {ic_invert_colors} from 'react-icons-kit/md/ic_invert_colors'
import {starFull} from 'react-icons-kit/icomoon/starFull'
import {steam} from 'react-icons-kit/icomoon/steam'
import {pause} from 'react-icons-kit/icomoon/pause'
import {stop} from 'react-icons-kit/icomoon/stop'
import {cancelCircle} from 'react-icons-kit/icomoon/cancelCircle'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Container, Row, Col, Badge, Button, Table,Progress } from "reactstrap";
import Thermometer from 'react-thermometer-ecotropy'
import ReactSpeedometer from "react-d3-speedometer"

export default class CalismaEkrani extends Component {
  badgeJSX = (item) => {
    return (
      <Badge
        className="badges"
        key={item.id}
        color="success"
      >
        {item.programAdi}
      </Badge>
    );
  };

  duraklat = () => {
    alert("duraklatıldı");
  };
  bitir = () => {
    alert("bitirildi");
  };
  acildurus = () => {
    alert("acil durduruldu");
  };
  render() {
    const { sicaklik, nem, ph, ec, debi } = this.props.sahaVerileri;
    return (
      <div className="bgColor">
        <Container fluid={true}>
          <Row>
            <Col xs={12} lg={9} md={9} style={{ marginTop: "20px" }}>
              <Table dark className="sulamaProgrami">
                <thead>
                  <tr>
                    <th colSpan="4">SULAMA PROGRAMI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="sulamaProgramiUst">
                    <th><Icon size={32} icon={starFull}/> Aktif Program</th>
                    <th><Icon size={32} icon={ic_schedule}/> Sulama Süresi</th>
                    <th><Icon size={32} icon={ic_schedule}/> Kalan Süre</th>
                    <th><Icon size={32} icon={steam}/> Valf</th>
                  </tr>
                  <tr>
                    <td>
                      {this.props.cards.map((item) =>
                        this.props.activeCards.find((itm) => itm.programID === item.id)
                          ? this.badgeJSX(item)
                          : ""
                      )}
                      {this.props.activeCards.length === 0 ? (<Badge className="badges" color="danger" >Seçili Program Yok</Badge>) : ""}
                    </td>
                    <td>
                    {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map(item=><Badge color="info" className="badges">{item.calismaSuresiSaat+' sa '+item.calismaSuresiDakika+' dk '+item.calismaSuresiSaniye+' sn'}</Badge>)}
                    </td>
                    <td>
                    {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map(item=><Badge color="info" className="badges">..</Badge>)}  
                    </td>
                    <td>
                      {this.props.activeCards.length === 0 ? "" : this.props.activeCards.map(item=><Badge color="info" className="badges">{item.Valfler.valf+' '}</Badge>)}
                    </td>
                  </tr>

                  <tr className="sulamaProgramiUst">
                    <th colSpan="2"><Icon size={32} icon={lab}/> PH</th>
                    <th colSpan="2"><Icon size={32} icon={lab}/> EC</th>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="progressDiv">{ph}</div>
                      <Progress striped color={ph>11 ? "danger":(ph>9 ? "warning":"success")} className="progress" value={ph} max={14} />
                    </td>
                    <td colSpan="2">
                      <div className="progressDiv">{ec}</div>
                      <Progress striped color={ec>4.7 ? "danger":(ec>3.5 ? "warning":"success")} className="progress" value={ec} max={5} />
                    </td>
                  </tr>
                  
                  <tr>
                    
                  </tr>
                </tbody>
              </Table>
            </Col>

            <Col xs={12} lg={3} md={3} style={{ marginTop: "20px" }}>
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
                          textSize:'30px',
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
                          textSize:'30px',
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
                      <div className="progressDiv">75%</div>
                      <Progress striped className="progress" value="75" />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          <Row>
            <Col xs={12} lg={10} md={10} style={{ marginTop: "5px" }}>
            <Table dark className="sahaVerileri">
                <thead>
                  <tr>
                    <th colSpan="5">SAHA VERİLERİ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="sahaVerileriUst">
                    <th><Icon size={32} icon={sun}/> Debi</th>
                    <th><Icon size={32} icon={ic_invert_colors}/> Nem</th>
                    <th><Icon size={32} icon={fire}/> Sıcaklık</th>
                    <th><Icon size={32} icon={lab}/> PH</th>
                    <th><Icon size={32} icon={lab}/> EC</th>
                  </tr>
                  <tr>
                    <td style={{width:'250px',height:'100px'}}>
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
                    <td style={{width:'250px',height:'100px'}}>
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
                    <td>
                      {" "}
                      <Thermometer
                        theme="dark"
                        value={sicaklik}
                        max="50"
                        format="°C"
                        size="normal"
                        height="150"
                      />
                    </td>
                    <td style={{width:'250px',height:'100px'}}>
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
                    <td style={{width:'250px',height:'100px'}}>                     
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

            <Col>
            <Button
                color="warning"
                style={{ fontSize: "32px", width: "100%",marginTop:'25px',boxShadow: "0 0 20px 5px rgba(0, 0, 0, .6)",textAlign:'left',borderRadius:'12px'}}
                onClick={this.duraklat}
              >
              <Icon size={32} icon={pause}/>
                {' '} Duraklat
              </Button>
              <Button               
                style={{ fontSize: "32px", width: "100%",marginTop:'15px',boxShadow: "0 0 20px 5px rgba(0, 0, 0, .6)",textAlign:'left',borderRadius:'12px'}}
                onClick={this.bitir}
              >
                <Icon size={32} icon={stop}/>
                {' '}
                Bitir
              </Button>
              <Button
                color="danger"
                style={{ fontSize: "32px",width: "100%",marginTop:'15px',boxShadow: "0 0 20px 5px rgba(0, 0, 0, .6)",textAlign:'left',borderRadius:'12px'}}
                onClick={this.acildurus}
              >
                <Icon size={32} icon={cancelCircle}/>
                {' '}
                Acil Duruş
              </Button>
            </Col>                    
          </Row>
        </Container>       
      </div>
    );
  }
}
