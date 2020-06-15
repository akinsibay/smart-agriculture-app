import React, { Component } from "react";
import { Container, Row, Col, Table } from "reactstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "../style/SahaIzleme.css";
import "../style/Genel.css";

export default class SahaIzleme extends Component {
  state = {
    sahaAdi: "",
    propAdi: "",
    sahaModalOpen: false,
    tablo: [
      {
        sahaAdi: "Çilek",
        prop: [
          { propAdi: "Prop1", propParametre: "Ph", propValue: "6.4" },
          { propAdi: "Prop2", propParametre: "EC", propValue: "1.57" },
          { propAdi: "Prop3", propParametre: "Nem", propValue: "55" },
          { propAdi: "Prop4", propParametre: "Sıcaklık", propValue: "27" },
          { propAdi: "Prop5", propParametre: "Debi", propValue: "4" },
        ],
      },
      {
        sahaAdi: "Domates",
        prop: [
          { propAdi: "Prop1", propParametre: "Ph", propValue: "4.8" },
          { propAdi: "Prop2", propParametre: "EC", propValue: "2.4" },
          { propAdi: "Prop3", propParametre: "Nem", propValue: "69" },
          { propAdi: "Prop4", propParametre: "Sıcaklık", propValue: "27" },
          { propAdi: "Prop5", propParametre: "Debi", propValue: "4" },
        ],
      },
      {
        sahaAdi: "Biber",
        prop: [
          { propAdi: "Prop1", propParametre: "Ph", propValue: "4.44" },
          { propAdi: "Prop2", propParametre: "EC", propValue: "1.59" },
          { propAdi: "Prop3", propParametre: "Nem", propValue: "54" },
          { propAdi: "Prop4", propParametre: "Sıcaklık", propValue: "27" },
          { propAdi: "Prop5", propParametre: "Debi", propValue: "4" },
        ],
      },
      {
        sahaAdi: "Salatalık",
        prop: [
          { propAdi: "Prop1", propParametre: "Ph", propValue: "5.18" },
          { propAdi: "Prop2", propParametre: "EC", propValue: "1.77" },
          { propAdi: "Prop3", propParametre: "Nem", propValue: "75" },
          { propAdi: "Prop4", propParametre: "Sıcaklık", propValue: "27" },
          { propAdi: "Prop5", propParametre: "Debi", propValue: "4" },
        ],
      },
      {
        sahaAdi: "Karpuz",
        prop: [
          { propAdi: "Prop1", propParametre: "Ph", propValue: "4.38" },
          { propAdi: "Prop2", propParametre: "EC", propValue: "2.57" },
          { propAdi: "Prop3", propParametre: "Nem", propValue: "59" },
          { propAdi: "Prop4", propParametre: "Sıcaklık", propValue: "27" },
          { propAdi: "Prop5", propParametre: "Debi", propValue: "4" },
        ],
      },
      {
        sahaAdi: "Çilek",
        prop: [
          { propAdi: "Prop1", propParametre: "Ph", propValue: "4.38" },
          { propAdi: "Prop2", propParametre: "EC", propValue: "1.51" },
          { propAdi: "Prop3", propParametre: "Nem", propValue: "52" },
          { propAdi: "Prop4", propParametre: "Sıcaklık", propValue: "27" },
          { propAdi: "Prop5", propParametre: "Debi", propValue: "4" },
        ],
      },
    ],
  };


  render() {
    return (
      <div className="bgColor">
        <Container>
          <Row>
            {this.state.tablo.map((item) => (
              <Col xs={12} md={6} lg={4}>
                <Table className="sahaTable" dark>
                  <thead>
                    <tr>
                      <th colSpan="3">{item.sahaAdi}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.prop.map((prop) => (
                      <tr>
                        <td>{prop.propAdi}</td>
                        <td>{prop.propParametre}</td>
                        <td>
                          <div style={{width:'100px',height:'60px'}}>
                            <CircularProgressbar
                            value={prop.propValue}
                            maxValue={prop.propParametre === 'Ph' ? 14 : ('EC' ? 5 : 100)}
                            text={`${prop.propValue}`}
                            circleRatio={0.5}
                            styles={buildStyles({
                              //   strokeLinecap: "butt", //kenarlar oval veya düz
                              trailColor: "#eee", //boş kalan kısım rengi #3E98C7
                              rotation:1/2+1/4,
                              textSize:'36px',
                              pathColor:
                                prop.propValue > (prop.propParametre === 'Ph' ? 10 : ('EC' ? 4.7 : 90))
                                  ? "red"
                                  : prop.propValue < (prop.propParametre === 'Ph' ? 3.5 : ('EC' ? 2 : 60))
                                  ? "#2ecc71"
                                  : "orange",
                              textColor:
                                prop.propValue > (prop.propParametre === 'Ph' ? 10 : ('EC' ? 4.7 : 90))
                                  ? "red"
                                  : prop.propValue < (prop.propParametre === 'Ph' ? 3.5 : ('EC' ? 2 : 60))
                                  ? "#2ecc71"
                                  : "orange",
                            })}
                          />        
                          </div>
                                            
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    );
  }
}
