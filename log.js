let pg = require("pg");
let pool = new pg.Pool({
    port: 5432,
    password: "apra",
    database: "postgres",
    host: "localhost",
    user: "postgres",
});
function toDb(message,islemKodu){
    let now = new Date()
    let kayitZamani = now.toLocaleString();
    pool.connect((err, db, done) => {
        if (err) {
          return console.log(err)
        } else {
          db.query(
            'INSERT INTO public."Log"("message","islemKodu","zaman") VALUES ($1, $2,$3);',
            [message,islemKodu,kayitZamani],     
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
function islem(message){
  let now = new Date()
  let kayitZamani = now.toLocaleString();
  pool.connect((err, db, done) => {
      if (err) {
        return console.log(err)
      } else {
        db.query(
          'INSERT INTO public."Islemler"("message","zaman") VALUES ($1, $2);',
          [message,kayitZamani],     
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
exports.toDb = toDb;
exports.islem = islem;