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
  Table,
  CardSubtitle
} from "reactstrap";
import { Modal, Message } from "semantic-ui-react";
import { SettingOutlined,FormOutlined,DeleteOutlined,CheckOutlined,CloseOutlined } from "@ant-design/icons";
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
      valf1:null,valf2:true,valf3:null,valf4:null,valf5:null,valf6:null,valf7:null,valf8:null,
      pazartesi:null,sali:null,carsamba:null,persembe:null,cuma:null,cumartesi:null,pazar:null,
      suankiValfler:[],
      suankiGunler:[],
      sirkulasyonSeviyesi:20,
      dolmaSeviyesi:100
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
      sirkulasyonSeviyesi:gelen.sirkulasyonSeviye,
      dolmaSeviyesi:gelen.dolmaSeviye
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
    //console.log(item)
    if(this.props.activeCards.find(itm=>itm.programID === item.id)){
      this.props.notification('','Program aktifken düzenleme yapamazsınız.','error')
    }
    else{
      this.editModalOpen();
      this.showProgramInfo(item);
    }  
  };

  deleteProgramButton = (item)=>{
    let title="PROGRAM SİLME"
    let message=item.programAdi+' programını silmek istediğinize emin misiniz? \nDİKKAT! Bu işlem geri alınamaz!'
    if(this.props.activeCards.find(itm=>itm.programID === item.id)){
      this.props.notification('','Program aktifken silme işlemi yapamazsınız.','error')
    }
    else{
      alertify.confirm(title, message, 
        ()=>this.props.deleteData(item),
        ()=>alertify.error('İşlem iptal edildi'))
    } 
    
  }
  activeButton = (item) =>{
    let title="PROGRAM AKTİFLEŞTİRME"
    let message=item.programAdi+' programını aktif etmek üzeresiniz. Bunu yaptığınızda saat '+item.baslamaSaat+' olduğunda otomatik sulama programı başlayacak ve girmiş olduğunuz parametrelere göre sulama yapılacak. Emin misiniz?'
    if(this.props.activeCards.length===0){
      if(this.props.activeCards.find(itm=>itm.programID === item.id)){
        this.props.notification('','Program zaten aktif durumda.','error')
      }
      else{
        alertify.confirm(title, message, 
          ()=>this.props.activeButton(item),
          ()=>alertify.error('İşlem iptal edildi'))
      }
    }
    else{
      this.props.notification('','Aynı anda tek bir program aktif edebilirsiniz. Bunu aktif etmek için diğer programı pasif yapınız.','error')
    }
      
    
  }
  passiveButton = (item) =>{
    let title="PROGRAM PASİFLEŞTİRME"
    let message=item.programAdi+' programını pasif etmek üzeresiniz. Bunu yaptığınızda program duracak ve otomatik sulama siz yeniden başlatana dek devam etmeyecek. Emin misiniz?'
    if(!this.props.activeCards.find(itm=>itm.programID === item.id)){
      this.props.notification('','Program zaten pasif durumda.','error')
    }
    else{
      alertify.confirm(title, message, 
        ()=>this.props.passiveButton(item),
        ()=>alertify.error('İşlem iptal edildi'))
    }
    
   
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
      pazartesi,sali,carsamba,persembe,cuma,cumartesi,pazar,
      sirkulasyonSeviyesi,dolmaSeviyesi    
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
      pazartesi,sali,carsamba,persembe,cuma,cumartesi,pazar,
      sirkulasyonSeviyesi,dolmaSeviyesi
    };

    if(!pazartesi && !sali && !carsamba && !persembe && !cuma && !cumartesi && !pazar){
      this.props.notification('','Program eklenemedi : Gün seçmediniz!','error')
    }
    else if(phSet > 14 || phSet < 0){
      this.props.notification('','Program eklenemedi: PH değeri 0 ile 14 arasında olmalıdır!')
    }
    else if(ecSet < 0 || ecSet > 10000){
      this.props.notification('','Program eklenemedi: EC değeri 0 ile 10 bin arasında olmalıdır!')
    }

    else if(calismaSuresiSaat > 24 || calismaSuresiDakika > 60 || calismaSuresiSaniye > 60){
      this.props.notification('','Çalışma süreleri istenen istenen aralıklarda değil!')
    }
    else if(beklemeSuresiSaat > 24 || beklemeSuresiDakika > 60 || beklemeSuresiSaniye > 60){
      this.props.notification('','Bekleme süreleri istenen istenen aralıklarda değil!')
    }
    else if(Number(sirkulasyonSeviyesi)>Number(dolmaSeviyesi)){
      this.props.notification('','Program eklenemedi! : Dolum seviyesi sirkülasyon seviyesinden az olamaz!','error')
    }
    else{
      this.props.addData(newObject); 
    }    
  };

  editProgram = ()=>{
    //const {pazartesi,sali,carsamba,persembe,cuma,cumartesi,pazar,sirkulasyonSeviyesi,dolmaSeviyesi} = this.state.cardInfo; 
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
      pazartesi,sali,carsamba,persembe,cuma,cumartesi,pazar,
      sirkulasyonSeviyesi,dolmaSeviyesi    
    } = this.state.cardInfo;
    console.log(sirkulasyonSeviyesi)
    console.log(dolmaSeviyesi)
    if(!pazartesi && !sali && !carsamba && !persembe && !cuma && !cumartesi && !pazar){
      this.props.notification('','Program düzenlenemedi! : Gün seçmediniz!','error')
    }
    else if(phSet > 14 || phSet < 0){
      this.props.notification('','Program eklenemedi: PH değeri 0 ile 14 arasında olmalıdır!')
    }
    else if(ecSet < 0 || ecSet > 10000){
      this.props.notification('','Program eklenemedi: EC değeri 0 ile 10 bin arasında olmalıdır!')
    }

    else if(calismaSuresiSaat > 24 || calismaSuresiDakika > 60 || calismaSuresiSaniye > 60){
      this.props.notification('','Çalışma süreleri istenen istenen aralıklarda değil!')
    }
    else if(beklemeSuresiSaat > 24 || beklemeSuresiDakika > 60 || beklemeSuresiSaniye > 60){
      this.props.notification('','Bekleme süreleri istenen istenen aralıklarda değil!')
    }
    else if(Number(sirkulasyonSeviyesi)>Number(dolmaSeviyesi)){
      this.props.notification('','Program düzenlenemedi! : Dolum seviyesi sirkülasyon seviyesinden az olamaz!','error')
    }
    else{
      console.log('edit program func')
      console.log(this.state.cardInfo)
      this.props.editData(this.state.cardInfo)
    }  
  }

  badgeJSX = (item,index) => {
    return (
      <Badge
        key={index}
        color="success"
        style={{
          fontSize: "22px",
          margin: "7px",
        }}
      >
        {item.programAdi+' programı çalışıyor'}
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
  
  editProgramModalJSX = ()=>{
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
      // suankiValfler,
      suankiGunler,
      sirkulasyonSeviyesi,dolmaSeviyesi
    } = this.state.cardInfo;
    
      return(
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
                          style={{ fontSize: "2vh" }}
                          xs={5}
                        >
                          Program Adı
                        </Label>
                        <Col xs={7}>
                          <Input
                            style={{ fontSize: "2vh" }}
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
                          style={{ fontSize: "2vh" }}
                          xs={5}
                        >
                          Başlama Zamanı
                        </Label>
                        <Col xs={7}>
                          <input
                            style={{ fontSize: "2vh" }}
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
                          style={{ fontSize: "2vh" }}
                          xs={5}
                        >
                          Çalışma Süresi (sa/dk/sn)
                        </Label>
                        <Col xs={2}>
                          <Input
                            type="number"
                            step={1}
                            min={0}
                            max={24}
                            style={{ fontSize: "2vh" }}
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
                            step={1}
                            min={0}
                            max={60}
                            style={{ fontSize: "2vh" }}
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
                            step={1}
                            min={0}
                            max={60}
                            style={{ fontSize: "2vh" }}
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
                          style={{ fontSize: "2vh" }}
                          xs={5}
                        >
                          Bekleme Süresi (sa/dk/sn)
                        </Label>
                        <Col xs={2}>
                          <Input
                            type="number"
                            step={1}
                            min={0}
                            max={24}
                            style={{ fontSize: "2vh" }}
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
                            step={1}
                            min={0}
                            max={60}
                            style={{ fontSize: "2vh" }}
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
                            step={1}
                            min={0}
                            max={60}
                            style={{ fontSize: "2vh" }}
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
                        <Label for="tekrar" style={{ fontSize: "2vh" }} xs={5}>
                          Tekrar
                        </Label>
                        <Col xs={7}>
                          <Input
                            type="number"
                            min={0}
                            style={{ fontSize: "2vh" }}
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
                        <Label for="tekrar" style={{ fontSize: "2vh" }} xs={5}>
                          PH Set
                        </Label>
                        <Col xs={7}>
                          <Input
                            type="number"
                            step={0.01}
                            min={0}
                            max={14}
                            style={{ fontSize: "2vh" }}
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
                        <Label for="tekrar" style={{ fontSize: "2vh" }} xs={5}>
                          EC Set
                        </Label>
                        <Col xs={7}>
                          <Input
                            type="number"
                            style={{ fontSize: "2vh" }}
                            name="ecSet"
                            step={0.01}
                            min={0}
                            max={10000}
                            value={ecSet}
                            id="exampleEmail"
                            placeholder="ec set değerini giriniz"
                            onChange={this.editHandleChange}
                            required
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                      <Label for="valf" style={{ fontSize: "2vh" }} xs={5}>
                        Valf 
                      {/* <p><Badge>{'Önceki Seçim->'}</Badge>{suankiValfler.length===0 ? <Badge color="warning">SEÇİM YOK</Badge> : suankiValfler.map((item,index)=>(<Badge key={index} color="info" style={{marginRight:'2px'}}>{item}</Badge>))}</p> */}
                        </Label>
                        <Col xs={7}>
                        <input name="valf1" type="checkbox" onClick={this.onChangeSwitch}  disabled={true}/><Label className="checkboxLabel">Valf-1</Label>
                        <input name="valf2" type="checkbox" onClick={this.onChangeSwitch}  checked={true}/><Label className="checkboxLabel">Valf-2</Label>
                        <input name="valf3" type="checkbox" onClick={this.onChangeSwitch}  disabled={true}/><Label className="checkboxLabel">Valf-3</Label>
                        {/* <input name="valf4" type="checkbox" onClick={this.onChangeSwitch}  disabled={true}/><Label className="checkboxLabel">Valf-4</Label>
                        <input name="valf5" type="checkbox" onClick={this.onChangeSwitch}  disabled={true}/><Label className="checkboxLabel">Valf-5</Label>
                        <input name="valf6" type="checkbox" onClick={this.onChangeSwitch}  disabled={true}/><Label className="checkboxLabel">Valf-6</Label>
                        <input name="valf7" type="checkbox" onClick={this.onChangeSwitch}  disabled={true}/><Label className="checkboxLabel">Valf-7</Label>
                        <input name="valf8" type="checkbox" onClick={this.onChangeSwitch}  disabled={true}/><Label className="checkboxLabel">Valf-8</Label> */}
                        </Col>
                    </FormGroup>
                      
                      <FormGroup row>
                      <Label for="günler" style={{fontSize:"3vh"}} xs={5}>
                      Günler 
                      <p><Badge>{'Önceki Seçim->'}</Badge>{suankiGunler.length===0 ? <Badge color="warning">SEÇİM YOK</Badge> : suankiGunler.map((item,index)=>(<Badge key={index} color="info" style={{marginRight:'2px'}}>{item}</Badge>))}</p>
                      </Label>
                      <Col xs={7}>
                        <input name="pazartesi" type="checkbox" onClick={this.onChangeSwitch} /*defaultChecked={suankiGunler.find(item=> item==="pazartesi") && true}*//><Label className="checkboxLabel">Pazartesi</Label>
                        <input name="sali" type="checkbox" onClick={this.onChangeSwitch} /*defaultChecked={suankiGunler.find(item=> item==="sali") && true}*//><Label className="checkboxLabel">Salı</Label>
                        <input name="carsamba" type="checkbox" onClick={this.onChangeSwitch}  /*defaultChecked={suankiGunler.find(item=> item==="carsamba") && true}*//><Label className="checkboxLabel">Çarşamba</Label>
                        <input name="persembe" type="checkbox" onClick={this.onChangeSwitch} /*defaultChecked={suankiGunler.find(item=> item==="persembe") && true}*//><Label className="checkboxLabel">Perşembe</Label>
                        <input name="cuma" type="checkbox" onClick={this.onChangeSwitch} /*defaultChecked={suankiGunler.find(item=> item==="cuma") && true}*//><Label className="checkboxLabel">Cuma</Label>
                        <input name="cumartesi" type="checkbox" onClick={this.onChangeSwitch} /*defaultChecked={suankiGunler.find(item=> item==="cumartesi") && true}*//><Label className="checkboxLabel">Cumartesi</Label>
                        <input name="pazar" type="checkbox" onClick={this.onChangeSwitch} /*defaultChecked={suankiGunler.find(item=> item==="pazar") && true}*//><Label className="checkboxLabel">Pazar</Label>
                      </Col>                    
                    </FormGroup>
                    
                    <FormGroup row>
                      <Label style={{fontSize:"2vh"}} xs={5}>Tank Seviye</Label>
                      <Col xs={4}>                   
                        <Label style={{fontSize:'2vh'}}>Sirkülasyon Başlangıç(%)</Label><Input max={100} style={{ fontSize: "20px" }} name="sirkulasyonSeviyesi" type="number" value={sirkulasyonSeviyesi} required onChange={this.editHandleChange}/>
                      </Col>
                      <Col xs={3}>
                        <Label style={{fontSize:'2vh'}}>Dolum (%)</Label><Input max={100} pattern="\d{4}" style={{ fontSize: "20px" }} name="dolmaSeviyesi" type="number" value={dolmaSeviyesi} required onChange={this.editHandleChange}/>
                      </Col>                     
                    </FormGroup>  

                    <FormGroup row>
                      <Col xs={7}>
                        <Button style={{width:'100%',fontSize:'2.7vh',borderRadius:'24px'}} type="submit" color="danger"onClick={() => this.editModalClose()}>Sayfayı Kapat</Button>
                      </Col>
                      <Col xs={5}>
                        <Button style={{width:'100%',fontSize:'2.7vh',borderRadius:'24px'}} type="submit" color="success" onClick={() => this.editProgram()}>Güncelle</Button>
                      </Col>
                    </FormGroup>                                            
                    </Form>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Modal.Content>
        </Modal>
      )
  }
  
  addProgramModalJSX = ()=>{
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
      sirkulasyonSeviyesi,dolmaSeviyesi
    } = this.state.cardInfo;
    
    return(
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
                        style={{ fontSize: "2vh" }}
                        xs={5}
                      >
                        Program Adı
                      </Label>
                      <Col xs={7}>
                        <Input
                          style={{ fontSize: "2vh" }}
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
                          style={{ fontSize: "2vh" }}
                          xs={5}
                        >
                          Başlama Zamanı
                        </Label>
                        <Col xs={7}>
                          <input
                            style={{ fontSize: "2vh" }}
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
                        style={{ fontSize: "2vh" }}
                        xs={5}
                      >
                        Çalışma Süresi (sa/dk/sn)
                      </Label>
                      <Col xs={2}>
                        <Input
                          type="number"
                          step={1}
                          min={0}
                          max={24}
                          style={{ fontSize: "2vh" }}
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
                          step={1}
                          min={0}
                          max={60}
                          style={{ fontSize: "2vh" }}
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
                          step={1}
                          min={0}
                          max={60}
                          style={{ fontSize: "2vh" }}
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
                        style={{ fontSize: "2vh" }}
                        xs={5}
                      >
                        Bekleme Süresi (sa/dk/sn)
                      </Label>
                      <Col xs={2}>
                        <Input
                          type="number"
                          step={1}
                          min={0}
                          max={24}
                          style={{ fontSize: "2vh" }}
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
                          step={1}
                          min={0}
                          max={60}
                          style={{ fontSize: "2vh" }}
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
                          step={1}
                          min={0}
                          max={60}
                          style={{ fontSize: "2vh" }}
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
                      <Label for="tekrar" style={{ fontSize: "2vh" }} xs={5}>
                        Tekrar
                      </Label>
                      <Col xs={7}>
                        <Input
                          type="number"
                          min={0}
                          style={{ fontSize: "2vh" }}
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
                      <Label for="tekrar" style={{ fontSize: "2vh" }} xs={5}>
                        PH Set
                      </Label>
                      <Col xs={7}>
                        <Input
                          type="number"
                          step={0.01}
                          min={0}
                          max={14}
                          style={{ fontSize: "2vh" }}
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
                      <Label for="tekrar" style={{ fontSize: "2vh" }} xs={5}>
                        EC Set
                      </Label>
                      <Col xs={7}>
                        <Input
                          type="number"
                          style={{ fontSize: "2vh" }}
                          name="ecSet"
                          step={0.01}
                          min={0}
                          max={10000}
                          value={ecSet}
                          id="exampleEmail"
                          placeholder="ec set değerini giriniz"
                          onChange={this.addHandleChange}
                          required
                        />
                      </Col>
                    </FormGroup>
                        
                    <FormGroup row>
                      <Label for="valf" style={{ fontSize: "2vh" }} xs={5}>
                          Valf
                        </Label>
                        <Col xs={7}>
                        <input name="valf1" type="checkbox" onClick={this.onChangeSwitch} disabled={true}/><Label className="checkboxLabel">Valf-1</Label>
                        <input name="valf2" type="checkbox" onClick={this.onChangeSwitch} checked={true}/><Label className="checkboxLabel">Valf-2</Label>
                        <input name="valf3" type="checkbox" onClick={this.onChangeSwitch} disabled={true}/><Label className="checkboxLabel">Valf-3</Label>
                        {/* <input name="valf4" type="checkbox" onClick={this.onChangeSwitch} disabled={true}/><Label className="checkboxLabel">Valf-4</Label>
                        <input name="valf5" type="checkbox" onClick={this.onChangeSwitch} disabled={true}/><Label className="checkboxLabel">Valf-5</Label>
                        <input name="valf6" type="checkbox" onClick={this.onChangeSwitch} disabled={true}/><Label className="checkboxLabel">Valf-6</Label>
                        <input name="valf7" type="checkbox" onClick={this.onChangeSwitch} disabled={true}/><Label className="checkboxLabel">Valf-7</Label>
                        <input name="valf8" type="checkbox" onClick={this.onChangeSwitch} disabled={true}/><Label className="checkboxLabel">Valf-8</Label> */}
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label for="günler" style={{fontSize:"2vh"}} xs={5}>Günler</Label>
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
                      <Label style={{fontSize:"2vh"}} xs={5}>Tank Seviye</Label>
                      <Col xs={4}>                   
                        <Label style={{fontSize:'2vh'}}>Sirkülasyon Başlangıç(%)</Label><Input max={100} style={{ fontSize: "20px" }} name="sirkulasyonSeviyesi" type="number" value={sirkulasyonSeviyesi} required onChange={this.addHandleChange}/>
                      </Col>
                      <Col xs={3}>
                        <Label style={{fontSize:'2vh'}}>Dolum (%)</Label><Input max={100} style={{ fontSize: "20px" }} name="dolmaSeviyesi" type="number" value={dolmaSeviyesi} required onChange={this.addHandleChange}/>
                      </Col>                     
                    </FormGroup>

                    <FormGroup row>
                      <Col xs={7}>
                        <Button style={{width:'100%',fontSize:'2.7vh',borderRadius:'12px'}} type="submit" color="danger" onClick={() => this.addModalClose()}>Sayfayı Kapat</Button>
                      </Col>
                      <Col xs={5}>
                        <Button style={{width:'100%',fontSize:'2.7vh',borderRadius:'12px'}} type="submit" color="success" onClick={() => this.saveButton()}>Kaydet</Button>
                      </Col>
                    </FormGroup>
                    </Form>                                 
                  </Card>
                </Col>
              </Row>
            </Container>
          </Modal.Content>
        </Modal>
    )
  }

  cardSubtitleBadgeJSX = (item)=>{
    return (
      <div>
        <Badge color="warning" style={{fontSize:'20px',marginTop:'5px',marginLeft:'2px'}}>{item.baslamaSaat}</Badge>
        <Badge color="info" style={{fontSize:'20px',marginTop:'5px',marginLeft:'2px'}}>{'PH: '+item.phSet}</Badge>
        <Badge color="info" style={{fontSize:'20px',marginTop:'5px',marginLeft:'2px'}}>{'EC: '+item.ecSet}</Badge>
        <hr style={{borderTop:'2px solid #bbb',borderRadius:'5px'}}></hr>
        <h3 style={{fontSize:'20px',marginTop:'5px',marginLeft:'2px',width:'100%',color:'white'}}>{'Sulama Süresi:'+Number((item.calismaSuresiSaat*60+item.calismaSuresiDakika+item.calismaSuresiSaniye/60)).toFixed(0)+' dk'}</h3>
        <hr style={{borderTop:'2px solid #bbb',borderRadius:'5px'}}></hr>
        <h3 style={{fontSize:'20px',marginTop:'5px',marginLeft:'2px',width:'100%',color:'white'}}>{'Bekleme Süresi:'+Number((item.beklemeSuresiSaat*60+item.beklemeSuresiDakika+item.beklemeSuresiSaniye/60)).toFixed(0)+' dk'}</h3>
        <hr style={{borderTop:'2px solid #bbb',borderRadius:'5px'}}></hr>
        <h3 style={{fontSize:'20px',marginTop:'5px',marginLeft:'2px',width:'100%',color:'white'}}>{'Tekrar:'+item.tekrar}</h3>
        <hr style={{borderTop:'2px solid #bbb',borderRadius:'5px'}}></hr>
        <h3 style={{fontSize:'20px',marginTop:'5px',marginLeft:'2px',width:'100%',color:'white'}}>{'Toplam Sulama:'+Number((item.calismaSuresiSaat*60+item.calismaSuresiDakika+item.calismaSuresiSaniye/60)*item.tekrar).toFixed(1)+' dk'}</h3>
      </div> 
    )
  }

  cardsJSX = ()=>{
    return(                       
      <Container fluid={true}>
          <Badge color="info" className="badges" style={{fontSize:'3vh',marginTop:'3px'}}>{'PH:'+this.props.sahaVerileri.ph}</Badge>
          <Badge color="info" className="badges" style={{fontSize:'3vh',marginTop:'3px',marginLeft:'5px'}}>{'EC:'+this.props.sahaVerileri.ec}</Badge>                
          <Badge color={this.props.sahaVerileri.tankSeviyesi >=90 ? "danger":"info"} className="badges" style={{fontSize:'3vh',marginTop:'3px',marginLeft:'5px'}}>{'Su Seviyesi: %'+this.props.sahaVerileri.tankSeviyesi}</Badge>
          <Row style={{marginTop:'5px'}}>
            <Col xs={6} lg={3} md={3}>
              <Button
              color="success"
              // size="lg"
              onClick={this.addProgramButton}
              style={{ marginTop: "7px",marginBottom:"15px", width:'100%',fontSize:'2.5vh' }}
            >
            + Program Ekle
            </Button>
            </Col>

            {/* <Col xs={6} lg={9} md={9}>       
            {this.props.runningPrograms.length === 0 ? <Badge style={{fontSize:'22px',margin:'7px'}} color="warning" >Çalışan Program Yok</Badge> : this.props.runningPrograms.map((item,index)=>this.badgeJSX(item,index))}             
            </Col> */}
          </Row>
          <Row>
            {this.props.card.map((item,index) => (            
              <Col xs={12} lg={3} md={6} key={index}>
                <Card
                  key={index}
                  className="programlarCard"
                  style={{                 
                    backgroundColor: this.props.activeCards.find(
                      (itm) => item.id === itm.programID
                    )
                      ? "#1faa00"
                      : "#37474f",
                    borderRadius:'10px'
                  }}
                >
                  <CardImg
                    key={index}
                    className="cardImage"
                    top
                    src={svg}
                    alt="Card image cap"
                  />
                  <CardBody key={index}>
                    <CardTitle key={index} className="cardTitle">Program : {item.programAdi}</CardTitle>            
                    <CardSubtitle>{this.cardSubtitleBadgeJSX(item)}</CardSubtitle>
                    <ButtonGroup className="cardButtonGroup">
                      <Button
                        key={index}
                        className="cardButtons"
                        color="success"
                        onClick={() => this.activeButton(item)}
                      >
                        <CheckOutlined className="iconClass"/>
                      </Button>
                      <Button
                        key={index}
                        className="cardButtons"
                        color="secondary"
                        onClick={() => this.passiveButton(item)}
                      >                       
                        <CloseOutlined className="iconClass"/>
                      </Button>
                      <Button
                        // disabled={this.props.activeCards.find((itm)=>item.id === itm.programID) ? true : false}
                        key={index}
                        className="cardButtons"
                        color="warning"
                        onClick={() => {
                          this.editProgramButton(item);
                        }}
                      >
                        <FormOutlined className="iconClass"/>
                      </Button>
                      <Button
                        // disabled={this.props.activeCards.find((itm)=>item.id === itm.programID) ? true : false}
                        key={index}
                        className="cardButtons"
                        color="danger"
                        onClick={() => {
                          this.deleteProgramButton(item);
                        }}
                      >
                        <DeleteOutlined className="iconClass"/>
                      </Button>
                    </ButtonGroup>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
    )
  }
  componentDidMount() {
    document.title = "APRA TARIM - Programlar"
  }
  

  render() {
    return (
      <div className="bgImage">
        
        {/* CARDS */}
        
        {this.cardsJSX()}
        

        {/* EDİT PROGRAM*/}

        {this.editProgramModalJSX()}

        {/* ADD PROGRAM */}

        {this.addProgramModalJSX()}
      
      </div>
    );
  }
}
