let express = require("express");
let bodyParser = require("body-parser");
let morgan = require("morgan");
let pg = require("pg");
let ip = require('ip')
let pcIP = ip.address()
var suHazirlama = require('./suHazirlama')
var {islemler} = require('./sulama')
const log = require('./log')
var mail = require('./src/config/mail')
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
var omnicon = new ModbusRTU();
client.setTimeout(10000);
omnicon.setTimeout(10000);
const deviceIP = require("./src/config/deviceIP");
const PORT = 3001;


let pool = new pg.Pool({
  port: 5432,
  password: "apra",
  database: "postgres",
  host: 'localhost',
  user: "postgres",
});

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));
// app.use('/', express.static('build' + '/'));

app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//

app.get("/programListele", function (req, res) {
  pool.connect((err, db, done) => {
    if (err) {
      console.log(err)
      return res.status(400).send(err);
    } else {
      db.query('SELECT * FROM public."Programlar" ORDER BY "id" ASC', function (err, table) {
        done();
        if (err) {
          return res.status(400).send(err);
        } else {
          //db.end()
          return res.status(200).send(table.rows);
          
        }
      });
    }
  });
});

app.post("/programEkle", function (req, res) {
  let now = new Date()
  let kayitZamani = now.toLocaleString();
  console.log(req.body);
  let {programAdi,baslamaTarih,baslamaSaat,calismaSuresiSaat,calismaSuresiDakika,calismaSuresiSaniye,beklemeSuresiSaat,beklemeSuresiDakika,beklemeSuresiSaniye,tekrar,phSet,ecSet,valf1,valf2,valf3,valf4,valf5,valf6,valf7,valf8,pazartesi,sali,carsamba,persembe,cuma,cumartesi,pazar,sirkulasyonSeviyesi,dolmaSeviyesi} = req.body
  //VALFLER
  let valfArray=[]
  let valfTemp=
  [
    {valfAdi:"valf1",value:valf1},
    {valfAdi:"valf2",value:valf2},
    {valfAdi:"valf3",value:valf3},
    {valfAdi:"valf4",value:valf4},
    {valfAdi:"valf5",value:valf5},
    {valfAdi:"valf6",value:valf6},
    {valfAdi:"valf7",value:valf7},
    {valfAdi:"valf8",value:valf8}
  ]
  valfTemp.map(item=>{
      if(item.value === true){
        valfArray.push(item.valfAdi)
      }
      return item;
  })
  let valfler = {valf:valfArray}
  ///GÜNLER
  let gunArray=[]
  let gunTemp=
  [
    {gunAdi:"PZT",value:pazartesi},
    {gunAdi:"SL",value:sali},
    {gunAdi:"CRS",value:carsamba},
    {gunAdi:"PRS",value:persembe},
    {gunAdi:"CM",value:cuma},
    {gunAdi:"CMT",value:cumartesi},
    {gunAdi:"PZ",value:pazar},
  ]
  gunTemp.map(item=>{
    if(item.value === true){
      gunArray.push(item.gunAdi)
    }
    return item;
  })
  let gunler = {gun:gunArray}

  ///DB İŞLEMLERİ
  pool.connect((err, db, done) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      db.query(
        'INSERT INTO public."Programlar"("programAdi","baslamaTarih","baslamaSaat","calismaSuresiSaat","calismaSuresiDakika","calismaSuresiSaniye","beklemeSuresiSaat","beklemeSuresiDakika","beklemeSuresiSaniye","tekrar","phSet","ecSet","KayitZamani","Valfler","Gunler","sirkulasyonSeviye","dolmaSeviye") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13,$14,$15,$16,$17);',
        [programAdi,baslamaTarih,baslamaSaat,calismaSuresiSaat,calismaSuresiDakika,calismaSuresiSaniye,beklemeSuresiSaat,beklemeSuresiDakika,beklemeSuresiSaniye,tekrar,phSet,ecSet,kayitZamani,valfler,gunler,sirkulasyonSeviyesi,dolmaSeviyesi],
        (err) => {
          done()
          if (err) {
            console.log(err)
            return res.status(400).send(err);
          } else {
            console.log("DATA INSERTED: "+req.body.programAdi);
            //db.end();
            res.status(201).send({ message: "Data inserted" });
          }
        }
      );
    }
  });
});


