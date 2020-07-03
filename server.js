let express = require("express");
let bodyParser = require("body-parser");
let morgan = require("morgan");
let pg = require("pg");
let ip = require('ip')
let pcIP = ip.address()
var suHazirlama = require('./suHazirlama')
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
var omnicon = new ModbusRTU();
client.setTimeout(1000);
omnicon.setTimeout(1000);
const deviceIP = require("./src/config/deviceIP");
const PORT = 3001;


let pool = new pg.Pool({
  port: 5432,
  password: "159753",
  database: "postgres",
  host: 'localhost',
  user: "postgres",
});

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

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
  let {programAdi,baslamaTarih,baslamaSaat,calismaSuresiSaat,calismaSuresiDakika,calismaSuresiSaniye,beklemeSuresiSaat,beklemeSuresiDakika,beklemeSuresiSaniye,tekrar,phSet,ecSet,valf1,valf2,valf3,valf4,valf5,valf6,valf7,valf8,pazartesi,sali,carsamba,persembe,cuma,cumartesi,pazar} = req.body
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
    {gunAdi:"pazartesi",value:pazartesi},
    {gunAdi:"sali",value:sali},
    {gunAdi:"carsamba",value:carsamba},
    {gunAdi:"persembe",value:persembe},
    {gunAdi:"cuma",value:cuma},
    {gunAdi:"cumartesi",value:cumartesi},
    {gunAdi:"pazar",value:pazar},
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
        'INSERT INTO public."Programlar"("programAdi","baslamaTarih","baslamaSaat","calismaSuresiSaat","calismaSuresiDakika","calismaSuresiSaniye","beklemeSuresiSaat","beklemeSuresiDakika","beklemeSuresiSaniye","tekrar","phSet","ecSet","KayitZamani","Valfler","Gunler") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13,$14,$15);',
        [programAdi,baslamaTarih,baslamaSaat,calismaSuresiSaat,calismaSuresiDakika,calismaSuresiSaniye,beklemeSuresiSaat,beklemeSuresiDakika,beklemeSuresiSaniye,tekrar,phSet,ecSet,kayitZamani,valfler,gunler],
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
              //db.end()
              res.status(201).send({ message: "Data deleted" });
            }
          });
        }
      });
})

