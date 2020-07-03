import React, { Component } from "react";
import Programlar from "./components/Programlar";
import { Route, Switch } from "react-router-dom";
import cogoToast from "cogo-toast";
//import SahaIzleme from "./components/SahaIzleme";
import CalismaEkrani from "./components/CalismaEkrani";
import Ayarlar from "./components/Ayarlar";
import Navi from "./components/Navi";
import Servis from "./components/Servis";
import Main from "./components/Main";
import test from "./components/test"
import serverUrl from './config/serverUrl'
import axios from 'axios'
import alertify from 'alertifyjs'
export default class App extends Component {
  state = {
    array: [],          
    activeCards: [],
    sahaVerileri: {
      ph: 0,
      ec: 0,
      tankSeviyesi: 0,
    },
    runningPrograms:[],
    programKalanSure:0
  };

  addData = (gelen) => {
    var that = this;
    let url = serverUrl + '/programEkle'
    axios.post(url,gelen)
      .then(function(response){
        let tempArray = that.state.array;
        tempArray.push(gelen);
        that.setState({ array: tempArray });
        that.notification(gelen,' programı eklendi','success')
      })
      .catch(function(error){
        console.log(error)
        that.notification("",'Hata oluştu','error')
      })  
        
  };

  editData = (gelen) => {
    var that = this;
    let url = serverUrl + '/programGuncelle'
    axios.post(url,gelen)
      .then(function(res){
        let tempArray = that.state.array;
        tempArray.map(item=>{
        if(item.id===gelen.id){
          item.programAdi=gelen.programAdi
          item.baslamaTarih=gelen.baslamaTarih
          item.baslamaSaat=gelen.baslamaSaat
          item.calismaSuresiSaat=gelen.calismaSuresiSaat
          item.calismaSuresiDakika=gelen.calismaSuresiDakika
          item.calismaSuresiSaniye=gelen.calismaSuresiSaniye
          item.beklemeSuresiSaat=gelen.beklemeSuresiSaat
          item.beklemeSuresiDakika=gelen.beklemeSuresiDakika
          item.beklemeSuresiSaniye=gelen.beklemeSuresiSaniye
          item.tekrar=gelen.tekrar
          item.phSet=gelen.phSet
          item.ecSet=gelen.ecSet
        }
        return item;
      })
        that.setState({array:tempArray})
        that.notification(gelen,' programı düzenlendi','success')
      })
      .catch(function(error){
        console.log(error)
        that.notification('','Hata oluştu!','error')
      })    
  }

  deleteData = (gelen) =>{
    var that = this;
    let url = serverUrl + '/programSil'
    axios.post(url,gelen)
      .then(function(res){
        console.log(res)
        let tempArray = that.state.array;
        tempArray = tempArray.filter((card) => card.id !== gelen.id)
        that.setState({ array: tempArray }); 
        that.notification(gelen,' programı silindi.','success')
      })
      .catch(function(error){
        that.notification('','Hata oluştu!','error')
      })   
  }

  activeButton = (item) => {
    let that = this;
    let url = serverUrl + '/aktifProgramEkle'
       
    // let willAdd = {
    //   programID : item.id,
    //   programAdi : item.programAdi,
    //   baslamaTarih: item.baslamaTarih,
    //   baslamaSaat: item.baslamaSaat,
    //   beklemeSuresiDakika: item.beklemeSuresiDakika,
    //   beklemeSuresiSaat : item.beklemeSuresiSaat,
    //   beklemeSuresiSaniye: item.beklemeSuresiSaniye,
    //   calismaSuresiDakika:item.calismaSuresiDakika,
    //   calismaSuresiSaat:item.calismaSuresiSaat,
    //   calismaSuresiSaniye:item.calismaSuresiSaniye,
    //   ecSet:item.ecSet,
    //   phSet:item.phSet,
    //   tekrar:item.tekrar,
    //   Valfler:item.Valfler,
    //   Gunler:item.Gunler
    // }  
    // let tempArray = this.state.activeCards;
    if (!this.state.activeCards.find((itm) => itm.programID === item.id)) {       
        //tempArray.push(willAdd);      
        axios.post(url,item)
          .then(function(res){
            //that.setState({ activeCards:tempArray }); 
            that.notification(item,' aktif edildi.','success')
            setTimeout(() => {
              window.location.reload() 
            }, 500); 
          })
          .catch(function(error){
            that.notification('',String(error),'error')
          })
    }
         
  };

