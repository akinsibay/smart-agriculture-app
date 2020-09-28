let day = ["PZ","PZT","SL","CRS","PRS","CM","CMT"]//let aktifKartlar = []
let timers={} //zaman intervaller objesi
let calisTimers={} //çalışma intervaller objesi
let bekleTimers={} //bekleme intervaller objesi
let tekrarIndis={} //tekrar indisleri objesi (i)
let litre,ph,ec;
var suHazirlama = require('./suHazirlama')
var moment = require('moment')
const log = require('./log')
var mail = require('./src/config/mail')
let pg = require("pg");
let pool = new pg.Pool({
  port: 5432,
  password: "apra",
  database: "postgres",
  host: "localhost",
  user: "postgres",
});

let islemler = {
  calis: function (kart, callback) {
    var id = kart.id || kart.programID
    console.log(kart.programAdi+' çalışıyor. Tekrar indis: '+tekrarIndis['no'+id])
    log.toDb(kart.programAdi+' programının '+ Number(tekrarIndis['no'+id]+1)+'. sulaması başladı. Kalan sulama adedi: '+Number(Number(kart._tekrar)-Number(tekrarIndis['no'+id]+1)),200)
    islemler.tekrarArttir(id,Number(tekrarIndis['no'+id]+1))

    suHazirlama.valf2MotorAc()
    //suHazirlama.dozajlamaPompalariOff()
    calisTimers['no'+id] = setTimeout(() => { //bu programa ait bir çalışma timerı oluştur
      callback(kart,this.again);
    }, kart._calismaSuresi*1000); 
  },
  bekle: function (kart, callback) {
    var id = kart.id || kart.programID
    console.log(kart.programAdi+' bekliyor')
    suHazirlama.sonVeriCek() //rapor için
    //log.toDb(kart.programAdi+' programının '+ Number(tekrarIndis['no'+id]+1)+'. sulaması tamamlandı. Kalan sulama adedi: '+Number(Number(kart._tekrar)-Number(tekrarIndis['no'+id]+1))+' PH: '+ph+' EC: '+ ec+' Kalan su: '+litre+' litre',300)

    
    suHazirlama.valf2MotorKapat()
    if(tekrarIndis['no'+id] < kart._tekrar - 1){ //program bittiğinde yine beklememesi için
      console.log('Sıradaki Sulama Saati : '+moment().add(kart._beklemeSuresi/3600,'hours').format('HH:mm'))
      log.toDb(kart.programAdi+' programının '+ Number(tekrarIndis['no'+id]+1)+'. sulaması tamamlandı. Kalan sulama adedi: '+Number(Number(kart._tekrar)-Number(tekrarIndis['no'+id]+1))+' PH: '+ph+' EC: '+ ec+' Kalan su: '+litre+' litre'+' Sıradaki Sulama Saati : '+moment().add(kart._beklemeSuresi/3600,'hours').format('HH:mm'),300)
      mail.mailAt("Sulama Bilgisi",kart.programAdi+' programının '+ Number(tekrarIndis['no'+id]+1)+'. sulaması tamamlandı. Kalan sulama adedi: '+Number(Number(kart._tekrar)-Number(tekrarIndis['no'+id]+1))+' PH: '+ph+' EC: '+ ec+' Kalan su: '+litre+' litre'+' Sıradaki Sulama Saati : '+moment().add(kart._beklemeSuresi/3600,'hours').format('HH:mm'))
      bekleTimers['no'+id] = setTimeout(() => { //bu programa ait bir bekleme timerı oluştur
        callback(kart);
      }, kart._beklemeSuresi*1000);
    }
    else{
      log.toDb(kart.programAdi+' programının '+ Number(tekrarIndis['no'+id]+1)+'. sulaması tamamlandı. Kalan sulama adedi: '+Number(Number(kart._tekrar)-Number(tekrarIndis['no'+id]+1))+' PH: '+ph+' EC: '+ ec+' Kalan su: '+litre+' litre'+' Sıradaki Sulama Saati : '+kart._baslamaZamani,300)
      callback(kart)
    }
  },
  again: function (kart) {
    var id = kart.id || kart.programID   
    if (tekrarIndis['no'+id] < kart._tekrar - 1) {     
      tekrarIndis['no'+id]+=1;
      islemler.calis(kart,islemler.bekle);
    }
    else{
      console.log(kart.programAdi+' program bitti!!')
      log.toDb(kart.programAdi+' programının bugünlük tüm sulamaları tamamlandı. Yapılan sulama adedi: '+Number(tekrarIndis['no'+id]+1)+' Sonraki Sulama Saati: '+kart._baslamaZamani,200)
      mail.mailAt("Sulama Bilgisi",kart.programAdi+' programının bugünlük tüm sulamaları tamamlandı. Yapılan sulama adedi: '+Number(tekrarIndis['no'+id]+1)+' Sonraki Sulama Saati: '+kart._baslamaZamani)
      //suHazirlama.calisiyorBilgisiSil(kart)

      tankiDoldur(kart)

      //suHazirlama.dozajlamaPompalariOff() //burası test edilecek
      timers['no'+id] = setInterval(() => {
        console.log(kart.programAdi+' tekrar sorgulanıyor...')
        //tekrarIndis['no'+id] = 0;
        //islemler.tekrarArttir(id,tekrarIndis['no'+id])

        let d = new Date();
        let suankiSaat = (d.getHours()<10 ? "0": "") + d.getHours() + ":" + (d.getMinutes()<10 ? "0": "") + d.getMinutes();
        let suankiGun = d.getDay();
        
        if (kart._gunler.gun.find(gun=>gun===day[suankiGun])) {
            //console.log("gün uyumlu kart id:",kart.id || kart.programID);      
            if (suankiSaat === kart._baslamaZamani) {
                console.log("sulama basladi kart id:",kart.id || kart.programID );
                console.log(litre)
                if(litre >= 100){
                  islemler.calis(kart,islemler.bekle);
                  tekrarIndis['no'+id] = 0;
                  islemler.tekrarArttir(id,tekrarIndis['no'+id])
                  clearInterval(timers['no'+id])
                }
                else{
                  console.log('Su seviyesi yetersiz. Su hazırlanıyor...')
                  log.toDb('Su seviyesi yetersiz. Tekrar su hazırlanıyor...',300)
                  suHazirlama.processRun(kart) //tekrar su hazırlamaya başla
                  tekrarIndis['no'+id] = 0;
                  islemler.tekrarArttir(id,tekrarIndis['no'+id])
                  clearInterval(timers['no'+id])
                }               
                
            } else {
                console.log("sulama saat gelmedi kart id:",kart.id || kart.programID);
                log.toDb("Programın bugünlük sulaması tamamlandı. Tekrar sulama saatinin gelmesi bekleniyor. Sulama Saati :"+kart._baslamaZamani,300)
            }
        } 
        else {
            console.log("sulama gün uyumsuz kart id:",kart.id || kart.programID);
            log.toDb("Programın bugünlük sulaması tamamlandı. Tekrar sulama gününün gelmesi bekleniyor...",300)
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
      log.toDb('Sulama durduruldu.',300)
      var id = kart.id || kart.programID
      console.log('sulama timerı durdu')
      clearInterval(timers['no'+id])      
      clearTimeout(calisTimers['no'+id]) //zaman gelmiş program çalışmaya başlamış, çalışma timerı
      console.log('calisma timerı durdu')
      clearTimeout(bekleTimers['no'+id]) //zaman gelmiş program çalışmaya başlamış,bekleme timerı
      console.log('bekleme timerı durdu')
      tekrarIndis['no'+id] = 0;
      islemler.tekrarArttir(id,tekrarIndis['no'+id])
  },
  tekrarArttir: function (id,tekrar){
    pool.connect((err, db, done) => {
      if (err) {
        console.log(err)
      } else {
        db.query('UPDATE public."Tekrar" SET "programID"=$1, "tekrarAdet"=$2 WHERE "ID"=1;',
        [id,tekrar], function (err) {
          done();
          if (err) {
            console.log(err)
          } else {
              console.log('tekrar updated')
          }
        });
      }
    });
  }
};

function tankiDoldur(kart){
  suHazirlama.valf1Ac(kart,function(){
    suHazirlama.suSeviyeKontrol(kart,function(){suHazirlama.valf3Ac(function(){suHazirlama.motorStart()})},function(){suHazirlama.valf1Kapat(function(){
      suHazirlama.valf3Kapat(function(){
        suHazirlama.motorStop()
        })
    })})
  })
}

setInterval(() => {
  suHazirlama.sahaParametreleri((gelen)=>{
    litre = gelen[0]
    ph = gelen[1]
    ec = gelen[2]
  })
}, 2000);


module.exports = {islemler};