app.post("/programSil",function(req,res){
    pool.connect((err, db, done) => {
        if (err) {
          return res.status(400).send(err);
        } else {
          db.query('DELETE FROM public."Programlar" WHERE "id"=$1',[req.body.id], function (err) {
            done();
            if (err) {
              console.log(err)
              return res.status(400).send(err);
            } else {
              console.log("DATA DELETED: "+req.body.programAdi)
              log.islem(req.body.programAdi+" silindi")
              //db.end()
              res.status(201).send({ message: "Data deleted" });
            }
          });
        }
      });
})

app.post("/programGuncelle",function(req,res){
  let {id,programAdi,baslamaTarih,baslamaSaat,calismaSuresiSaat,calismaSuresiDakika,calismaSuresiSaniye,beklemeSuresiSaat,beklemeSuresiDakika,beklemeSuresiSaniye,tekrar,phSet,ecSet,valf1,valf2,valf3,valf4,valf5,valf6,valf7,valf8,pazartesi,sali,carsamba,persembe,cuma,cumartesi,pazar,sirkulasyonSeviyesi,dolmaSeviyesi} = req.body
  //VALFLER  
  let valfArray=[]
  let valfTemp=
  [
    {valfAdi:"valf1",value:valf1},
    {valfAdi:"valf2",value:valf2},
    {valfAdi:"valf3",value:valf3},
    {valfAdi:"valf4",value:valf4},
    {valfAdi:"valf5",value:valf5},
    {valfAdi:"valf6",value:valf6},
    {valfAdi:"valf7",value:valf7},
    {valfAdi:"valf8",value:valf8}
  ]
  valfTemp.map(item=>{
      if(item.value === true){
        valfArray.push(item.valfAdi)
      }
      return item;
  })
  let valfler = {valf:valfArray}
  
  //GÜNLER
  let gunArray=[]
  let gunTemp=
  [
    {gunAdi:"PZT",value:pazartesi},
    {gunAdi:"SL",value:sali},
    {gunAdi:"CRS",value:carsamba},
    {gunAdi:"PRS",value:persembe},
    {gunAdi:"CM",value:cuma},
    {gunAdi:"CMT",value:cumartesi},
    {gunAdi:"PZ",value:pazar},
  ]
  gunTemp.map(item=>{
    if(item.value === true){
      gunArray.push(item.gunAdi)
    }
    return item;
  })
  let gunler = {gun:gunArray}
  
    pool.connect((err, db, done) => {
        if (err) {
          return res.status(400).send(err);
        } else {
          db.query('UPDATE public."Programlar" SET "programAdi"=$1, "baslamaTarih"=$2, "baslamaSaat"=$3, "calismaSuresiSaat"=$4, "calismaSuresiDakika"=$5, "calismaSuresiSaniye"=$6, "beklemeSuresiSaat"=$7, "beklemeSuresiDakika"=$8, "beklemeSuresiSaniye"=$9, tekrar=$10, "phSet"=$11, "ecSet"=$12, "Valfler"=$14, "Gunler"=$15, "sirkulasyonSeviye"=$16, "dolmaSeviye"=$17 WHERE "id"=$13;',
          [programAdi,baslamaTarih,baslamaSaat,calismaSuresiSaat,calismaSuresiDakika,calismaSuresiSaniye,beklemeSuresiSaat,beklemeSuresiDakika,beklemeSuresiSaniye,tekrar,phSet,ecSet,id,valfler,gunler,sirkulasyonSeviyesi,dolmaSeviyesi], function (err) {
            done();
            if (err) {
              console.log(err)
              return res.status(400).send(err);
            } else {
              console.log("DATA UPDATED: "+req.body.id)
              log.islem(programAdi+" güncellendi")
              //db.end()
              res.status(201).send({ message: "Data updated" });
            }
          });
        }
      });
})

