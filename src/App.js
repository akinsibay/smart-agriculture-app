import React, { Component } from "react";
import Programlar from "./components/Programlar";
import { Route, Switch } from "react-router-dom";
import cogoToast from "cogo-toast";
import SahaIzleme from "./components/SahaIzleme";
import CalismaEkrani from "./components/CalismaEkrani";
import Ayarlar from "./components/Ayarlar";
import Navi from "./components/Navi";
import Servis from "./components/Servis";
import Main from "./components/Main";
import test from "./components/test"
import serverUrl from './config/serverUrl'
import axios from 'axios'
export default class App extends Component {
  state = {
    array: [],          
    activeCards: [],
    sahaVerileri: {
      sicaklik: "",
      nem: "",
      ph: "",
      ec: "",
      debi: "",
      ruzgarhizi: "",
    },
    runningPrograms:[]
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
            alert(error)
            that.notification('','Veritabanı hatası!','error')
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
        console.log(res)
        that.notification(item,' pasif edildi.','error')
        setTimeout(() => {
          window.location.reload() 
        }, 500);
      })
      .catch(function(error){
        //alert(error)
        console.log(error)
        that.notification('',String(error),'error')
      })    
   
     
  };


  componentWillMount() {
    setInterval(() => {
      this.setState({sahaVerileri:{
        sicaklik: (15 + Math.random() * 15).toFixed(1),
        nem: (20 + Math.random() * 80).toFixed(1),
        ph: (Math.random() * 14).toFixed(1),
        ec: (Math.random() * 5).toFixed(1),
        debi: (Math.random() * 5).toFixed(1),
        ruzgarhizi: (Math.random() * 5).toFixed(1),
      }});
    }, 3000);
  }
  
  componentDidMount(){
    let that = this;
    let xurl = serverUrl + '/programListele'
    let yurl = serverUrl + '/aktifProgramListele'

    function programListele(){
      return axios.get(xurl)
    }
    function aktifProgramListele(){
      return axios.get(yurl)
    }
    axios.all([programListele(),aktifProgramListele()])
      .then(axios.spread((xRes,yRes)=>{
        that.setState({array:xRes.data,activeCards:yRes.data})
        this.checkRunningPrograms()
      }))
      .catch((xError,yError)=>{
        that.notification('','Veritabanına bağlanılamadı!','error')
      })
    
    setInterval(() => {
      this.checkRunningPrograms()
    }, 5000);  
  }

  checkRunningPrograms=()=>{
    let that = this;
    let url = serverUrl + '/calisanProgramListele'
    axios.get(url)
    .then(res=>{
      that.setState({runningPrograms:res.data})
    })
    .catch(err=>console.log(err))
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

  render() {
    const { array, activeCards,sahaVerileri,runningPrograms } = this.state;
    return (
      <div>
        <Navi/>
        <Switch>
          <Route exact path="/calismaekrani">
            <CalismaEkrani
              activeCards={activeCards}
              cards={array}
              runningPrograms={runningPrograms} 
              sahaVerileri={sahaVerileri}
              passiveButton={this.passiveButton}                        
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

          <Route exact path="/sahaizleme">
            <SahaIzleme sahaVerileri={sahaVerileri}/>
          </Route>

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