app.post("/programGuncelle",function(req,res){
    //console.log(req.body)
    let {id,programAdi,baslamaTarih,baslamaSaat,calismaSuresiSaat,calismaSuresiDakika,calismaSuresiSaniye,beklemeSuresiSaat,beklemeSuresiDakika,beklemeSuresiSaniye,tekrar,phSet,ecSet,valf1,valf2,valf3,valf4,valf5,valf6,valf7,valf8,pazartesi,sali,carsamba,persembe,cuma,cumartesi,pazar} = req.body
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
    {gunAdi:"pazartesi",value:pazartesi},
    {gunAdi:"sali",value:sali},
    {gunAdi:"carsamba",value:carsamba},
    {gunAdi:"persembe",value:persembe},
    {gunAdi:"cuma",value:cuma},
    {gunAdi:"cumartesi",value:cumartesi},
    {gunAdi:"pazar",value:pazar},
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
          db.query('UPDATE public."Programlar" SET "programAdi"=$1, "baslamaTarih"=$2, "baslamaSaat"=$3, "calismaSuresiSaat"=$4, "calismaSuresiDakika"=$5, "calismaSuresiSaniye"=$6, "beklemeSuresiSaat"=$7, "beklemeSuresiDakika"=$8, "beklemeSuresiSaniye"=$9, tekrar=$10, "phSet"=$11, "ecSet"=$12, "Valfler"=$14, "Gunler"=$15 WHERE "id"=$13;',
          [programAdi,baslamaTarih,baslamaSaat,calismaSuresiSaat,calismaSuresiDakika,calismaSuresiSaniye,beklemeSuresiSaat,beklemeSuresiDakika,beklemeSuresiSaniye,tekrar,phSet,ecSet,id,valfler,gunler], function (err) {
            done();
            if (err) {
              console.log(err)
              return res.status(400).send(err);
            } else {
              console.log("DATA UPDATED: "+req.body.id)
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
  //console.log(req.body)
  let {id,programAdi,baslamaTarih,baslamaSaat,calismaSuresiSaat,calismaSuresiDakika,calismaSuresiSaniye,beklemeSuresiSaat,beklemeSuresiDakika,beklemeSuresiSaniye,tekrar,phSet,ecSet,Valfler,Gunler} = req.body
  

  pool.connect((err, db, done) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      db.query(
        'INSERT INTO public."AktifProgramlar"("programID", "programAdi", "baslamaTarih", "baslamaSaat", "calismaSuresiSaat", "calismaSuresiDakika", "calismaSuresiSaniye", "beklemeSuresiSaat", "beklemeSuresiDakika", "beklemeSuresiSaniye", tekrar, "phSet", "ecSet", "KayitZamani", "Valfler", "Gunler") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);',
        [id,programAdi,baslamaTarih,baslamaSaat,calismaSuresiSaat,calismaSuresiDakika,calismaSuresiSaniye,beklemeSuresiSaat,beklemeSuresiDakika,beklemeSuresiSaniye,tekrar,phSet,ecSet,kayitZamani,Valfler,Gunler],
        (err) => {
          done()
          if (err) {
            console.log(err)
            return res.status(400).send(err);
          } else {
            console.log("CARD ACTIVE: "+programAdi);
            //db.end();
            res.status(201).send({ message: "CARD ACTIVE" });
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
  let bilgiler = {id,programAdi,_calismaSuresi,_beklemeSuresi,_tekrar,_gunler,_baslamaZamani,_phSet,_ecSet,_valfler}
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

app.post('/manuelValfOn',function(req,res){
  let valfNo = req.body.valf
  
  if(!client.isOpen){
    client.connectTCP(deviceIP.wiseIP,{port:502})
    .then(ress=>console.log('connection OK'))
    .catch(err=>{
      console.log(err)
      return res.status(400).send(err)
    })
  }
  else{
    if(valfNo === 1)
    {
      client.writeCoil(16,1)
      .then(response=>{
        console.log('Valf 1 On')
        return res.status(201).send({ message: "VALF-1 ON" })
      })
      .catch(err=>{
        console.log(err)
        return res.status(400).send({ message: "VALF-1 ON" })
      })
    }
    if(valfNo === 2)
    {
      client.writeCoil(17,1)
      .then(response=>{
        console.log('Valf 2 On')
        return res.status(201).send({ message: "VALF-2 ON" })
      })
      .catch(err=>{
        console.log(err)
        return res.status(400).send({ message: "VALF-2 ON" })
      })
    }
    if(valfNo === 3)
    {
      client.writeCoil(18,1)
      .then(response=>{
        console.log('Valf 3 On')
        return res.status(201).send({ message: "VALF-3 ON" })
      })
      .catch(err=>{
        console.log(err)
        return res.status(400).send({ message: "VALF-3 ON" })
      })
    }
    
  } 
})

app.post('/manuelValfOff',function(req,res){
  let valfNo = req.body.valf
  
  if(!client.isOpen){
    client.connectTCP(deviceIP.wiseIP,{port:502})
    .then(ress=>console.log('connection OK'))
    .catch(err=>{
      console.log(err)
      return res.status(400).send(err)
    })
  }
  else{
    if(valfNo === 1)
    {
      client.writeCoil(16,0)
      .then(response=>{
        console.log('Valf 1 Off')
        return res.status(201).send({ message: "VALF-1 OFF" })
      })
      .catch(err=>{
        console.log(err)
        return res.status(400).send({ message: "VALF-1 OFF" })
      })
    }
    if(valfNo === 2)
    {
      client.writeCoil(17,0)
      .then(response=>{
        console.log('Valf 2 Off')
        return res.status(201).send({ message: "VALF-2 OFF" })
      })
      .catch(err=>{
        console.log(err)
        return res.status(400).send({ message: "VALF-2 OFF" })
      })
    }
    if(valfNo === 3)
    {
      client.writeCoil(18,0)
      .then(response=>{
        console.log('Valf 3 Off')
        return res.status(201).send({ message: "VALF-3 OFF" })
      })
      .catch(err=>{
        console.log(err)
        return res.status(400).send({ message: "VALF-3 OFF" })
      })
    }
    
  }
})

app.post('/pompaOnOff',function(req,res){
  let pompaStatus = req.body.pompaStatus

  if(!client.isOpen){
    client.connectTCP(deviceIP.wiseIP,{port:502})
    .then(ress=>console.log('connection OK'))
    .catch(err=>{
      console.log(err)
      return res.status(400).send(err)
    })
  }
  else{
    if(pompaStatus === 1)
    {
      client.writeCoil(19,1)
      .then(response=>{
        console.log('Pompa On')
        return res.status(201).send({ message: "POMPA ON" })
      })
      .catch(err=>{
        console.log(err)
        return res.status(400).send()
      })
    }
    if(pompaStatus === 0)
    {
      client.writeCoil(19,0)
      .then(response=>{
        console.log('Pompa Off')
        return res.status(201).send({ message: "Pompa Off" })
      })
      .catch(err=>{
        console.log(err)
        return res.status(400).send()
      })
    }   
  }
})

app.get("/anlikVeriCek", function (req, res) {
  if(!client.isOpen || !omnicon.isOpen){
    client.connectTCP(deviceIP.wiseIP,{port:502})
    .then(resp=>{
      omnicon.connectTCP(deviceIP.omniconIP,{port:502})
      .then(resp=>console.log('anlık okuma için cihazlara bağlantı başarılı')) //şuraya bir return konabilir
      .catch(err=>console.log(err))
    })
    .catch(err=>{
      console.log(err)
      return res.status(400).send()
    })
  }
  else{
    client.readInputRegisters(0,4)
    .then(resp=>{
      let wiseValues = resp.data
      omnicon.readHoldingRegisters(0,2)
      .then(resp=>{
        let ph=resp.data[0]
        let ec=resp.data[1]
        let allValues = [ph,ec,...wiseValues]
        anlikVeriYaz(allValues)
        return res.status(200).send(allValues)
      })        
    })
    .catch(err=>{
      console.log(err)
      return res.status(400).send()
    }) 
  }     
});

app.get("/acilStop", function (req, res) {
     
  if(!client.isOpen){
    client.connectTCP(deviceIP.wiseIP,{port:502})
    .then(resp=>console.log('connection OK'))
    .catch(err=>{
      console.log(err)
      return res.status(400).send()
    })
  }
  else{
    client.writeCoil(16,0)
    .then(resp=>{
        console.log('Valf 1 kapatıldı')
        client.writeCoil(17,0)
        .then(resp=>{
            console.log('Valf 2 kapatıldı')
            client.writeCoil(18,0)
            .then(resp=>{
              console.log('Valf 3 kapatıldı')
              client.writeCoil(19,0)
              .then(resp=>{
                console.log('Motor durduruldu')
                return res.status(200).send()
              })           
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err)) 
  }     
});
function anlikVeriYaz(datalar){
  let now = new Date()
  let kayitZamani = now.toLocaleString();
  let ph = datalar[0]/100
  let ec = datalar[1]/100
  let tankSeviyesi = datalar[2]
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
app.listen(PORT, () => console.log("Listening on port " + PORT));
