let express = require("express");
let bodyParser = require("body-parser");
let morgan = require("morgan");
let pg = require("pg");
var {islemler} = require('./programRunTest')
const PORT = 3001;
let pool = new pg.Pool({
  port: 5432,
  password: "159753",
  database: "postgres",
  host: "localhost",
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
  let _baslamaZamani = baslamaSaat
  let bilgiler = {id,programAdi,_calismaSuresi,_beklemeSuresi,_tekrar,_gunler,_baslamaZamani}
  islemler.basla(bilgiler)
  
})

app.post('/aktifProgramKaldir',function(req,res){
  pool.connect((err, db, done) => {
    if (err) {
      return res.status(400).send('selamlar');
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
  islemler.durdur(req.body);
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

app.listen(PORT, () => console.log("Listening on port " + PORT));
