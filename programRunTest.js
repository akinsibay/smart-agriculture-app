let day = ["pazar","pazartesi","sali","carsamba","persembe","cuma","cumartesi"]
let aktifKartlar = []
let timers={} //zaman intervaller objesi
let calisTimers={} //çalışma intervaller objesi
let bekleTimers={} //bekleme intervaller objesi
let tekrarIndis={} //tekrar indisleri objesi (i)
var modbus = require('./modbus')

let islemler = {
  calis: function (kart, callback) {
    var id = kart.id || kart.programID
    console.log(kart.programAdi+' '+modbus.run())
    console.log(kart.programAdi+' tekrar indis: '+tekrarIndis['no'+id])
    calisTimers['no'+id] = setTimeout(() => { //bu programa ait bir çalışma timerı oluştur
      callback(kart,this.again);
    }, kart._calismaSuresi*1000); 
  },
  bekle: function (kart, callback) {
    var id = kart.id || kart.programID
    console.log(kart.programAdi+' '+modbus.stop())
    bekleTimers['no'+id] = setTimeout(() => { //bu programa ait bir bekleme timerı oluştur
      callback(kart);
    }, kart._beklemeSuresi*1000);
  },
  again: function (kart) {
    var id = kart.id || kart.programID   
    if (tekrarIndis['no'+id] < kart._tekrar - 1) {     
      tekrarIndis['no'+id]+=1;
      islemler.calis(kart,islemler.bekle);     
    }
    else{
      console.log(kart.programAdi+' program bitti!!')
      timers['no'+id] = setInterval(() => {
        console.log(kart.programAdi+' tekrar sorgulanıyor...')
        tekrarIndis['no'+id] = 0;
        let d = new Date();
        let suankiSaat = (d.getHours()<10 ? "0": "") + d.getHours() + ":" + (d.getMinutes()<10 ? "0": "") + d.getMinutes();
        let suankiGun = d.getDay();
        
        if (kart._gunler.gun.find(gun=>gun===day[suankiGun])) {
            //console.log("gün uyumlu kart id:",kart.id || kart.programID);      
            if (suankiSaat === kart._baslamaZamani) {
                console.log("basladi kart id:",kart.id || kart.programID );
                islemler.calis(kart,islemler.bekle);
                clearInterval(timers['no'+id])
            } else {
                console.log("saat gelmedi kart id:",kart.id || kart.programID);
            }
        } 
        else {
            console.log("gün uyumsuz kart id:",kart.id || kart.programID);
        }
        }, 2000);
        //tekrarIndis['no'+id] = 0;
    }
  },

  basla: function (kart) {
    var id = kart.id || kart.programID
    aktifKartlar.push(kart.id || kart.programID)
    //console.log(aktifKartlar)
    tekrarIndis['no'+id] = 0
    timers['no'+id] = setInterval(() => {
        let d = new Date();
        let suankiSaat = (d.getHours()<10 ? "0": "") + d.getHours() + ":" + (d.getMinutes()<10 ? "0": "") + d.getMinutes();
        console.log(suankiSaat)
        let suankiGun = d.getDay();
      
      if (kart._gunler.gun.find(gun=>gun===day[suankiGun])) {
          //console.log("gün uyumlu kart id:",kart.id || kart.programID);
      
          if (suankiSaat === kart._baslamaZamani) {
              console.log("basladi kart id:",kart.id || kart.programID );
              this.calis(kart,this.bekle);
              clearInterval(timers['no'+id])
          } else {
              console.log("saat gelmedi kart id:",kart.id || kart.programID);
          }
      } 
      else {
          console.log("gün uyumsuz kart id:",kart.id || kart.programID);
      }
      }, 2000);
    
  },
  durdur: function(kart){
      var id = kart.id || kart.programID      
      //console.log('silinmek icin gonderilen:',kart.id || kart.programID)
      //console.log('once:',aktifKartlar)
      if(aktifKartlar.find(item=>kart.id || kart.programID === item)){ 
        clearInterval(timers['no'+id]) //zamanın gelmesini bekleyen timer
        console.log('interval durdu')
        clearTimeout(calisTimers['no'+id]) //zaman gelmiş program çalışmaya başlamış, çalışma timerı
        console.log('calisma timerı durdu')
        clearTimeout(bekleTimers['no'+id]) //zaman gelmiş program çalışmaya başlamış,bekleme timerı
        console.log('bekleme timerı durdu')
      }
      aktifKartlar = aktifKartlar.filter(item=>item!==kart.id || kart.programID)
      console.log('sonra:',aktifKartlar)
      tekrarIndis['no'+id] = 0;
  },
};

module.exports = {islemler};