app.post('/aktifProgramEkle',function(req,res){
  let now = new Date()
  let kayitZamani = now.toLocaleString();
  let {id,programAdi,baslamaTarih,baslamaSaat,calismaSuresiSaat,calismaSuresiDakika,calismaSuresiSaniye,beklemeSuresiSaat,beklemeSuresiDakika,beklemeSuresiSaniye,tekrar,phSet,ecSet,Valfler,Gunler,sirkulasyonSeviye,dolmaSeviye} = req.body

  pool.connect((err, db, done) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      db.query(
        'INSERT INTO public."AktifProgramlar"("programID", "programAdi", "baslamaTarih", "baslamaSaat", "calismaSuresiSaat", "calismaSuresiDakika", "calismaSuresiSaniye", "beklemeSuresiSaat", "beklemeSuresiDakika", "beklemeSuresiSaniye", tekrar, "phSet", "ecSet", "KayitZamani", "Valfler", "Gunler","sirkulasyonSeviye","dolmaSeviye") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18);',
        [id,programAdi,baslamaTarih,baslamaSaat,calismaSuresiSaat,calismaSuresiDakika,calismaSuresiSaniye,beklemeSuresiSaat,beklemeSuresiDakika,beklemeSuresiSaniye,tekrar,phSet,ecSet,kayitZamani,Valfler,Gunler,sirkulasyonSeviye,dolmaSeviye],
        (err) => {
          done()
          if (err) {
            console.log(err)
            return res.status(400).send(err);
          } else {
            console.log("CARD ACTIVE: "+programAdi);
            //db.end();
            res.status(201).send({ message: "CARD ACTIVE" });
            log.islem(programAdi+" aktif edildi")
          }
        }
      );
    }
  });

  let _calismaSuresi = calismaSuresiSaat*3600 + calismaSuresiDakika*60 + calismaSuresiSaniye //sn cinsinden
  let _beklemeSuresi = beklemeSuresiSaat*3600 + beklemeSuresiDakika*60 + beklemeSuresiSaniye //sn cinsinden
  let _tekrar = tekrar;
  let _gunler = Gunler;
  let _baslamaZamani = baslamaSaat;
  let _phSet = phSet;
  let _ecSet = ecSet;
  let _valfler = Valfler;
  let _sirkulasyonSeviye = sirkulasyonSeviye
  let _dolmaSeviye = dolmaSeviye
  let bilgiler = {id,programAdi,_calismaSuresi,_beklemeSuresi,_tekrar,_gunler,_baslamaZamani,_phSet,_ecSet,_valfler,_sirkulasyonSeviye,_dolmaSeviye}
  //islemler.basla(bilgiler)
  suHazirlama.run(bilgiler) 
})

app.post('/aktifProgramKaldir',function(req,res){
  pool.connect((err, db, done) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      db.query('DELETE FROM public."AktifProgramlar" WHERE "programID"=$1',[req.body.id || req.body.programID], function (err) {
        done();
        if (err) {
          console.log(err)
          return res.status(404).send({message:"sql sorgusu"})
        } else {
          console.log("CARD PASSIVE: "+req.body.programAdi)
          //db.end()
          res.status(201).send({ message: "CARD PASSIVE" });
          log.islem(req.body.programAdi+" pasif edildi")
        }
      });
    }
  });
  //islemler.durdur(req.body);
  suHazirlama.stop(req.body)
})

app.get("/aktifProgramListele", function (req, res) {
  pool.connect((err, db, done) => {
    if (err) {
      console.log(err)
      return res.status(400).send(err);
    } else {
      db.query('SELECT * FROM public."AktifProgramlar" ORDER BY "programID" ASC', function (err, table) {
        done();
        if (err) {
          return res.status(400).send(err);
        } else {
          //db.end()
          return res.status(200).send(table.rows);
          
        }
      });
    }
  });
});

app.get("/calisanProgramListele", function (req, res) {
  pool.connect((err, db, done) => {
    if (err) {
      console.log(err)
      return res.status(400).send(err);
    } else {
      db.query('SELECT * FROM public."CalisanProgramlar"', function (err, table) {
        done();
        if (err) {
          return res.status(400).send(err);
        } else {
          //db.end()
          return res.status(200).send(table.rows);
          
        }
      });
    }
  });
});

app.get("/tekrarAdediCek", function (req, res) {
  pool.connect((err, db, done) => {
    if (err) {
      console.log(err)
      return res.status(400).send(err);
    } else {
      db.query('SELECT * FROM public."Tekrar"', function (err, table) {
        done();
        if (err) {
          return res.status(400).send(err);
        } else {
          //db.end()
          return res.status(200).send(table.rows);
          
        }
      });
    }
  });
});

app.post('/manuelValfOn',function(req,res){
  let valfNo = req.body.valf
  console.log(valfNo)
  console.log('manuel valf on')
  if(!client.isOpen){
    client.connectTCP(deviceIP.wiseIP,{port:502})
    .then(ress=>{
      console.log('connection OK')
      valfOn(valfNo)
      return res.status(201).send()
    })
    .catch(err=>{
      console.log(err)
      return res.status(400).send(err)
    })
  }
  else{
    valfOn(valfNo)
    return res.status(200).send()   
  } 
})

