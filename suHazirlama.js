let aktifKartlar = []
let day = ["PZ","PZT","SL","CRS","PRS","CM","CMT"]
let timers={} //zaman intervaller objesi
let suSeviyesi=0;
let phSet,ecSet;
let seviyeKontrolInterval,ecPhKontrolInterval,ecPhKontrolTimeOut,ekstraSuAlmaTimeOut,ecPhDozajlamaInterval;
let asitTimeout,gubreTimeout,suTimeout,asitBekleTimeout,gubreBekleTimeout,suBekleTimeout,baslaTimeout;
let phTolerans,ecTolerans,suAlmaSuresi;
let tankDoluyor = 0
let sonVeriler;
let pg = require("pg");
let axios = require('axios')
let ip = require('ip')
let pcIP = ip.address()
const serverUrl = 'http://localhost:3001'
const deviceIP = require("./src/config/deviceIP");
const log = require('./log')
var mail = require('./src/config/mail')
let pool = new pg.Pool({
  port: 5432,
  password: "apra",
  database: "postgres",
  host: "localhost",
  user: "postgres",
});

var ModbusRTU = require("modbus-serial");
var wise = new ModbusRTU(); 
var omnicon = new ModbusRTU(); 
omnicon.setTimeout(3000)
function run(kart){
    //console.log(kart)
    calisiyorBilgisiEkle(kart)
    phSet = Number(Number(kart._phSet).toFixed(2))  
    ecSet = Number(Number(kart._ecSet).toFixed(2))
    console.log(phSet)  
    console.log(ecSet)
    //ecPhDozajlama(phSet,ecSet)
    dozajFuncs.basla(phSet,ecSet)  
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
                processRun(kart)                         
            } else {
                console.log("su hazırlama saat gelmedi kart id:",kart.id || kart.programID);
                log.toDb(kart.programAdi+" programının su hazırlama saatinin gelmesi bekleniyor. Başlama Saati: "+kart._baslamaZamani,300)
            }
        } 
        else {
            console.log("su hazırlama gün uyumsuz kart id:",kart.id || kart.programID);
            log.toDb(kart.programAdi+" programının su hazırlama gününün gelmesi bekleniyor...",300)
        }
        }, 2000);   
}

function deviceConnect(){
    console.log('device connect func')
    if(!wise.isOpen || !omnicon.isOpen){
        console.log('device connect if')
        wise.connectTCP(deviceIP.wiseIP,{port:502})
        .then(res=>{
            console.log('SU HAZIRLAMA İÇİN WISE CONNECTION OK')
            omnicon.connectTCP(deviceIP.omniconIP,{port:502})
            .then(res=>{
                setTimeout(() => {
                    console.log('\x1b[33m','device connection OK')
                    //dozajlamaPompalariOn()   
                }, 1000);
            })
            .catch(err=>console.log('device connection NOKKK'))              
        })             
        .catch(error=>{console.log(error)})
    }
    else{
        console.log('device connect else')
        //processRun(kart)
    }   
}

setInterval(() => {
  console.log('TANK DOLUYOR: '+tankDoluyor)
}, 2000);

function stop(kart){
    var {islemler} = require('./sulama')
    var id = kart.id || kart.programID
    console.log(id)
    console.log(aktifKartlar)      
      if(aktifKartlar.some(item=>(kart.id || kart.programID) === item)){ 
        clearInterval(timers['no'+id]) //zamanın gelmesini bekleyen timer
        clearInterval(seviyeKontrolInterval)
        clearInterval(ecPhKontrolInterval)
        clearTimeout(ecPhKontrolTimeOut)
        clearInterval(ecPhDozajlamaInterval)
        console.log('intervaller ve timeout durdu')
        islemler.durdur(kart)
        calisiyorBilgisiSil(kart)
        butunCikislarOFF()
        clearTimeout(asitTimeout)
        clearTimeout(gubreTimeout)
        clearTimeout(suTimeout)
        clearTimeout(asitBekleTimeout)
        clearTimeout(gubreBekleTimeout)
        clearTimeout(suBekleTimeout)
        clearTimeout(baslaTimeout)
        tankDoluyor=0
        // let omniconDefaultSet = {_phSet:12,_ecSet:0}
        // omniconSetGonder(omniconDefaultSet)
        //dozajlamaPompalariOff()
      }
    aktifKartlar = aktifKartlar.filter(item=>item!==kart.id || kart.programID)
    console.log('aktif kartlar:',aktifKartlar)  
}

function processRun(kart){ 
    omniconSetGonder(kart,function(){
        valf1Ac(kart,function(){
            suSeviyeKontrol(kart,function(){valf3Ac(function(){motorStart()})},function(){valf1Kapat(kart,function(){
                valf3Kapat(function(){
                    motorStop(function(){
                        ecPhKontrol(kart,function(){
                            sulamayaBasla(kart)
                        })
                    })
                })
            })})
        })
    })
}

