let day = ["pazar","pazartesi","sali","carsamba","persembe","cuma","cumartesi"]
//let aktifKartlar = []
let timers={} //zaman intervaller objesi
let calisTimers={} //çalışma intervaller objesi
let bekleTimers={} //bekleme intervaller objesi
let tekrarIndis={} //tekrar indisleri objesi (i)
var suHazirlama = require('./suHazirlama')

let islemler = {
  calis: function (kart, callback) {
    var id = kart.id || kart.programID
    console.log(kart.programAdi+' çalışıyor. Tekrar indis: '+tekrarIndis['no'+id])
    suHazirlama.valf2Ac()
    calisTimers['no'+id] = setTimeout(() => { //bu programa ait bir çalışma timerı oluştur
      callback(kart,this.again);
    }, kart._calismaSuresi*1000); 
  },
  bekle: function (kart, callback) {
    var id = kart.id || kart.programID
    console.log(kart.programAdi+' bekliyor')
    suHazirlama.valf2Kapat()
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
      suHazirlama.calisiyorBilgisiSil(kart)  
      timers['no'+id] = setInterval(() => {
        console.log(kart.programAdi+' tekrar sorgulanıyor...')
        tekrarIndis['no'+id] = 0;
        let d = new Date();
        let suankiSaat = (d.getHours()<10 ? "0": "") + d.getHours() + ":" + (d.getMinutes()<10 ? "0": "") + d.getMinutes();
        let suankiGun = d.getDay();
        
        if (kart._gunler.gun.find(gun=>gun===day[suankiGun])) {
            //console.log("gün uyumlu kart id:",kart.id || kart.programID);      
            if (suankiSaat === kart._baslamaZamani) {
                console.log("sulama basladi kart id:",kart.id || kart.programID );
                console.log(suHazirlama.suSeviyesi)
                if(suHazirlama.suSeviyesi > 0){
                  islemler.calis(kart,islemler.bekle);
                  tekrarIndis['no'+id] = 0;
                  clearInterval(timers['no'+id])
                }
                else{
                  console.log('Su seviyesi programı başlatmak için uygun değil!')
                  suHazirlama.wiseConnect(kart) //tekrar su hazırlamaya başla
                  tekrarIndis['no'+id] = 0;
                  clearInterval(timers['no'+id])
                }               
                
            } else {
                console.log("sulama saat gelmedi kart id:",kart.id || kart.programID);
            }
        } 
        else {
            console.log("sulama gün uyumsuz kart id:",kart.id || kart.programID);
        }
        }, 2000);
        
    }
  },

  basla: function(kart){
      var id = kart.id || kart.programID
      tekrarIndis['no'+id] = 0
      this.calis(kart,this.bekle);
      //dbyeYaz(kart)            
  },
  durdur: function(kart){
      var id = kart.id || kart.programID
      console.log('sulama timerı durdu')
      clearInterval(timers['no'+id])      
      clearTimeout(calisTimers['no'+id]) //zaman gelmiş program çalışmaya başlamış, çalışma timerı
      console.log('calisma timerı durdu')
      clearTimeout(bekleTimers['no'+id]) //zaman gelmiş program çalışmaya başlamış,bekleme timerı
      console.log('bekleme timerı durdu')
      tekrarIndis['no'+id] = 0;
  },
};


module.exports = {islemler};
