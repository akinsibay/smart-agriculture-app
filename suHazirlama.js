let aktifKartlar = []
let day = ["pazar","pazartesi","sali","carsamba","persembe","cuma","cumartesi"]
let timers={} //zaman intervaller objesi
let suSeviyesi = 0;
let seviyeKontrolInterval,ecPhKontrolInterval;
let pg = require("pg");
const deviceIP = require("./src/config/deviceIP");
let pool = new pg.Pool({
  port: 5432,
  password: "159753",
  database: "postgres",
  host: "localhost",
  user: "postgres",
});

var ModbusRTU = require("modbus-serial");
var wise = new ModbusRTU(); 

function run(kart){     
    var id = kart.id || kart.programID
    aktifKartlar.push(kart.id || kart.programID)
    //console.log(aktifKartlar)
    timers['no'+id] = setInterval(() => {
        let d = new Date();
        let suankiSaat = (d.getHours()<10 ? "0": "") + d.getHours() + ":" + (d.getMinutes()<10 ? "0": "") + d.getMinutes();
        let suankiGun = d.getDay();     
        if (kart._gunler.gun.find(gun=>gun===day[suankiGun])) {
            //console.log("gün uyumlu kart id:",kart.id || kart.programID);  
            if (suankiSaat === kart._baslamaZamani) {
                console.log("basladi kart id:",kart.id || kart.programID );
                clearInterval(timers['no'+id])
                wiseConnect(kart)
                             
            } else {
                console.log("su hazırlama saat gelmedi kart id:",kart.id || kart.programID);
            }
        } 
        else {
            console.log("su hazırlama gün uyumsuz kart id:",kart.id || kart.programID);
        }
        }, 2000);   
}

function wiseConnect(kart){
    wise.connectTCP(deviceIP.wiseIP,{port:502})
    .then(res=>{
        setTimeout(() => {
            console.log('wise connection OK')
            wiseRun(kart)   //wiseyi bu valf bilgileriyle sür 
        }, 1000);       
    })             
    .catch(error=>{console.log(error)})
}

function stop(kart){
    var {islemler} = require('./sulama')
    var id = kart.id || kart.programID
    console.log(id)
    console.log(aktifKartlar)      
      if(aktifKartlar.some(item=>(kart.id || kart.programID) === item)){ 
        clearInterval(timers['no'+id]) //zamanın gelmesini bekleyen timer
        clearInterval(seviyeKontrolInterval)
        clearInterval(ecPhKontrolInterval)
        console.log('intervaller durdu')
        islemler.durdur(kart)
        calisiyorBilgisiSil(kart)
        butunCikislarOFF()
      }
    aktifKartlar = aktifKartlar.filter(item=>item!==kart.id || kart.programID)
    console.log('aktif kartlar:',aktifKartlar)  
}

function wiseRun(kart){ 
    omniconSetGonder(kart,function(){
        valf1Ac(kart,function(){
            suSeviyeKontrol(function(){valf3Ac()},function(){valf1Kapat(function(){
                valf3Kapat(function(){
                    ecPhKontrol(kart,function(){
                        sulamayaBasla(kart)
                    })
                })
            })})
        })
    })
}

function omniconSetGonder(kart,cbValf1Ac){
    var phSet = kart._phSet
    var ecSet = kart._ecSet
    console.log('Omnicona gönderilen PH:'+phSet+' EC:'+ecSet)
    wise.readInputRegisters(1,1)
    .then(res=>{
        console.log(res.data)
        cbValf1Ac()   
    })
    .catch(err=>console.log(err))
}

function valf1Ac(kart,suSeviyeKontrol){
    console.log('Valf1 açılıyor ve sulama tankı dolduruluyor..')
    wise.writeCoil(16,1)
    .then(res=>{
        console.log('Valf 1 açıldı')
        calisiyorBilgisiEkle(kart)
        suSeviyeKontrol()   
    })
    .catch(err=>console.log(err))
}