function omniconSetGonder(kart,cbValf1Ac){
    console.log('omnicon set gönder func')
    var phSet = Number(Number(kart._phSet).toFixed(2))
    var ecSet = Number(Number(kart._ecSet).toFixed(2))
    var phSetGonderilen = phSet*1.02 //%2 fazlasını omnicona gönder
    var ecSetGonderilen = ecSet*0.95 //%20 azını omnicona gönder
    console.log('Omnicona gönderilen PH:'+phSetGonderilen+' EC:'+ecSetGonderilen)
    omnicon.writeRegisters(7,[phSetGonderilen*100])
    .then(res=>{
        omnicon.writeRegisters(10,[ecSetGonderilen])
        .then(res=>{
            console.log('Omnicona set değerleri yazıldı')
            log.toDb('Omnicona set gönderildi. PH:'+phSet+' EC:'+ecSet,200)
            if(suSeviyesi<Number(kart._sirkulasyonSeviye)){
              cbValf1Ac() 
            }
            else{
              ecPhKontrol(kart,function(){sulamayaBasla(kart)})
            }
        })
        .catch(err=>console.log(err))         
    })
    .catch(err=>{
        console.log(err)
        log.toDb('Omnicona set değeri gönderilirken hata!',400)
    })
}

function valf1Ac(kart,suSeviyeKontrol){
    console.log('Valf1 açılıyor ve sulama tankı dolduruluyor..')
    tankDoluyor = 1
    wise.writeCoil(16,1)
    .then(res=>{
        console.log('Valf 1 açıldı')
        log.toDb("Tanka su alınıyor...",300)
        suSeviyeKontrol()   
    })
    .catch(err=>{
        console.log(err)
    })   
}

function suSeviyeKontrol(kart,cbValf3Ac,cbValf1Kapat){
    console.log('Sensör bilgisi okunuyor..')
    let sirkulasyonSeviyesi = Number(kart._sirkulasyonSeviye)
    let dolmaSeviyesi = Number(kart._dolmaSeviye)
    phSet = Number(Number(kart._phSet).toFixed(2))  
    ecSet = Number(Number(kart._ecSet).toFixed(2))
    seviyeKontrolInterval = setInterval(() => {
        wise.readInputRegisters(0,1)
        .then(res=>{
            let sensorAnlik =  Number(((res.data[0]*100)/4095).toFixed(1))
            if(sensorAnlik<sirkulasyonSeviyesi){
                console.log('\x1b[33m','Tank seviyesi sirkülasyon seviyesinin altında..')
                log.toDb("Tank dolduruluyor...",300)           
            }
            if(sensorAnlik>=sirkulasyonSeviyesi){
                console.log('\x1b[33m','Tank %'+sirkulasyonSeviyesi+'de. Valf 3 açılıyor..')
                log.toDb("Tank sirkülasyon seviyesinde. Sirkülasyon başladı.",200)                
                cbValf3Ac()
                console.log('SİRKÜLASYON SEVİYESİ: '+sirkulasyonSeviyesi)                      
                console.log('SENSÖR ANLIK: '+sensorAnlik)                      
            }
            if(sensorAnlik>=dolmaSeviyesi){
                console.log('\x1b[33m','Tank doldu. Valf 1 kapatılıyor..')
                log.toDb("Tank dolduruldu.",200)                
                cbValf1Kapat(valf3Kapat)
                clearInterval(seviyeKontrolInterval)
                //dozajFuncs.basla(phSet,ecSet)
                tankDoluyor = 0              
            }        
        })
        .catch(err=>{
            console.log(err)
            log.toDb("Su seviye kontrol esnasında haberleşme hatası. Sistem duruyor!",400)
        }) 
    }, 1000);     
}

function valf1Kapat(kart,cbValf3Kapat){
    console.log('Valf1 kapatılıyor..')
    console.log('VALF1 KAPATILDIIIIII!!!!!!!!!!!11')
    let phSetG = Number(Number(kart._phSet).toFixed(2))  
    let ecSetG = Number(Number(kart._ecSet).toFixed(2))
    console.log(kart)
    //dozajFuncs.basla(phSetG,ecSetG)
    wise.writeCoil(16,0)
    .then(res=>{
        console.log('Valf 1 kapatıldı')
        cbValf3Kapat()   
    })
    .catch(err=>{
        console.log(err)
    })
}

function valf3Ac(cbMotorStart){
    //console.log('Valf3 açılıyor su karıştırılıyor..')
    wise.writeCoil(18,1)
    .then(res=>{
        console.log('Valf 3 açıldı')
        cbMotorStart()   
    })
    .catch(err=>{
        console.log(err)
    })
}

function motorStart(){
    wise.writeCoil(19,1)
    .then(res=>{
        console.log('Motor çalıştırıldı')  
    })
    .catch(err=>{
        console.log(err)
    })
}