  passiveButton = (item) => {
    // let activeCards = [...this.state.activeCards];
    // activeCards = activeCards.filter((card) => card.programID !== item.id);
    // this.setState({ activeCards });
    let that = this; 
    console.log(item)
    let url = serverUrl + '/aktifProgramKaldir'
      axios.post(url,item)
      .then(function(res){
        that.notification(item,' pasif edildi.','error')
        setTimeout(() => {
          window.location.reload() 
        }, 500);
      })
      .catch(function(error){
        that.notification('',String(error),'error')
      }) 
  };
  
  kalanSureHesapla = ()=>{
    var interval = setInterval(() => {
      if(this.state.programKalanSure > 0){
        console.log('burdayım')
        this.setState({programKalanSure:this.state.programKalanSure-1})
      }
      else if(this.state.programKalanSure === 0){
        clearInterval(interval)
      }
      
    }, 1000);   
  }
  componentDidMount(){
    let that = this;
    let xurl = serverUrl + '/programListele'
    let yurl = serverUrl + '/aktifProgramListele'
    //this.kalanSureHesapla()
    
    function programListele(){
      return axios.get(xurl)
    }
    function aktifProgramListele(){
      return axios.get(yurl)
    }
    axios.all([programListele(),aktifProgramListele()])
      .then(axios.spread((xRes,yRes)=>{
        that.setState({array:xRes.data,activeCards:yRes.data})
      }))
      .catch((xError,yError)=>{
        console.log(xError)
        that.notification('','Veritabanına bağlanılamadı!','error')
      })
    
     setInterval(() => {
      this.anlikDegerleriOku()
      this.checkRunningPrograms()            
    }, 2000);  
  }

  checkRunningPrograms=()=>{
    const {runningPrograms} = this.state;
    if(runningPrograms.length>0){
      var sure = (Number(runningPrograms[0].calismaSuresiSaniye) + Number(runningPrograms[0].beklemeSuresiSaniye))*runningPrograms[0].tekrar
    }  
    let that = this;
    let url = serverUrl + '/calisanProgramListele'
    axios.get(url)
    .then(res=>{
      that.setState({runningPrograms:res.data,programKalanSure:sure})
    })
    .catch(err=>console.log(err))
  }
  
  anlikDegerleriOku=()=>{
    let that = this;
    let tankSeviyesi = 0;
    let ph = 0;
    let ec = 0;
    let aurl = serverUrl + '/anlikVeriCek'
    axios.get(aurl)
    .then(res=>{
        ph = Number((res.data[0]/100).toFixed(2))  
        ec = Number((res.data[1]/100).toFixed(1))
        tankSeviyesi = Number(((res.data[2]*100)/4095).toFixed(1))
        that.setState({sahaVerileri:{
          ...that.state.sahaVerileri,
          tankSeviyesi,ph,ec
        }});
    })
    .catch(err=>{
        that.alertifyNotification('Modbus bağlantı hatası')
    })
  }
  
  notification=(item,message,type)=>{
    if(type==='success'){
      cogoToast.success(
        <div>
          <h2>{item.programAdi} {message}</h2>
        </div>,
        { position: "top-center" }
      );
    }
    if(type==='error'){
      cogoToast.error(
        <div>
          <h2>{item.programAdi} {message}</h2>
        </div>,
        { position: "top-center" }
      );
    }
  }

  alertifyNotification = (message) =>{
    let title="HATA"
    alertify.alert(title, message);
  }

  render() {
    const { array, activeCards,sahaVerileri,runningPrograms,programKalanSure } = this.state;
    return (
      <div>
        <Navi/>
        <Switch>
          <Route exact path="/calismaekrani">
            <CalismaEkrani
              activeCards={activeCards}
              cards={array}
              runningPrograms={runningPrograms}
              programKalanSure ={programKalanSure} 
              sahaVerileri={sahaVerileri}
              passiveButton={this.passiveButton}
              notification={this.notification}                        
            ></CalismaEkrani>
          </Route>

          <Route
            exact
            path="/programlar"
            render={(props) => (
              <Programlar
                {...props}
                card={array}
                activeCards={activeCards}
                runningPrograms={runningPrograms}
                activeButton={this.activeButton}
                passiveButton={this.passiveButton}
                addData={this.addData}
                editData={this.editData}
                deleteData={this.deleteData}
                notification = {this.notification}
              />
            )}
          />

          {/* <Route exact path="/sahaizleme">
            <SahaIzleme sahaVerileri={sahaVerileri}/>
          </Route> */}

          <Route exact path="/servis">
              <Servis 
                activeCards={activeCards}
                runningPrograms={runningPrograms} 
                cards={array} 
                passiveButton={this.passiveButton}
                notification = {this.notification}
                />              
          </Route>

          <Route exact path="/ayarlar" component={Ayarlar} />

          <Route exact path="/" component={Main} />

          <Route exact path="/test" component={test} />
        </Switch>
        
      </div>
    );
  }
}