app.post('/manuelValfOff',function(req,res){
  let valfNo = req.body.valf
  
  if(!client.isOpen){
    client.connectTCP(deviceIP.wiseIP,{port:502})
    .then(ress=>{
      console.log('connection OK')
      valfOff(valfNo)
      return res.status(200).send()
    })
    .catch(err=>{
      console.log(err)
      return res.status(400).send(err)
    })
  }
  else{
    valfOff(valfNo)
    return res.status(200).send()
  }
})

app.post('/pompaOnOff',function(req,res){
  let pompaStatus = req.body.pompaStatus

  if(!client.isOpen){
    client.connectTCP(deviceIP.wiseIP,{port:502})
    .then(ress=>{
      console.log('connection OK')
      pompaOnOff(pompaStatus)
      return res.status(200).send()
    })
    .catch(err=>{
      console.log(err)
      return res.status(400).send(err)
    })
  }
  else{
    pompaOnOff(pompaStatus)
    return res.status(200).send()  
  }
})

app.get("/anlikVeriCek", function (req, res) {
  suHazirlama.anlikVeriCek((gelen)=>{
    return res.status(200).send(gelen) 
  })   
});

app.get("/acilStop", function (req, res) {     
  if(!client.isOpen){
    client.connectTCP(deviceIP.wiseIP,{port:502})
    .then(resp=>{
      console.log('connection OK')
      acilStop()
      return res.status(200).send()
    })
    .catch(err=>{
      console.log(err)
      return res.status(400).send()
    })
  }
  else{
     acilStop()
     return res.status(200).send()
  }     
});

app.get("/logCek", function (req, res) {
  pool.connect((err, db, done) => {
    if (err) {
      console.log(err)
      return res.status(400).send(err);
    } else {
      db.query('SELECT "message","islemKodu" from public."Log" ORDER BY "ID" DESC LIMIT 1', function (err, table) {
        done();
        if (err) {
          return res.status(400).send(err);
        } else {
          //db.end()
          return res.status(200).send(table.rows);
          
        }
      });
    }
  });
});

app.post("/raporCek", function (req, res) {
  let baslangic=req.body[0]
  let bitis=req.body[1]
  pool.connect((err, db, done) => {
    if (err) {
      console.log(err)
      return res.status(400).send(err);
    } else {
      db.query('SELECT "PH","EC","TankSeviyesi","SulamaZamani"+CAST(\'3 hours\' as interval) as "SulamaZamani" from public."Rapor"  WHERE "Zaman" BETWEEN $1 AND $2 ORDER BY "Zaman" DESC', 
      [baslangic,bitis],
      function (err, table) {
        done();
        if (err) {
          return res.status(400).send(err);
        } else {
          //db.end()
          return res.status(200).send(table.rows);
          
        }
      });
    }
  });
});

app.post("/islemRaporuCek", function (req, res) {

  pool.connect((err, db, done) => {
    if (err) {
      console.log(err)
      return res.status(400).send(err);
    } else {
      db.query('SELECT "message","zaman"+CAST(\'3 hours\' as interval) as "Zaman" from public."Islemler" ORDER BY "ID" DESC', 
      function (err, table) {
        done();
        if (err) {
          return res.status(400).send(err);
        } else {
          //db.end()
          return res.status(200).send(table.rows);
          
        }
      });
    }
  });
});

app.post("/ayarParametreleri", function (req, res) {
  let phTolerans=req.body.phTolerans
  let ecTolerans=req.body.ecTolerans
  let suAlmaSuresi=req.body.suAlmaSuresi
  console.log(phTolerans,ecTolerans,suAlmaSuresi)
  pool.connect((err, db, done) => {
    if (err) {
      console.log(err)
      return res.status(400).send(err);
    } else {
      db.query('UPDATE public."Ayarlar" SET "ID"=1, "phTolerans"=$1, "ecTolerans"=$2,"suAlmaSuresi"=$3', 
      [phTolerans,ecTolerans,suAlmaSuresi],
      function (err, table) {
        if (err) {
          console.log(err)
          return res.status(400).send(err);
        } else {
          console.log("DATA UPDATED")
          log.islem('Tölerans ayarları güncellendi')
          //db.end()
          res.status(201).send({ message: "Data updated" });
        }
      });
    }
  });
});

app.get("/ayarlariCek", function (req, res) {
  pool.connect((err, db, done) => {
    if (err) {
      console.log(err)
      return res.status(400).send(err);
    } else {
      db.query('SELECT * FROM public."Ayarlar"',
      function (err, table) {
        done();
        if (err) {
          return res.status(400).send(err);
        } else {
          //db.end()
          return res.status(200).send(table.rows);
          
        }
      });
    }
  });
});

