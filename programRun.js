let timer,calisTimer,bekleTimer;
let i = 0;
var day = ["pazar","pazartesi","sali","carsamba","persembe","cuma","cumartesi"]
let aktifKartlar = []
let aktifProgramId;


let islemler = {
  calis: function (kart, callback) {
    console.log("calisiyorum ",kart._calismaSuresi);
    calisTimer = setTimeout(() => {
      callback(kart,this.again);
    }, kart._calismaSuresi*1000); 
  },
  bekle: function (kart, callback) {
    console.log("bekliyorum ",kart._beklemeSuresi);
    bekleTimer = setTimeout(() => {
      callback(kart);
    }, kart._beklemeSuresi*1000);
  },
  again: function (kart) {
    if (i < kart._tekrar - 1) {
      islemler.calis(kart,islemler.bekle);
      i++;
    }
    else{
      console.log('program bitti')
      islemler.kontrolTime(kart) //program bittikten sonra tekrardan sorguyu aktif etmek için
      i=0
    }
  },

  basla: function (kart) {
    aktifKartlar.push(kart.id || kart.programID)
    console.log(aktifKartlar)
    console.log(kart.id || kart.programID)
    this.kontrolTime(kart)    
  },

  kontrolTime: function(kart){
    timer = setInterval(() => {
        let d = new Date();
        let suankiSaat = d.getHours() + ":" + (d.getMinutes()<10 ? "0": "") + d.getMinutes();
        let suankiGun = d.getDay();
        
        if (kart._gunler.gun.find(gun=>gun===day[suankiGun])) {
            console.log("gün uyumlu kart id:",kart.id || kart.programID);
        
            if (suankiSaat === kart._baslamaZamani) {
                console.log("basladi kart id:",kart.id || kart.programID );
                aktifProgramId=kart.id
                this.calis(kart,this.bekle);
                clearInterval(timer)
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
      console.log('silinmek icin gonderilen:',kart.id || kart.programID)
      console.log('once:',aktifKartlar)
      if(aktifKartlar.find(item=>kart.id || kart.programID === item)){   
        clearInterval(timer) //zamanın gelmesini bekleyen timer
        console.log('interval durdu')
        clearTimeout(calisTimer) //zaman gelmiş program çalışmaya başlamış, çalışma timerı
        console.log('calisma timerı durdu')
        clearTimeout(bekleTimer) //zaman gelmiş program çalışmaya başlamış,bekleme timerı
        console.log('bekleme timerı durdu')
      }
      aktifKartlar = aktifKartlar.filter(item=>item!==kart.id || kart.programID)
      console.log('sonra:',aktifKartlar)
      i=0;
  },
};

module.exports = {islemler};