function suSeviyeKontrol(cbValf3Ac,cbValf1Kapat){
    //var sensorLimit = 0
    console.log('Sensör bilgisi okunuyor..')
    seviyeKontrolInterval = setInterval(() => {
        //sensorLimit+=1
        wise.readInputRegisters(0,1)
        .then(res=>{
            console.log('Limit: '+res.data[0])

            if(res.data[0]>0 && res.data[0] < 20){
                console.log('Tank %20 seviyesine kadar dolduruluyor..')
            }
            if(res.data[0]>=100){
                console.log('Tank %20de. Valf 3 açılıyor..')                
                cbValf3Ac()               
            }
            if(res.data[0]>=400){
                console.log('Tank doldu. Valf 1 kapatılıyor..')                
                cbValf1Kapat(valf3Kapat)
                clearInterval(seviyeKontrolInterval)               
            }        
        })
        .catch(err=>console.log(err)) 
    }, 1000);     
}

function valf1Kapat(cbValf3Kapat){
    console.log('Valf1 kapatılıyor..')
    wise.writeCoil(16,0)
    .then(res=>{
        console.log('Valf 1 kapatıldı')
        cbValf3Kapat()   
    })
    .catch(err=>console.log(err))
}

function valf3Ac(){
    console.log('Valf3 açılıyor su karıştırılıyor..')
    wise.writeCoil(18,1)
    .then(res=>{
        console.log('Valf 3 açıldı')
        //ve motor start   
    })
    .catch(err=>console.log(err))
}

function valf3Kapat(cbEcPhKontrol){
    console.log('Valf3 kapatılıyor motor durduruluyor..')
    wise.writeCoil(18,0)
    .then(res=>{
        console.log('Valf 3 kapatıldı')
        cbEcPhKontrol()
        //ve motor start   
    })
    .catch(err=>console.log(err))
}

function ecPhKontrol(kart,cbSulamayaBasla){
    var phSet = kart._phSet
    var ecSet = kart._ecSet
    console.log('PH Set:'+phSet)
    console.log('EC Set:'+ecSet)
    var olcum =0;
    console.log('Omnicondan ph ec set değere ulaştı mı diye sorgulanıyor..')
    ecPhKontrolInterval = setInterval(() => {
        olcum+=1
        console.log(olcum)
        wise.readInputRegisters(1,2) //quantity 2 çünkü ec ph tek sorguda dizi gelsin istedim
        .then(res=>{
            console.log(res.data)
            if(olcum >= phSet && olcum >=ecSet){
                console.log('ph ec ayarlandı valf 2 açılıyor..')
                clearInterval(ecPhKontrolInterval)
                cbSulamayaBasla()
            }  
        })
        .catch(err=>console.log(err)) 
    }, 1000);  
}

function valf2Ac(kart){
    console.log('valf 2 açılıyor..')
    wise.writeCoil(17,1)
    .then(res=>{
        console.log('Valf 2 açıldı')
    })
    .catch(err=>console.log(err))
}

function valf2Kapat(kart){
    console.log('valf 2 kapatılıyor..')
    wise.writeCoil(17,0)
    .then(res=>{
        console.log('Valf 2 kapatıldı')
    })
    .catch(err=>console.log(err))
}

function sulamayaBasla(kart){
    var {islemler} = require('./sulama')
    islemler.basla(kart)
}

function calisiyorBilgisiEkle(kart){
    console.log(kart)
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

function calisiyorBilgisiSil(kart){
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

function anlikSuSeviyeKontrol(){
    setInterval(() => {
        wise.readInputRegisters(2,1)
        .then(res=>{
           suSeviyesi = res.data[0]   
        })
        .catch(err=>console.log(err)) 
    }, 5000);
}

function butunCikislarOFF(){
    wise.writeCoil(16,0)
    .then(res=>{
        console.log('Valf 1 kapatıldı')
        wise.writeCoil(17,0)
        .then(res=>{
            console.log('Valf 2 kapatıldı')
            wise.writeCoil(18,0)
            .then(res=>console.log('Valf 3 kapatıldı'))
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
}

exports.run = run
exports.stop = stop
exports.valf2Ac = valf2Ac
exports.valf2Kapat = valf2Kapat
exports.calisiyorBilgisiEkle = calisiyorBilgisiEkle
exports.calisiyorBilgisiSil = calisiyorBilgisiSil
exports.anlikSuSeviyeKontrol = anlikSuSeviyeKontrol
exports.wiseConnect = wiseConnect
exports.suSeviyesi = suSeviyesi
