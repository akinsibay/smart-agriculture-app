import React, { Component } from "react";
import "../style/Genel.css";
import { Icon } from 'react-icons-kit'
import {lab} from 'react-icons-kit/icomoon/lab'
import {ic_schedule} from 'react-icons-kit/md/ic_schedule'
import axios from 'axios'
import { UserOutlined } from "@ant-design/icons";
import serverUrl from '../config/serverUrl'
import {
  Card,
  Col,
  Row,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
export default class Ayarlar extends Component {
  state = {
    loginInfo: {
      girilenID: "",
      girilenSifre: "",
      ID: "apra",
      sifre: "1234",
      loginSuccess: false,
    },
    parametreler:{
      phTolerans: "",
      ecTolerans:"",
      suAlmaSuresi: "",  
    }
    
  };
  login = () => {
    const { girilenID, girilenSifre, ID, sifre } = this.state.loginInfo;

    if (girilenID === ID && girilenSifre === sifre) {
      this.setState({ loginInfo: { loginSuccess: true } });
    }
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
  
  componentDidMount() {
    document.title = "APRA TARIM - Ayarlar";
    let that = this;
    let aurl = serverUrl + '/ayarlariCek'
    axios.get(aurl)
    .then(res=>{
      console.log(res.data)
        that.setState({parametreler:{
          ...that.state.parametreler,
          phTolerans:Number(res.data[0].phTolerans),
          ecTolerans:Number(res.data[0].ecTolerans),
          suAlmaSuresi:Number(res.data[0].suAlmaSuresi)
        }})
    })
    .catch(err=>{
        //that.alertifyNotification('Modbus bağlantı hatası. Tekrar deneyin.')
    })
  }
  handleParameterChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({parametreler:{
      ...this.state.parametreler,
      [name]: value
    }});
  };
  kaydet = (e) =>{
    e.preventDefault()
    const { phTolerans,ecTolerans, suAlmaSuresi } = this.state.parametreler;
    let toleransObj = {phTolerans,ecTolerans,suAlmaSuresi}
    let that = this;
    let url = serverUrl + '/ayarParametreleri'
    axios.post(url,toleransObj)
    .then(res=>{
      that.props.notification('','Ayarlar kaydedildi.','success')
    })
    .catch(err=>{
      that.props.notification('','Veritabanı hatası.Tekrar deneyiniz.','error')
    })
  }
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
  ayarlarSayfa = () =>{
    const { phTolerans, ecTolerans, suAlmaSuresi } = this.state.parametreler;
    return(
      <div>
        <Container fluid={true}>
          <Row>
            <Col xs={12} lg={12} md={12}>
              <Card style={{ padding: "25px", marginTop: "25px" }}>
                <Form>
                  <FormGroup row>
                    <Label for="phTolerans" style={{ fontSize: "2.8vh" }} xs={6}>
                    <Icon size={28} icon={lab}/> PH Toleransı
                    </Label>
                    <Col xs={6}>
                      <Input
                        type="number"
                        style={{ fontSize: "2.5vh" }}
                        name="phTolerans"
                        value={phTolerans}
                        placeholder="ph tölerans"
                        onChange={this.handleParameterChange}
                        required
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="ecTolerans" style={{ fontSize: "2.8vh" }} xs={6}>
                    <Icon size={28} icon={lab}/> EC Toleransı (µS)
                    </Label>
                    <Col xs={6}>
                      <Input
                        type="number"
                        style={{ fontSize: "2.5vh" }}
                        name="ecTolerans"
                        value={ecTolerans}
                        placeholder="ec tölerans"
                        onChange={this.handleParameterChange}
                        required
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label
                      for="suAlmaSuresi"
                      style={{ fontSize: "2.8vh" }}
                      xs={6}
                    >
                    <Icon size={28} icon={ic_schedule}/> Su Alma Süresi (s)
                    </Label>
                    <Col xs={6}>
                      <Input
                        type="number"
                        style={{ fontSize: "2.5vh" }}
                        name="suAlmaSuresi"
                        value={suAlmaSuresi}
                        placeholder="süre"
                        onChange={this.handleParameterChange}
                        required
                      />
                    </Col>
                  </FormGroup>
                  <Button type="submit" style={{float: 'right',fontSize:'2.5vh'}} color="info" onClick={(e)=>this.kaydet(e)}>Kaydet</Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  render() {
    return (
      <div className="bgColor">
        {this.state.loginInfo.loginSuccess === true
          ? this.ayarlarSayfa()
          : this.loginScreen()}
      </div>
    );
  }
}
