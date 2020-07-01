let day = ["pazar","pazartesi","sali","carsamba","persembe","cuma","cumartesi"]
let aktifKartlar = []
let timers={} //zaman intervaller objesi
let calisTimers={} //çalışma intervaller objesi
let bekleTimers={} //bekleme intervaller objesi
let tekrarIndis={} //tekrar indisleri objesi (i)
var suHazirlama = require('./suHazirlama')
let pg = require("pg");

let pool = new pg.Pool({
  port: 5432,
  password: "159753",
  database: "postgres",
  host: "localhost",
  user: "postgres",
});



let islemler = {
  calis: function (kart, callback) {
    var id = kart.id || kart.programID
    console.log(kart.programAdi+' tekrar indis: '+tekrarIndis['no'+id])
    calisTimers['no'+id] = setTimeout(() => { //bu programa ait bir çalışma timerı oluştur
      callback(kart,this.again);
    }, kart._calismaSuresi*1000); 
  },
  bekle: function (kart, callback) {
    var id = kart.id || kart.programID
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
      dbdenSil(kart)
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
        let suankiGun = d.getDay();
      
      if (kart._gunler.gun.find(gun=>gun===day[suankiGun])) {
          //console.log("gün uyumlu kart id:",kart.id || kart.programID);
      
          if (suankiSaat === kart._baslamaZamani) {
              console.log("basladi kart id:",kart.id || kart.programID );
              this.calis(kart,this.bekle);
              dbyeYaz(kart)
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
        dbdenSil(kart)
      }
      aktifKartlar = aktifKartlar.filter(item=>item!==kart.id || kart.programID)
      console.log('sonra:',aktifKartlar)
      tekrarIndis['no'+id] = 0;
  },
};
function dbyeYaz(kart){
  let {programAdi,_calismaSuresi,_beklemeSuresi,_tekrar,_gunler,_baslamaZamani,_phSet,_ecSet,_valfler} = kart
  pool.connect((err, db, done) => {
    if (err) {
      return console.log(err)
    } else {
      db.query(
        'INSERT INTO public."CalisanProgramlar"("programAdi", "baslamaZamani", "calismaSuresiSaniye", "beklemeSuresiSaniye", "tekrar", "phSet", "ecSet", "Valfler", "Gunler") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);',
        [programAdi,_baslamaZamani,_calismaSuresi,_beklemeSuresi,_tekrar,_phSet,_ecSet,_valfler,_gunler],     
        (err) => {
          done()
          if (err) {      
            return console.log(err)
          } else {
            //db.end();
            console.log('veritabanına yazıldı')
          }
        }
      );
    }
  });
}
function dbdenSil(kart){
  let programAdi = kart.programAdi
  pool.connect((err, db, done) => {
    if (err) {
      return console.log(err)
    } else {
      db.query(
        'DELETE FROM public."CalisanProgramlar" WHERE "programAdi"= $1;',[programAdi],     
        (err) => {
          done()
          if (err) {      
            return console.log(err)
          } else {
            //db.end();
            console.log('veritabanından silindi')
          }
        }
      );
    }
  });
}

module.exports = {islemler};