function valf3Kapat(cbMotorStop){
    console.log('Valf3 kapatılıyor motor durduruluyor..')
    wise.writeCoil(18,0)
    .then(res=>{
        console.log('Valf 3 kapatıldı')
        cbMotorStop()          
    })
    .catch(err=>{
        console.log(err)
    })
}

function motorStop(cbEcPhKontrol){
    console.log('Valf3 kapatılıyor motor durduruluyor..')
    wise.writeCoil(19,0)
    .then(res=>{
        console.log('Motor durduruldu')
        cbEcPhKontrol()   
    })
    .catch(err=>{
        console.log(err)
    })
}

function valf2MotorAc(kart){ //bu dosyadan erişim yok, sulama dosyasından erişiliyor

    if(!wise.isOpen){
        wise.connectTCP(deviceIP.wiseIP,{port:502})
        .then(res=>console.log('sulama için wise connection OK'))
        .catch(err=>console.log('sulama için wise bağlantısı açılamadı'))
    }
    else{
        console.log('valf 2 açılıyor..')
        wise.writeCoil(17,1)
        .then(res=>{
            console.log('Valf 2 açıldı')
            wise.writeCoil(19,1)
            .then(res=>{
            console.log('Motor çalıştırıldı')  
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>{
            console.log(err)
        })
    }   
}

function valf2MotorKapat(kart){ //bu dosyadan erişim yok, sulama dosyasından erişiliyor
    if(!wise.isOpen){
        wise.connectTCP(deviceIP.wiseIP,{port:502})
        .then(res=>console.log('sulama için wise connection OK'))
        .catch(err=>{
            console.log('sulama için wise bağlantısı açılamadı')
            log.toDb("Sulama için WISE cihazına bağlanılamadı. Sistem duruyor!",400)
        })
    }
    else{
        console.log('Motor kapatılıyor..')
        wise.writeCoil(19,0)
        .then(res=>{
            console.log('Motor kapatıldı')
            setTimeout(() => {
                wise.writeCoil(17,0)
                .then(res=>{
                console.log('Valf 2 kapatıldı')  
                })
                .catch(err=>console.log(err))  
            }, 8000);          
        })
        .catch(err=>{
            console.log(err)
            log.toDb("Sulama için WISE cihazına bağlanılamadı. Sistem duruyor!",400)
        })  
    }    
}

function sulamayaBasla(kart){
    var {islemler} = require('./sulama')
    clearTimeout(ecPhKontrolTimeOut)
    islemler.basla(kart)
}

function calisiyorBilgisiEkle(kart){
    let {programAdi,_calismaSuresi,_beklemeSuresi,_tekrar,_gunler,_baslamaZamani,_phSet,_ecSet,_valfler,_sirkulasyonSeviye,_dolmaSeviye} = kart
    pool.connect((err, db, done) => {
      if (err) {
        return console.log(err)
      } else {
        db.query(
          'INSERT INTO public."CalisanProgramlar"("programAdi", "baslamaZamani", "calismaSuresiSaniye", "beklemeSuresiSaniye", "tekrar", "phSet", "ecSet", "Valfler", "Gunler","sirkulasyonSeviye","dolmaSeviye") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11);',
          [programAdi,_baslamaZamani,_calismaSuresi,_beklemeSuresi,_tekrar,_phSet,_ecSet,_valfler,_gunler,_sirkulasyonSeviye,_dolmaSeviye],     
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

function butunCikislarOFF(){
    wise.writeCoil(16,0)
    .then(res=>{
        console.log('Valf 1 kapatıldı')
        wise.writeCoil(17,0)
        .then(res=>{
            console.log('Valf 2 kapatıldı')
            wise.writeCoil(18,0)
            .then(res=>{
                console.log('Valf 3 kapatıldı')
                wise.writeCoil(19,0)
                .then(res=>console.log('Motor durduruldu'))
                .catch(err=>console.log(err))
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
}

function dozajlamaPompalariOff(){
    if(!omnicon.isOpen){
        omnicon.connectTCP(deviceIP.omniconIP,{port:502})
        .then(res=>{
            omnicon.writeRegisters(9,[0])
            .then(res=>{
                console.log('ec pompası durduruldu')
                omnicon.writeRegisters(6,[0])
                .then(res=>{
                    console.log('ph pompası durduruldu')
                    //omnicon.close()
                })
                .catch(err=>{
                    console.log('ph pompası DURDURULAMADI!!!')
                    log.toDb("PH pompası durdurulamadı!",400)
                })
            })
            .catch(err=>{
                console.log('ec pompası DURDURULAMADI!!')
                log.toDb("EC pompası durdurulamadı!",400)
            })
        })
        .catch(err=>console.log('pompaları durdurmak için omnicona bağlanırken HATA!!! '))
    }
    else{
        omnicon.writeRegisters(9,[0])
        .then(res=>{
            console.log('ec pompası durduruldu')
            omnicon.writeRegisters(6,[0])
            .then(res=>{
                console.log('ph pompası durduruldu')
                //omnicon.close()
            })
            .catch(err=>{
                console.log('ph pompası DURDURULAMADI!!!')
                log.toDb("PH pompası durdurulamadı!",400)
            })
        })
        .catch(err=>{
            console.log('ec pompası DURDURULAMADI!!')
            log.toDb("EC pompası durdurulamadı!",400)
        })
    }
}

function dozajlamaPompalariOn(){
    if(!omnicon.isOpen){
        omnicon.connectTCP(deviceIP.omniconIP,{port:502})
        .then(res=>{
            omnicon.writeRegisters(9,[1])
            .then(res=>{
                console.log('ec pompası çalıştırıldı')
                omnicon.writeRegisters(6,[1])
                .then(res=>console.log('ph pompası çalıştırıldı'))
                .catch(err=>console.log('ph pompası ÇALIŞTIRILAMADI!!!'))
            })
            .catch(err=>console.log('ec pompası ÇALIŞTIRILAMADI!!'))
        })
        .catch(err=>console.log('pompaları çalıştırmadk için omnicona bağlanırken HATA!!! '))
    }
    else{
        omnicon.writeRegisters(9,[1])
        .then(res=>{
            console.log('ec pompası çalıştırıldı')
            omnicon.writeRegisters(6,[1])
            .then(res=>{
                console.log('ph pompası çalıştırıldı')
                //omnicon.close()
            })
            .catch(err=>console.log('ph pompası ÇALIŞTIRILAMADI!!!'))
        })
        .catch(err=>console.log('ec pompası ÇALIŞTIRILAMADI!!'))
    }
}

function suSeviyeOlc(){
    setInterval(() => {
        pool.connect((err, db, done) => {
            if (err) {
              console.log("su seviyesi için veri tabanına bağlanılırken hata oluştu!!!")
            } else {
              db.query('SELECT "TankSeviye" from public."Veriler" order by "ID" DESC LIMIT 1', function (err, table) {
                done();
                if (err) {
                  console.log("su seviyesi veri tabanından okunurken hata!!")
                } else {
                  //db.end()
                  suSeviyesi = table.rows[0].TankSeviye
                  console.log("Su Seviyesi: "+suSeviyesi)            
                }
              });
            }
        }); 
    }, 10000);
}


function ekstraSuAl(){
    console.log('Valf1 açılıyor ve estra su alınıyor..')
    wise.writeCoil(16,1)
    .then(res=>{
        console.log('su alınıyor...')
    })
    .catch(err=>console.log(err))
}

function ekstraSuAlmayiDurdur(){
    console.log('Valf1 kapatılıyor ve estra su alma durduruluyor..')
    wise.writeCoil(16,0)
    .then(res=>{
        console.log('su alımı durdu...')     
    })
    .catch(err=>console.log(err))
}

suSeviyeOlc()

function anlikVeriCek(cb){ //sadece serverdan erişim
        wise.readInputRegisters(0,4)
            .then(resp=>{
              let wiseValues = resp.data
              omnicon.readHoldingRegisters(0,15)
              .then(resp=>{
                let ph=resp.data[0]
                let ec=resp.data[1]
                let asitStatus=resp.data[6]
                let gubreStatus=resp.data[9]
                wise.readCoils(16,4)
                .then(resp=>{
                  let anaSuValfi = resp.data[0]
                  let sulamaValfi = resp.data[1]
                  let sirkulasyonValfi = resp.data[2]
                  let sulamaPompasi = resp.data[3]
                  let allValues = [ph,ec,...wiseValues]
                  let toFrontEnd = [ph,ec,...wiseValues,asitStatus,gubreStatus,anaSuValfi,sulamaValfi,sirkulasyonValfi,sulamaPompasi]
                  anlikVeriYaz(allValues)
                  cb(toFrontEnd)
                })
                .catch(err=>console.log('Wise DO okunurken hata'))              
              })
              .catch(err=>{
                console.log('omnicondan okuma error')
                 cb('error')
              })        
            })
            .catch(err=>{
              console.log('wisedan okuma error')
              cb('error')
            })
}

deviceConnect()

function anlikVeriYaz(datalar){
    let now = new Date()
    let kayitZamani = now.toLocaleString();
    let ph = datalar[0]/100
    let ec = datalar[1] 
    let tankSeviyesi = Number(((datalar[2]*100)/4095).toFixed(1))
    pool.connect((err, db, done) => {
        if (err) {
          return console.log(err)
        } else {
          db.query(
            'INSERT INTO public."Veriler"("PH", "EC", "TankSeviye", "Zaman") VALUES ($1, $2, $3, $4);',
            [ph,ec,tankSeviyesi,kayitZamani],     
            (err) => {
              done()
              if (err) {      
                return console.log(err)
              } else {
                //db.end();
                //console.log('veritabanına yazıldı')
              }
            }
          );
        }
      });
}

function sonVeriCek(){
    let now = new Date()
    let kayitZamani = now.toLocaleString();
    pool.connect((err, db, done) => {
        if (err) {
          console.log('rapor için son veri çekilirken hata')
        } else {
          db.query('SELECT "PH","EC","TankSeviye" from public."Veriler" ORDER BY "ID" DESC LIMIT 1', function (err, table) {
            done();
            if (err) {
              console.log('son veri çekerken hata')
            } else {
              //db.end()
                sulamaRaporuYaz(table.rows,kayitZamani)            
            }
          });
        }
      });
}

function sulamaRaporuYaz(sonVeriler,zaman){
    pool.connect((err, db, done) => {
        if (err) {
          console.log('sulama raporu yazarken hata');
        } else {
          db.query(
            'INSERT INTO public."Rapor"("SulamaZamani", "PH", "EC", "TankSeviyesi","Zaman") VALUES ($1, $2, $3, $4, $5);',
            [zaman,sonVeriler[0].PH,sonVeriler[0].EC,sonVeriler[0].TankSeviye,zaman],
            (err) => {
              done()
              if (err) {
                console.log(err);
              } else {
                console.log("Rapor verisi eklendi");
                //db.end();
              }
            }
          );
        }
    });
}

function asitPompasi(cb,output){
    if(output === 0)
    {
      omnicon.writeRegisters(6,[0])
      .then(response=>{
        console.log('Asit pompası Off')
        log.toDb("Asit pompası manuel olarak kapatıldı",200)
        //omnicon.close()
        cb('Asit pompası off')
      })
      .catch(err=>{
        console.log(err)
        cb('error')
      })
    }
    if(output === 1)
    {
        console.log('1 olduğunu algıladımm')
      omnicon.writeRegisters(6,[1])
      .then(response=>{
        console.log('Asit pompası Auto')
        log.toDb("Asit pompası manuel olarak otomatik moda alındı",200)
        //omnicon.close()
        cb('Asit pompası auto')
      })
      .catch(err=>{
        console.log(err)
        cb('error')
      })
    }
    if(output === 2)
    {
      omnicon.writeRegisters(6,[2])
      .then(response=>{
        console.log('Asit pompası On')
        log.toDb("Asit pompası manuel olarak açıldı",200)
        //omnicon.close()
        cb('Asit pompası on')
      })
      .catch(err=>{
        console.log(err)
        cb('error')
      })
    }
}

function gubrePompasi(cb,output){
    if(output === 0)
    {
      omnicon.writeRegisters(9,[0])
      .then(response=>{
        console.log('gübre pompası Off')
        log.toDb("Gübre pompası manuel olarak kapatıldı",200)
        //omnicon.close()
        cb('Gübre pompası off')
      })
      .catch(err=>{
        console.log(err)
        cb('error')
      })
    }
    if(output === 1)
    {
      omnicon.writeRegisters(9,[1])
      .then(response=>{
        console.log('Gübre pompası Auto')
        log.toDb("Gübre pompası manuel olarak otomatik moda alındı",200)
        //omnicon.close()
        cb('gübre pompası auto')
      })
      .catch(err=>{
        console.log(err)
        cb('error')
      })
    }
    if(output === 2)
    {
      omnicon.writeRegisters(9,[2])
      .then(response=>{
        console.log('Gübre pompası On')
        log.toDb("Gübre pompası manuel olarak açıldı",200)
        //omnicon.close()
        cb('gübre pompası on')
      })
      .catch(err=>{
        console.log(err)
        cb('error')
      })
    }
}

function toleransAyarlariniAl(cb){
  pool.connect((err, db, done) => {
    if (err) {
      console.log('tölerans değerleri çekilirken hata')
    } else {
      db.query('SELECT * FROM public."Ayarlar"', function (err, table) {
        done();
        if (err) {
          console.log('ayarları dbden çekerken hata')
        } else {
          //db.end()
            cb(table.rows)            
        }
      });
    }
  });
}

function sirkulasyonRutinKontrol(){
  var saatKontrol = setInterval(function () {
      let now = new Date();
      if(now.getMinutes()===53 && now.getSeconds()===0){
          console.log('RUTİN SİRKÜLASYON BAŞLADI')
          valf3Ac(function(){motorStart()}) //sirkülasyona başla
          clearInterval(saatKontrol)
          setTimeout(() => {
              sirkulasyonRutinKontrol() //tekrar sorgula
              console.log('RUTİN SİRKÜLASYON BİTTİ')
              valf3Kapat(function(){motorStop()}) //sirkülasyonu durdur
          }, 300000); //5 dakika
      }
  },1000)
}

sirkulasyonRutinKontrol()

function ecPhKontrol(kart,cbSulamayaBasla){
  toleransAyarlariniAl(gelen=>{
    phTolerans=Number(gelen[0].phTolerans)
    ecTolerans=Number(gelen[0].ecTolerans)
    console.log(phTolerans,ecTolerans)
    var mailAnahtar = true;
    var anormallikKontrolTimeout; 
    var phSet = Number(Number(kart._phSet).toFixed(2))
    var ecSet = Number(Number(kart._ecSet).toFixed(2))
    var phSetUp = Number(phSet+phTolerans)
    var phSetDown = Number(phSet-phTolerans)
    var ecSetUp = Number(ecSet+ecTolerans)
    var ecSetDown = Number(ecSet-ecTolerans)
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log('PH ÜST LİMİT: '+phSetUp+' PH ALT LİMİT: '+phSetDown+' EC ÜST LİMİT: '+ecSetUp+' EC ALT LİMİT: '+ecSetDown)
    console.log('PH Set:'+phSet)
    console.log('EC Set:'+ecSet)
    console.log('Omnicondan ph ec set değere ulaştı mı diye sorgulanıyor..')
    log.toDb("PH ve EC kontrol ediliyor...",300)
    valf3Ac()
    setTimeout(() => {motorStart()}, 1000); 

    omnicon.readHoldingRegisters(0,2) //quantity 2 çünkü ec ph tek sorguda dizi gelsin istedim
    .then(res=>{
            var ph = res.data[0]/100
            var ec = res.data[1]
            console.log(ph)
            console.log(ec)           
            if(((ph >= phSetDown) && (ph<=phSetUp)) && ((ec >= ecSetDown) && (ec<=ecSetUp))){
                log.toDb("PH ve EC ayarlandı sulamaya geçiliyor...",200)
                clearInterval(ecPhKontrolInterval)
                clearTimeout(ekstraSuAlmaTimeOut)
                clearTimeout(anormallikKontrolTimeout)
                motorStop()
                setTimeout(() => {valf3Kapat()}, 1000);
                setTimeout(() => {cbSulamayaBasla()}, 1000)       
            }
            else{
              // if(mailAnahtar){
              //   mailAnahtar = false
              //   anormallikKontrolTimeout = setTimeout(function(){
              //       mail.mailAt('Sulama Gecikmesi','PH ve EC 15 dakikadır dengelenemediğinden sulama hala başlamadı! \nPH Değeri: '+ph+' PH Set Değeri: '+phSet+' EC Değeri: '+ec+' EC Set Değeri: '+ecSet+'\nSistem PH ve EC dengeleme çalışmasına devam ediyor.')
              //       clearTimeout(anormallikKontrolTimeout)
              //   },900000) //15 dakika
              // }
              ecPhKontrolInterval = setTimeout(() => {
                ecPhKontrol(kart,cbSulamayaBasla)
              }, 2000);             
          }
        })
    .catch(err=>{
        console.log(err)
    })    
  })    
}

function asitPompaAc(){
  omnicon.writeRegisters(6,[2])
    .then(response=>{
      console.log('asit pompası açıldı')
  })
    .catch(err=>{
      console.log(err)
  })
}

function gubrePompaAc(){
  omnicon.writeRegisters(9,[2])
    .then(response=>{
      console.log('gübre pompası açıldı')
  })
    .catch(err=>{
      console.log(err)
  })
}
function asitPompaKapat(){
  omnicon.writeRegisters(6,[0])
    .then(response=>{
      console.log('asit pompası kapatıldı')
  })
    .catch(err=>{
      console.log(err)
  })
}

function gubrePompaKapat(){
  omnicon.writeRegisters(9,[0])
    .then(response=>{
      console.log('gübre pompası kapatıldı')
  })
    .catch(err=>{
      console.log(err)
  })
}
function suAc(){
  ekstraSuAl()
}
function suKapat(){
  ekstraSuAlmayiDurdur()
}
function sirkulasyonYap(){
  valf3Ac(function(){motorStart()})
}
function sirkulasyonDurdur(){
  valf3Kapat(function(){motorStop()})
}

let asitAlimSayisi=1
let gubreAlimSayisi=1
let suAlimSayisi=1

let dozajFuncs = {
  basla : function(phSet,ecSet){
      toleransAyarlariniAl(gelen=>{
        omnicon.readHoldingRegisters(0,2) //quantity 2 çünkü ec ph tek sorguda dizi gelsin istedim
        .then(res=>{
          var ph = res.data[0]/100
          var ec = res.data[1]
          phTolerans=Number(gelen[0].phTolerans)
          ecTolerans=Number(gelen[0].ecTolerans)
          var phSetUp = phSet+phTolerans,ecSetUp=ecSet+ecTolerans
          var phSetDown = phSet-phTolerans,ecSetDown=ecSet-ecTolerans
          console.log(ph,ec)
          console.log(phSetUp,phSetDown,ecSetUp,ecSetDown)
          console.log('PH EC TOLERANS: '+phTolerans,ecTolerans)
          if(ec>ecSetUp){
              console.log('///EC YÜKSEK')
              dozajFuncs.suAl(dozajFuncs.bekle)
              asitAlimSayisi=1
              gubreAlimSayisi=1
          }
          else if(ec<ecSetDown){
              console.log('///EC DÜŞÜK')
              dozajFuncs.gubreAl(dozajFuncs.bekle)
              asitAlimSayisi=1
              suAlimSayisi=1
          }
          else if(ph>phSetUp){    
              console.log('///PH YÜKSEK')   
              dozajFuncs.asitAl(dozajFuncs.bekle)
              suAlimSayisi=1
              gubreAlimSayisi=1
          }
          else if(ph<phSetDown){
              console.log('///PH DÜŞÜK')
              dozajFuncs.suAl(dozajFuncs.bekle)
              asitAlimSayisi=1
              gubreAlimSayisi=1
          }
          else{
              console.log('HER ŞEY OK')
              baslaTimeout = setTimeout(() => {
                dozajFuncs.basla(phSet,ecSet)
              }, 3000);
              asitAlimSayisi=1
              suAlimSayisi=1
              gubreAlimSayisi=1
              //sirkulasyonDurdur()        
          }           
        })
        .catch(err=>{
            console.log(err)
            mail.sunucuStartMail('Dozajlama','Dozajlama için modbus bağlantı hatası')
        })
      })
      
  },
  asitAl : function(bekle){
      asitPompaAc()
      setTimeout(() => {gubrePompaKapat()}, 500);
      setTimeout(() => {tankDoluyor === 1 ? console.log('SU KAPATILMADI!!') : suKapat()},3000)
      //sirkulasyonYap()
      console.log('asit alınıyor..',asitAlimSayisi)
      asitTimeout = setTimeout(() => {
          bekle('asit',dozajFuncs.tekrar)
      }, 10000); //10 sn asit al
  },
  gubreAl : function(bekle){
      gubrePompaAc()
      setTimeout(() => {asitPompaKapat()}, 500);
      setTimeout(() => {tankDoluyor === 1 ? console.log('SU KAPATILMADI!!') : suKapat()},3000)        
      console.log('gübre alınıyor..',gubreAlimSayisi)
      gubreTimeout = setTimeout(() => {
          bekle('gubre',dozajFuncs.tekrar)
      }, 30000); //30 sn gübre al
  },
  suAl : function(bekle){
      suAc()
      setTimeout(() => {gubrePompaKapat()}, 500);
      setTimeout(() => {asitPompaKapat()}, 1000);
      console.log('su alınıyor..',suAlimSayisi)
      suTimeout = setTimeout(() => {
          bekle('su',dozajFuncs.tekrar)
      }, 5000); //5 sn su al
  },
  tekrar : function(malzeme){
      if(malzeme==='asit'){
          if (asitAlimSayisi < 60) {     
              asitAlimSayisi+=1;
              dozajFuncs.basla(phSet,ecSet);
          }
      }
      else if(malzeme==='gubre'){
          if (gubreAlimSayisi < 100) {     
              gubreAlimSayisi+=1;
              dozajFuncs.basla(phSet,ecSet);
          }
      }
      else if(malzeme==='su'){
          if (suAlimSayisi < 50) {     
              suAlimSayisi+=1;
              dozajFuncs.basla(phSet,ecSet);
          }
      }   
  },
  bekle : function(malzeme,callback){
      sirkulasyonYap()
      asitPompaKapat()
      setTimeout(() => {gubrePompaKapat()}, 500);
      setTimeout(() => {tankDoluyor === 1 ? console.log('TANK DOLUYOR SU KAPATILMADI') : suKapat()}, 2000); 
      if(malzeme==='asit'){
          if (asitAlimSayisi < 60) {     
              console.log('DOZAJLAMA BEKLEMEDE')
              asitBekleTimeout = setTimeout(() => {
                  callback(malzeme)
              }, 120000); //2dk bekle
          }
          else{
              console.log('ALARM! TÜM POMPALAR DURDURULDU')
              mail.sunucuStartMail('Dozajlama Yapılamadı','60 defa 10 saniyelik asit alındı ancak PH istenilen seviyeye düşürülemedi. Dozajlama çalışması devam etmeyecek. Tekrar devam ettirmek için programı pasif yapıp tekrar aktif edin.')
              asitAlimSayisi=1
              suAlimSayisi=1
              gubreAlimSayisi=1
              asitPompaKapat()
              setTimeout(() => {gubrePompaKapat()}, 500);
              setTimeout(() => {tankDoluyor === 1 ? console.log('TANK DOLUYOR SU KAPATILMADI') : suKapat()}, 2000); 
              sirkulasyonDurdur()          
          }
      }
      else if(malzeme==='gubre'){
          if (gubreAlimSayisi < 100) {     
              console.log('DOZAJLAMA BEKLEMEDE')
              gubreBekleTimeout = setTimeout(() => {
                  callback(malzeme)
              }, 30000); //30sn bekle
          }
          else{
              console.log('ALARM! TÜM POMPALAR DURDURULDU')
              mail.sunucuStartMail('Dozajlama Yapılamadı','100 defa 30 saniyelik gübre alındı ancak EC istenilen seviyeye yükseltilemedi. Dozajlama çalışması devam etmeyecek. Tekrar devam ettirmek için programı pasif yapıp tekrar aktif edin.')
              gubreAlimSayisi=1
              suAlimSayisi=1
              asitAlimSayisi=1
              asitPompaKapat()
              setTimeout(() => {gubrePompaKapat()}, 500);
              setTimeout(() => {tankDoluyor === 1 ? console.log('TANK DOLUYOR SU KAPATILMADI') : suKapat()}, 2000); 
              sirkulasyonDurdur()
          }
      }
      else if(malzeme==='su'){
          if (suAlimSayisi < 50) {     
              console.log('DOZAJLAMA BEKLEMEDE')
              suBekleTimeout = setTimeout(() => {
                  callback(malzeme)
              }, 30000); //30sn bekle
          }
          else{
              console.log('ALARM! TÜM POMPALAR DURDURULDU')
              mail.sunucuStartMail('Dozajlama Yapılamadı','50 defa 5 saniyelik su alındı ancak değerler istenilen seviyeye getirilemedi. Dozajlama çalışması devam etmeyecek. Tekrar devam ettirmek için programı pasif yapıp tekrar aktif edin.')
              suAlimSayisi=1
              asitAlimSayisi=1
              gubreAlimSayisi=1
              asitPompaKapat()
              setTimeout(() => {gubrePompaKapat()}, 500);
              setTimeout(() => {tankDoluyor === 1 ? console.log('TANK DOLUYOR SU KAPATILMADI') : suKapat()}, 2000); 
              sirkulasyonDurdur()
          }
      }
      
  },
  durdur:function(){
    clearTimeout(asitTimeout)
    clearTimeout(gubreTimeout)
    clearTimeout(suTimeout)
    clearTimeout(asitBekleTimeout)
    clearTimeout(gubreBekleTimeout)
    clearTimeout(suBekleTimeout)
    clearTimeout(baslaTimeout)
    suAlimSayisi=1
    asitAlimSayisi=1
    gubreAlimSayisi=1
    console.log('DOZAJLAMAYLA İLGİLİ INTERVALLER DURDURULDU')
  }
}


function sahaParametreleri(cb){ //sadece sulama sayfasından erişim
  pool.connect((err, db, done) => {
    if (err) {
      console.log("su seviyesi için veri tabanına bağlanılırken hata oluştu!!!")
    } else {
      db.query('SELECT "PH","EC","TankSeviye" from public."Veriler" order by "ID" DESC LIMIT 1', function (err, table) {
        done();
        if (err) {
          console.log("saha parametreleri veri tabanından okunurken hata!!")
        } else {
          //db.end()
          let sahaParametreleri = [Number((table.rows[0].TankSeviye/100)*1200-120).toFixed(0),table.rows[0].PH,table.rows[0].EC]
          cb(sahaParametreleri)          
        }
      });
    }
});
}

exports.run = run
exports.stop = stop
exports.valf2MotorAc = valf2MotorAc
exports.valf2MotorKapat = valf2MotorKapat
exports.calisiyorBilgisiEkle = calisiyorBilgisiEkle
exports.calisiyorBilgisiSil = calisiyorBilgisiSil
exports.deviceConnect = deviceConnect
exports.butunCikislarOFF = butunCikislarOFF
exports.suSeviyesi = suSeviyesi
exports.omniconSetGonder = omniconSetGonder
exports.dozajlamaPompalariOff = dozajlamaPompalariOff
exports.dozajlamaPompalariOn = dozajlamaPompalariOn
exports.anlikVeriCek = anlikVeriCek
exports.processRun = processRun
exports.asitPompasi = asitPompasi
exports.gubrePompasi = gubrePompasi
exports.sahaParametreleri = sahaParametreleri
exports.sonVeriCek = sonVeriCek
exports.valf1Ac = valf1Ac
exports.suSeviyeKontrol = suSeviyeKontrol
exports.valf3Ac = valf3Ac
exports.motorStart = motorStart
exports.valf1Kapat = valf1Kapat
exports.valf3Kapat = valf3Kapat
exports.motorStop = motorStop




