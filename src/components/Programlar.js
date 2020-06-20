import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Button,
  Col,
  Row,
  Container,
  ButtonGroup,
  Form,
  FormGroup,
  Label,
  Input,
  Badge,
  Table
} from "reactstrap";
import { Modal, Message } from "semantic-ui-react";
import { SettingOutlined } from "@ant-design/icons";
import svg from "../assets/unnamed.jpg";
import '../style/Programlar.css'
import alertify from 'alertifyjs'
export default class Programlar extends Component {
  state = {
    editModalOpen: false,
    addModalOpen: false,
    cardInfo:{
      id:"",
      programAdi: null,
      baslamaSaat:null,
      calismaSuresiSaat:0,
      calismaSuresiDakika:0,
      calismaSuresiSaniye:0,
      beklemeSuresiSaat:0,
      beklemeSuresiDakika:0,
      beklemeSuresiSaniye:0,
      tekrar:null,
      phSet:null,
      ecSet:null,
      valf1:null,valf2:null,valf3:null,valf4:null,valf5:null,valf6:null,valf7:null,valf8:null,
      pazartesi:null,sali:null,carsamba:null,persembe:null,cuma:null,cumartesi:null,pazar:null,
      suankiValfler:[],
      suankiGunler:[]
    },
  };

  showProgramInfo = (gelen) => {
    console.log(gelen);
    this.setState({cardInfo:{
      id:gelen.id,
      programAdi: gelen.programAdi,
      baslamaTarih:gelen.baslamaTarih,
      baslamaSaat:gelen.baslamaSaat,
      calismaSuresiSaat: gelen.calismaSuresiSaat ,
      calismaSuresiDakika: gelen.calismaSuresiDakika ,
      calismaSuresiSaniye: gelen.calismaSuresiSaniye,
      beklemeSuresiSaat: gelen.beklemeSuresiSaat,
      beklemeSuresiDakika: gelen.beklemeSuresiDakika,
      beklemeSuresiSaniye: gelen.beklemeSuresiSaniye,
      tekrar: gelen.tekrar,
      phSet: gelen.phSet,
      ecSet: gelen.ecSet,
      suankiValfler:gelen.Valfler !== null ? gelen.Valfler.valf : [],
      suankiGunler:gelen.Gunler !== null ? gelen.Gunler.gun : [],
    }});       
  };

  editHandleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({cardInfo:{
      ...this.state.cardInfo,
      [name]: value
    }});
  };

  addHandleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({cardInfo:{
      ...this.state.cardInfo,
      [name]: value
    }});
  };

  editModalOpen = () => this.setState({ editModalOpen: true });
  editModalClose = () => this.setState({ editModalOpen: false });
  addModalOpen = () => this.setState({ addModalOpen: true });
  addModalClose = () => this.setState({ addModalOpen: false });

  addProgramButton = () => {
    this.addModalOpen();
  };

  editProgramButton = (item) => {
    console.log(item)
    this.editModalOpen();
    this.showProgramInfo(item);
  };

  deleteProgramButton = (item)=>{
    let title="PROGRAM SİLME"
    let message=item.programAdi+' programını silmek istediğinize emin misiniz? \nDİKKAT! Bu işlem geri alınamaz!'
    
    alertify.confirm(title, message, 
                    ()=>this.props.deleteData(item),
                    ()=>alertify.error('İşlem iptal edildi'))
  }

  saveButton = () => {
    const {
      programAdi,
      baslamaSaat,
      calismaSuresiSaat,
      calismaSuresiDakika,
      calismaSuresiSaniye,
      beklemeSuresiSaat,
      beklemeSuresiDakika,
      beklemeSuresiSaniye,
      tekrar,
      phSet,
      ecSet,
      valf1,valf2,valf3,valf4,valf5,valf6,valf7,valf8,
      pazartesi,sali,carsamba,persembe,cuma,cumartesi,pazar    
    } = this.state.cardInfo;

    let newObject = {
      id: this.props.card.length + 1,
      programAdi: programAdi,
      baslamaSaat:  baslamaSaat,
      calismaSuresiSaat: calismaSuresiSaat,
      calismaSuresiDakika:  calismaSuresiDakika,
      calismaSuresiSaniye: calismaSuresiSaniye,
      beklemeSuresiSaat: beklemeSuresiSaat,
      beklemeSuresiDakika: beklemeSuresiDakika,
      beklemeSuresiSaniye: beklemeSuresiSaniye,
      tekrar: tekrar,
      phSet: phSet,
      ecSet: ecSet,
      valf1,valf2,valf3,valf4,valf5,valf6,valf7,valf8,
      pazartesi,sali,carsamba,persembe,cuma,cumartesi,pazar
    };
    if(!valf1 && !valf2 && !valf3 && !valf4 && !valf5 && !valf6 && !valf7 && !valf8){
      this.props.notification('','Hiçbir valf seçmediniz!','error')
    }
    else if(!pazartesi && !sali && !carsamba && !persembe && !cuma && !cumartesi && !pazar){
      this.props.notification('','Hiçbir gün seçmediniz!','error')
    }
    else{
      this.props.addData(newObject); 
    }    
  };

  editProgram = ()=>{
    const {valf1,valf2,valf3,valf4,valf5,valf6,valf7,valf8,pazartesi,sali,carsamba,persembe,cuma,cumartesi,pazar} = this.state.cardInfo; 
  
    if(!valf1 && !valf2 && !valf3 && !valf4 && !valf5 && !valf6 && !valf7 && !valf8){
      this.props.notification('','Hiçbir valf seçmediniz!','error')
    }
    else if(!pazartesi && !sali && !carsamba && !persembe && !cuma && !cumartesi && !pazar){
      this.props.notification('','Hiçbir gün seçmediniz!','error')
    }
    else{
      this.props.editData(this.state.cardInfo)
    }  
  }

  badgeJSX = (item) => {
    return (
      <Badge
        key={item.id}
        color="success"
        style={{
          fontSize: "22px",
          marginLeft: "5px",
          float: "right",
        }}
      >
        {item.programAdi}
      </Badge>
    );
  };

  onChangeSwitch = (event) => {
    let name = event.target.name
    let value = event.target.checked
    this.setState({cardInfo:{
      ...this.state.cardInfo,
      [name]: value
    }});
  };
  

  render() {
    const {
      programAdi,
      baslamaSaat,
      calismaSuresiSaat,
      calismaSuresiDakika,
      calismaSuresiSaniye,
      beklemeSuresiSaat,
      beklemeSuresiDakika,
      beklemeSuresiSaniye,
      tekrar,
      phSet,
      ecSet,
      suankiValfler,
      suankiGunler,
    } = this.state.cardInfo;
    return (
      <div className="bgImage">
        {/* CARDS */}
        
        <Container fluid={true}>
          <Row>
            <Col xs={12} lg={2} md={2}>
              <Button
              color="warning"
              size="lg"
              onClick={this.addProgramButton}
              style={{ marginTop: "15px",width:'100%' }}
            >
            <SettingOutlined style={{ fontSize: "24px" }} />
             Yeni Program Ekle
            </Button>
            </Col>

            <Col xs={12} lg={10} md={10}>
            <Table dark className="calisanProgramTable">
              <tbody>             
                  <th>Çalışan Programlar</th>
                    <td>
                    {this.props.runningPrograms.length === 0 ? <Badge style={{fontSize:'22px',marginLeft:'5px',float:'right'}} color="warning" >Çalışan Program Yok</Badge> : this.props.runningPrograms.map(item=>this.badgeJSX(item))}
                    </td>
              </tbody>
            </Table>  
            </Col>
          </Row>
          <Row>
            {this.props.card.map((item) => (            
              <Col xs={12} lg={3} md={6} key={item.id}>
                <Card
                  key={item.id}
                  className="programlarCard"
                  style={{                 
                    opacity: this.props.activeCards.find(
                      (itm) => item.id === itm.programID
                    )
                      ? "1"
                      : "0.7",
                    backgroundColor: this.props.activeCards.find(
                      (itm) => item.id === itm.programID
                    )
                      ? "#4caf50"
                      : "#37474f",
                    borderRadius:'24px'
                  }}
                >
                  <CardImg
                    key={item.id}
                    className="cardImage"
                    top
                    src={svg}
                    alt="Card image cap"
                  />
                  <CardBody key={item.id}>
                    <CardTitle key={item.id} className="cardTitle">Program : {item.programAdi}</CardTitle>            
                    
                    <ButtonGroup className="cardButtonGroup">
                      <Button
                        key={item.id}
                        className="cardButtons"
                        color="success"
                        onClick={() => this.props.activeButton(item)}
                      >
                        Aktif
                      </Button>
                      <Button
                        key={item.id}
                        className="cardButtons"
                        color="info"
                        onClick={() => this.props.passiveButton(item)}
                      >
                        Pasif
                      </Button>
                      <Button
                        disabled={this.props.activeCards.find((itm)=>item.id === itm.programID) ? true : false}
                        key={item.id}
                        className="cardButtons"
                        color="warning"
                        onClick={() => {
                          this.editProgramButton(item);
                        }}
                      >
                        Düzenle
                      </Button>
                      <Button
                        key={item.id}
                        className="cardButtons"
                        color="danger"
                        onClick={() => {
                          this.deleteProgramButton(item);
                        }}
                      >
                        Sil
                      </Button>
                    </ButtonGroup>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        {/* EDİT PROGRAM*/}

        <Modal
          size="large"
          open={this.state.editModalOpen}
          onClose={this.editModalClose}
          style={{ top: "auto", left: "auto", right: "auto", bottom: "auto" }}
        >
          <Modal.Header>Program Düzenleme Ekranı</Modal.Header>
          <Modal.Content scrolling>
            <Message
              icon="warning circle"
              size="large"
              warning
              attached
              content="Programın güncellemek istediğiniz satırlarını değiştirin ve güncelle butonuna tıklayın."
            />
            <Container>
              <Row>
                <Col xs={12} lg={12} md={12}>
                  <Card style={{ padding: "25px", marginTop: "15px" }}>
                    <Form>
                      <FormGroup row>
                        <Label
                          for="programAdi"
                          style={{ fontSize: "24px" }}
                          xs={5}
                        >
                          Program Adı
                        </Label>
                        <Col xs={7}>
                          <Input
                            style={{ fontSize: "20px" }}
                            name="programAdi"
                            value={programAdi}
                            id="exampleEmail"
                            placeholder="program adını giriniz"
                            onChange={this.editHandleChange}
                            required
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label
                          for="dateTime"
                          style={{ fontSize: "24px" }}
                          xs={5}
                        >
                          Başlama Zamanı
                        </Label>
                        <Col xs={7}>
                          <input
                            style={{ fontSize: "20px" }}
                            type="time"
                            name="baslamaSaat"
                            value={baslamaSaat}
                            onChange={this.editHandleChange}
                            required
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label
                          for="calismaSuresi"
                          style={{ fontSize: "22px" }}
                          xs={5}
                        >
                          Çalışma Süresi (sa/dk/sn)
                        </Label>
                        <Col xs={2}>
                          <Input
                            type="number"
                            style={{ fontSize: "20px" }}
                            name="calismaSuresiSaat"
                            value={calismaSuresiSaat}
                            id="exampleEmail"
                            placeholder="saat"
                            onChange={this.editHandleChange}
                            required
                          />
                        </Col>
                        <Col xs={3}>
                          <Input
                            type="number"
                            style={{ fontSize: "20px" }}
                            name="calismaSuresiDakika"
                            value={calismaSuresiDakika}
                            id="exampleEmail"
                            placeholder="dakika"
                            onChange={this.editHandleChange}
                            required
                          />                        
                        </Col>
                        <Col xs={2}>
                          <Input
                            type="number"
                            style={{ fontSize: "20px" }}
                            name="calismaSuresiSaniye"
                            value={calismaSuresiSaniye}
                            id="exampleEmail"
                            placeholder="saniye"
                            onChange={this.editHandleChange}
                            required
                          />                        
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label
                          for="beklemeSuresi"
                          style={{ fontSize: "22px" }}
                          xs={5}
                        >
                          Bekleme Süresi (sa/dk/sn)
                        </Label>
                        <Col xs={2}>
                          <Input
                            type="number"
                            style={{ fontSize: "20px" }}
                            name="beklemeSuresiSaat"
                            value={beklemeSuresiSaat}
                            id="exampleEmail"
                            placeholder="saat"
                            onChange={this.editHandleChange}
                            required
                          />
                        </Col>
                        <Col xs={3}>
                          <Input
                            type="number"
                            style={{ fontSize: "20px" }}
                            name="beklemeSuresiDakika"
                            value={beklemeSuresiDakika}
                            id="exampleEmail"
                            placeholder="dakika"
                            onChange={this.editHandleChange}
                            required
                          />
                        </Col>
                        <Col xs={2}>
                          <Input
                            type="number"
                            style={{ fontSize: "20px" }}
                            name="beklemeSuresiSaniye"
                            value={beklemeSuresiSaniye}
                            id="exampleEmail"
                            placeholder="saniye"
                            onChange={this.editHandleChange}
                            required
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="tekrar" style={{ fontSize: "24px" }} xs={5}>
                          Tekrar
                        </Label>
                        <Col xs={7}>
                          <Input
                            type="number"
                            style={{ fontSize: "20px" }}
                            name="tekrar"
                            value={tekrar}
                            id="exampleEmail"
                            placeholder="tekrar miktarını giriniz"
                            onChange={this.editHandleChange}
                            required
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="tekrar" style={{ fontSize: "24px" }} xs={5}>
                          PH Set
                        </Label>
                        <Col xs={7}>
                          <Input
                            type="number"
                            style={{ fontSize: "20px" }}
                            name="phSet"
                            value={phSet}
                            id="exampleEmail"
                            placeholder="ph set değerini giriniz"
                            onChange={this.editHandleChange}
                            required
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="tekrar" style={{ fontSize: "24px" }} xs={5}>
                          EC Set
                        </Label>
                        <Col xs={7}>
                          <Input
                            type="number"
                            style={{ fontSize: "20px" }}
                            name="ecSet"
                            value={ecSet}
                            id="exampleEmail"
                            placeholder="ec set değerini giriniz"
                            onChange={this.editHandleChange}
                            required
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                      <Label for="valf" style={{ fontSize: "24px" }} xs={5}>
                        Valf 
                      <p><Badge>{'Önceki Seçim->'}</Badge>{suankiValfler.length===0 ? <Badge color="warning">SEÇİM YOK</Badge> : suankiValfler.map(item=>(<Badge color="info" style={{marginRight:'2px'}}>{item}</Badge>))}</p>
                        </Label>
                        <Col xs={7}>
                        <input name="valf1" type="checkbox" onClick={this.onChangeSwitch} onChangeCapture={this.onChangeSwitch} /*defaultChecked={suankiValfler.find(item=> item==="valf1") && true}*//><Label className="checkboxLabel">Valf-1</Label>
                        <input name="valf2" type="checkbox" onClick={this.onChangeSwitch} onChangeCapture={this.onChangeSwitch} /*defaultChecked={suankiValfler.find(item=> item==="valf2") && true}*//><Label className="checkboxLabel">Valf-2</Label>
                        <input name="valf3" type="checkbox" onClick={this.onChangeSwitch} onChangeCapture={this.onChangeSwitch} /*defaultChecked={suankiValfler.find(item=> item==="valf3") && true}*//><Label className="checkboxLabel">Valf-3</Label>
                        <input name="valf4" type="checkbox" onClick={this.onChangeSwitch} onChangeCapture={this.onChangeSwitch} /*defaultChecked={suankiValfler.find(item=> item==="valf4") && true}*//><Label className="checkboxLabel">Valf-4</Label>
                        <input name="valf5" type="checkbox" onClick={this.onChangeSwitch} onChangeCapture={this.onChangeSwitch} /*defaultChecked={suankiValfler.find(item=> item==="valf5") && true}*//><Label className="checkboxLabel">Valf-5</Label>
                        <input name="valf6" type="checkbox" onClick={this.onChangeSwitch} onChangeCapture={this.onChangeSwitch} /*defaultChecked={suankiValfler.find(item=> item==="valf6") && true}*//><Label className="checkboxLabel">Valf-6</Label>
                        <input name="valf7" type="checkbox" onClick={this.onChangeSwitch} onChangeCapture={this.onChangeSwitch} /*defaultChecked={suankiValfler.find(item=> item==="valf7") && true}*//><Label className="checkboxLabel">Valf-7</Label>
                        <input name="valf8" type="checkbox" onClick={this.onChangeSwitch} onChangeCapture={this.onChangeSwitch} /*defaultChecked={suankiValfler.find(item=> item==="valf8") && true}*//><Label className="checkboxLabel">Valf-8</Label>
                        </Col>
                    </FormGroup>
                      
                    <FormGroup row>
                      <Label for="günler" style={{fontSize:"24px"}} xs={5}>
                      Günler 
                      <p><Badge>{'Önceki Seçim->'}</Badge>{suankiGunler.length===0 ? <Badge color="warning">SEÇİM YOK</Badge> : suankiGunler.map(item=>(<Badge color="info" style={{marginRight:'2px'}}>{item}</Badge>))}</p>
                      </Label>
                      <Col xs={7}>
                        <input name="pazartesi" type="checkbox" onClick={this.onChangeSwitch} /*defaultChecked={suankiGunler.find(item=> item==="pazartesi") && true}*//><Label className="checkboxLabel">Pazartesi</Label>
                        <input name="sali" type="checkbox" onClick={this.onChangeSwitch} /*defaultChecked={suankiGunler.find(item=> item==="sali") && true}*//><Label className="checkboxLabel">Salı</Label>
                        <input name="carsamba" type="checkbox" onClick={this.onChangeSwitch} /*defaultChecked={suankiGunler.find(item=> item==="carsamba") && true}*//><Label className="checkboxLabel">Çarşamba</Label>
                        <input name="persembe" type="checkbox" onClick={this.onChangeSwitch} /*defaultChecked={suankiGunler.find(item=> item==="persembe") && true}*//><Label className="checkboxLabel">Perşembe</Label>
                        <input name="cuma" type="checkbox" onClick={this.onChangeSwitch} /*defaultChecked={suankiGunler.find(item=> item==="cuma") && true}*//><Label className="checkboxLabel">Cuma</Label>
                        <input name="cumartesi" type="checkbox" onClick={this.onChangeSwitch} /*defaultChecked={suankiGunler.find(item=> item==="cumartesi") && true}*//><Label className="checkboxLabel">Cumartesi</Label>
                        <input name="pazar" type="checkbox" onClick={this.onChangeSwitch} /*defaultChecked={suankiGunler.find(item=> item==="pazar") && true}*//><Label className="checkboxLabel">Pazar</Label>
                      </Col>                    
                    </FormGroup>
                    
                    <FormGroup row>
                      <Col xs={7}>
                        <Button style={{width:'100%',fontSize:'32px',borderRadius:'24px'}} type="submit" color="danger"onClick={() => this.editModalClose()}>Sayfayı Kapat</Button>
                      </Col>
                      <Col xs={5}>
                        <Button style={{width:'100%',fontSize:'32px',borderRadius:'24px'}} type="submit" color="success" onClick={() => this.editProgram()}>Güncelle</Button>
                      </Col>
                    </FormGroup>                                            
                    </Form>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Modal.Content>
        </Modal>

        {/* ADD PROGRAM */}

        <Modal
          size="large"
          open={this.state.addModalOpen}
          onClose={this.addModalClose}
          style={{ top: "auto", left: "auto", right: "auto", bottom: "auto" }}
        >
          <Modal.Header>Program Ekleme Ekranı</Modal.Header>

          <Modal.Content scrolling>
            <Message
              icon="warning circle"
              size="large"
              success
              attached
              content="Yeni program bilgilerini girin."
            />
            <Container>
              <Row>
                <Col xs={12} lg={12} md={12}>
                  <Card style={{ padding: "25px", marginTop: "15px" }}>
                    <Form>
                    <FormGroup row>
                      <Label
                        for="programAdi"
                        style={{ fontSize: "24px" }}
                        xs={5}
                      >
                        Program Adı
                      </Label>
                      <Col xs={7}>
                        <Input
                          style={{ fontSize: "20px" }}
                          name="programAdi"
                          value={programAdi}
                          id="exampleEmail"
                          placeholder="program adını giriniz"
                          onChange={this.addHandleChange}
                          required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label
                          for="dateTime"
                          style={{ fontSize: "24px" }}
                          xs={5}
                        >
                          Başlama Zamanı
                        </Label>
                        <Col xs={7}>
                          <input
                            style={{ fontSize: "20px" }}
                            type="time"
                            name="baslamaSaat"
                            value={baslamaSaat}
                            onChange={this.editHandleChange}
                            required
                          />
                        </Col>
                      </FormGroup>
                    <FormGroup row>
                      <Label
                        for="calismaSuresi"
                        style={{ fontSize: "22px" }}
                        xs={5}
                      >
                        Çalışma Süresi (sa/dk/sn)
                      </Label>
                      <Col xs={2}>
                        <Input
                          type="number"
                          style={{ fontSize: "20px" }}
                          name="calismaSuresiSaat"
                          value={calismaSuresiSaat}
                          id="exampleEmail"
                          placeholder="saat"
                          onChange={this.addHandleChange}
                          required
                        />
                      </Col>
                      <Col xs={3}>
                        <Input
                          type="number"
                          style={{ fontSize: "20px" }}
                          name="calismaSuresiDakika"
                          value={calismaSuresiDakika}
                          id="exampleEmail"
                          placeholder="dakika"
                          onChange={this.addHandleChange}
                          required
                        />
                      </Col>
                      <Col xs={2}>
                        <Input
                          type="number"
                          style={{ fontSize: "20px" }}
                          name="calismaSuresiSaniye"
                          value={calismaSuresiSaniye}
                          id="exampleEmail"
                          placeholder="saniye"
                          onChange={this.addHandleChange}
                          required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="beklemeSuresi"
                        style={{ fontSize: "22px" }}
                        xs={5}
                      >
                        Bekleme Süresi (sa/dk/sn)
                      </Label>
                      <Col xs={2}>
                        <Input
                          type="number"
                          style={{ fontSize: "20px" }}
                          name="beklemeSuresiSaat"
                          value={beklemeSuresiSaat}
                          id="exampleEmail"
                          placeholder="saat"
                          onChange={this.addHandleChange}
                          required
                        />
                      </Col>
                      <Col xs={3}>
                        <Input
                          type="number"
                          style={{ fontSize: "20px" }}
                          name="beklemeSuresiDakika"
                          value={beklemeSuresiDakika}
                          id="exampleEmail"
                          placeholder="dakika"
                          onChange={this.addHandleChange}
                          required
                        />
                      </Col>
                      <Col xs={2}>
                        <Input
                          type="number"
                          style={{ fontSize: "20px" }}
                          name="beklemeSuresiSaniye"
                          value={beklemeSuresiSaniye}
                          id="exampleEmail"
                          placeholder="saniye"
                          onChange={this.addHandleChange}
                          required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="tekrar" style={{ fontSize: "24px" }} xs={5}>
                        Tekrar
                      </Label>
                      <Col xs={7}>
                        <Input
                          type="number"
                          style={{ fontSize: "20px" }}
                          name="tekrar"
                          value={tekrar}
                          id="exampleEmail"
                          placeholder="tekrar miktarını giriniz"
                          onChange={this.addHandleChange}
                          required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="tekrar" style={{ fontSize: "24px" }} xs={5}>
                        PH Set
                      </Label>
                      <Col xs={7}>
                        <Input
                          type="number"
                          style={{ fontSize: "20px" }}
                          name="phSet"
                          value={phSet}
                          id="exampleEmail"
                          placeholder="ph set değerini giriniz"
                          onChange={this.addHandleChange}
                          required
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="tekrar" style={{ fontSize: "24px" }} xs={5}>
                        EC Set
                      </Label>
                      <Col xs={7}>
                        <Input
                          type="number"
                          style={{ fontSize: "20px" }}
                          name="ecSet"
                          value={ecSet}
                          id="exampleEmail"
                          placeholder="ec set değerini giriniz"
                          onChange={this.addHandleChange}
                          required
                        />
                      </Col>
                    </FormGroup>
                        
                    <FormGroup row>
                      <Label for="valf" style={{ fontSize: "24px" }} xs={5}>
                          Valf
                        </Label>
                        <Col xs={7}>
                        <input name="valf1" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Valf-1</Label>
                        <input name="valf2" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Valf-2</Label>
                        <input name="valf3" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Valf-3</Label>
                        <input name="valf4" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Valf-4</Label>
                        <input name="valf5" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Valf-5</Label>
                        <input name="valf6" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Valf-6</Label>
                        <input name="valf7" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Valf-7</Label>
                        <input name="valf8" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Valf-8</Label>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label for="günler" style={{fontSize:"24px"}} xs={5}>Günler</Label>
                      <Col xs={7}>                   
                        <input name="pazartesi" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Pazartesi</Label>
                        <input name="sali" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Salı</Label>
                        <input name="carsamba" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Çarşamba</Label>
                        <input name="persembe" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Perşembe</Label>
                        <input name="cuma" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Cuma</Label>
                        <input name="cumartesi" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Cumartesi</Label>
                        <input name="pazar" type="checkbox" onClick={this.onChangeSwitch}/><Label className="checkboxLabel">Pazar</Label>
                      </Col>                     
                    </FormGroup>
                    <FormGroup row>
                      <Col xs={7}>
                        <Button style={{width:'100%',fontSize:'32px',borderRadius:'24px'}} type="submit" color="danger"onClick={() => this.addModalClose()}>Sayfayı Kapat</Button>
                      </Col>
                      <Col xs={5}>
                        <Button style={{width:'100%',fontSize:'32px',borderRadius:'24px'}} type="submit" color="success" onClick={() => this.saveButton()}>Kaydet</Button>
                      </Col>
                    </FormGroup>
                    </Form>                                 
                  </Card>
                </Col>
              </Row>
            </Container>
          </Modal.Content>
        </Modal>     
      
      </div>
    );
  }
}
