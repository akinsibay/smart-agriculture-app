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
export default class Servis extends Component {
  state = {
    loginInfo: {
      girilenID: "",
      girilenSifre: "",
      ID: "apra",
      sifre: "1234",
      loginSuccess: false,
    },
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
      <Container>
        <Row>
          <Col>
            <Table dark className="servisTable">
              <tbody>
                <tr>
                  <td>Pompa 1</td>
                  <td>
                    <Badge color="success">RUN</Badge>
                  </td>
                  <td>
                    <Badge color="danger">STOP</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Pompa 2</td>
                  <td>
                    <Badge color="success">RUN</Badge>
                  </td>
                  <td>
                    <Badge color="danger">STOP</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Pompa 3</td>
                  <td>
                    <Badge color="success">RUN</Badge>
                  </td>
                  <td>
                    <Badge color="danger">STOP</Badge>
                  </td>
                </tr>
                <tr>
                  <td>EC Pompası</td>
                  <td>
                    <Badge color="success">RUN</Badge>
                  </td>
                  <td>
                    <Badge color="danger">STOP</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Asit Pompası</td>
                  <td>
                    <Badge color="success">RUN</Badge>
                  </td>
                  <td>
                    <Badge color="danger">STOP</Badge>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>

          <Col>
            <Table dark className="servisTable">
              <tbody>
                <tr>
                  <td>Valf</td>
                  <td>1</td>
                  <td>
                    <Badge color="success" className="durumBadge">
                      ON
                    </Badge>
                  </td>
                  <td>
                    <Badge color="danger" className="durumBadge">
                      OFF
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td>Valf</td>
                  <td>2</td>
                  <td>
                    <Badge color="success" className="durumBadge">
                      ON
                    </Badge>
                  </td>
                  <td>
                    <Badge color="danger" className="durumBadge">
                      OFF
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td>Valf</td>
                  <td>3</td>
                  <td>
                    <Badge color="success" className="durumBadge">
                      ON
                    </Badge>
                  </td>
                  <td>
                    <Badge color="danger" className="durumBadge">
                      OFF
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td>Valf</td>
                  <td>4</td>
                  <td>
                    <Badge color="success" className="durumBadge">
                      ON
                    </Badge>
                  </td>
                  <td>
                    <Badge color="danger" className="durumBadge">
                      OFF
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td>Valf</td>
                  <td>5</td>
                  <td>
                    <Badge color="success" className="durumBadge">
                      ON
                    </Badge>
                  </td>
                  <td>
                    <Badge color="danger" className="durumBadge">
                      OFF
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td>Valf</td>
                  <td>6</td>
                  <td>
                    <Badge color="success" className="durumBadge">
                      ON
                    </Badge>
                  </td>
                  <td>
                    <Badge color="danger" className="durumBadge">
                      OFF
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td>Valf</td>
                  <td>7</td>
                  <td>
                    <Badge color="success" className="durumBadge">
                      ON
                    </Badge>
                  </td>
                  <td>
                    <Badge color="danger" className="durumBadge">
                      OFF
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td>Valf</td>
                  <td>8</td>
                  <td>
                    <Badge color="success" className="durumBadge">
                      ON
                    </Badge>
                  </td>
                  <td>
                    <Badge color="danger" className="durumBadge">
                      OFF
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  };

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