app.post('/asitPompasi',function(req,res){
  let output = req.body.output
  suHazirlama.asitPompasi((gelen)=>{
    return res.status(200).send(gelen) 
  },output)
})

app.post('/gubrePompasi',function(req,res){
  let output = req.body.output
  suHazirlama.gubrePompasi((gelen)=>{
    return res.status(200).send(gelen) 
  },output)
})

function pompaOnOff(pompaStatus){
  if(pompaStatus === 1)
    {
      client.writeCoil(19,1)
      .then(response=>{
        console.log('Pompa On')
        log.toDb("Pompa manuel olarak açıldı",200)
        log.islem('Sulama pompası manuel olarak açıldı')
        client.close()
      })
      .catch(err=>{
        console.log(err)
      })
    }
    if(pompaStatus === 0)
    {
      client.writeCoil(19,0)
      .then(response=>{
        console.log('Pompa Off')
        log.toDb("Pompa manuel olarak kapatıldı",200)
        log.islem('Sulama pompası manuel olarak kapatıldı')
        client.close()
      })
      .catch(err=>{
        console.log(err)
      })
    }
}

function valfOn(valfNo){
  if(valfNo === 1)
    {
      client.writeCoil(16,1)
      .then(response=>{
        console.log('Valf 1 On')
        log.toDb("Ana su valfi manuel olarak açıldı",200)
        log.islem('Ana su valfi manuel olarak açıldı')
        client.close()
      })
      .catch(err=>{
        console.log(err)
      })
    }
    if(valfNo === 2)
    {
      client.writeCoil(17,1)
      .then(response=>{
        console.log('Valf 2 On')
        log.toDb("Sulama valfi manuel olarak açıldı",200)
        log.islem("Sulama valfi manuel olarak açıldı")
        
        client.close()
      })
      .catch(err=>{
        console.log(err)
      })
    }
    if(valfNo === 3)
    {
      client.writeCoil(18,1)
      .then(response=>{
        console.log('Valf 3 On')
        log.toDb("Sirkülasyon valfi manuel olarak açıldı",200)
        log.islem("Sirkülasyon valfi manuel olarak açıldı")
        client.close()
      })
      .catch(err=>{
        console.log(err)
      })
    }
}

function valfOff(valfNo){
  if(valfNo === 1)
    {
      client.writeCoil(16,0)
      .then(response=>{
        console.log('Valf 1 Off')
        log.toDb("Ana su valfi manuel olarak kapatıldı",200)
        log.islem("Ana su valfi manuel olarak kapatıldı")
        client.close()
      })
      .catch(err=>{
        console.log(err)
      })
    }
    if(valfNo === 2)
    {
      client.writeCoil(17,0)
      .then(response=>{
        console.log('Valf 2 Off')
        log.toDb("Sulama valfi manuel olarak kapatıldı",200)
        log.islem("Sulama valfi manuel olarak kapatıldı")
        client.close()
      })
      .catch(err=>{
        console.log(err)
      })
    }
    if(valfNo === 3)
    {
      client.writeCoil(18,0)
      .then(response=>{
        console.log('Valf 3 Off')
        log.toDb("Sirkülasyon valfi manuel olarak kapatıldı",200)
        log.islem("Sirkülasyon valfi manuel olarak kapatıldı")
        client.close()
      })
      .catch(err=>{
        console.log(err)
      })
    }
}

function acilStop(){
  let aktifProgramId;
  pool.connect((err, db, done) => {
    if (err) {
      console.log(err)
    } else {
      db.query('select "programID" from public."AktifProgramlar"', function (err, table) {
        done();
        if (err) {
          console.log(err)
        } else {
          //db.end()
          aktifProgramId = table.rows[0].programID;
          let kart = {programID:aktifProgramId}
          suHazirlama.stop(kart)
          log.islem("Acil stopa basıldı")        
          log.toDb("Acil stopa basıldı",400)        
        }
      });
    }
  })
}

mail.sunucuStartMail("Sunucu Yeniden Başladı","Sunucu yeniden başladı. Bakım yapılıyor veya elektrik kesintisi yaşandı.")
log.toDb("Program sunucusunun çalışmasında kesinti yaşandı. Programı pasif yapıp tekrar aktif edin.",400)

app.listen(PORT, () => console.log("Listening on port " + PORT));
