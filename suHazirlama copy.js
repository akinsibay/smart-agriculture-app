var ModbusRTU = require("modbus-serial");
var plc = new ModbusRTU(); 

function run(kart){     
    plc.connectTCP("192.168.6.6",{port:502})
    .then(res=>{
        setTimeout(() => {
            console.log('PLC connection OK')
            //let valfler = kart._valfler.valf; //valfler arrayini oluştur
            plcRun(kart)   //plcyi bu valf bilgileriyle sür 
        }, 1000);
        
    })             
    .catch(error=>{console.log(error)})
    
}
function stop(){
    return 0
    //buraya plc digital outputları 0 yapacak modbus kodu yazılacak
}

function plcRun(kart){ 
    omniconSetGonder(kart,function(){
        valf1Ac(function(){
            suSeviyeKontrol(function(){valf3Ac()},function(){valf1Kapat(function(){
                valf3Kapat(function(){
                    ecPhKontrol(kart,function(){
                        valf2Ac(kart)
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
    plc.readInputRegisters(1,1)
    .then(res=>{
        console.log(res.data)
        cbValf1Ac()   
    })
    .catch(err=>console.log(err))
}

function valf1Ac(suSeviyeKontrol){
    console.log('Valf1 açılıyor ve sulama tankı dolduruluyor..')
    plc.readInputRegisters(1,1)
    .then(res=>{
        console.log(res.data)
        suSeviyeKontrol()   
    })
    .catch(err=>console.log(err))
}

function suSeviyeKontrol(cbValf3Ac,cbValf1Kapat){
    var sensorLimit = 0
    console.log('Sensör bilgisi okunuyor..')
    var interval = setInterval(() => {
        sensorLimit+=1
        console.log('Limit: '+sensorLimit)
        plc.readInputRegisters(2,1)
        .then(res=>{
            if(sensorLimit>0 && sensorLimit < 5){
                console.log('Tank %5 seviyesine kadar dolduruluyor..')
            }
            if(sensorLimit===5){
                console.log('Tank %5de. Valf 3 açılıyor..')                
                cbValf3Ac()               
            }
            if(sensorLimit===10){
                console.log('Tank doldu. Valf 1 kapatılıyor..')                
                cbValf1Kapat(valf3Kapat)
                clearInterval(interval)               
            }        
        })
        .catch(err=>console.log(err)) 
    }, 1000);     
}

function valf1Kapat(callback){
    console.log('Valf1 kapatılıyor..')
    plc.readInputRegisters(1,1)
    .then(res=>{
        console.log(res.data)
        callback()   
    })
    .catch(err=>console.log(err))
}

function valf3Ac(){
    console.log('Valf3 açılıyor su karıştırılıyor..')
    plc.readInputRegisters(1,1)
    .then(res=>{
        console.log(res.data)
        //ve motor start   
    })
    .catch(err=>console.log(err))
}

function valf3Kapat(callback){
    console.log('Valf3 kapatılıyor motor durduruluyor..')
    plc.readInputRegisters(1,1)
    .then(res=>{
        console.log(res.data)
        callback()
        //ve motor start   
    })
    .catch(err=>console.log(err))
}

function ecPhKontrol(kart,cbValf2Ac){
    var phSet = kart._phSet
    var ecSet = kart._ecSet
    console.log('PH Set:'+phSet)
    console.log('EC Set:'+ecSet)
    var olcum =0;
    console.log('Omnicondan ph ec set değere ulaştı mı diye sorgulanıyor..')
    var interval = setInterval(() => {
        olcum+=1
        console.log(olcum)
        plc.readInputRegisters(1,2) //quantity 2 çünkü ec ph tek sorguda dizi gelsin istedim
        .then(res=>{
            console.log(res.data)
            if(olcum >= phSet && olcum >=ecSet){
                console.log('ph ec ayarlandı valf 2 açılıyor..')
                clearInterval(interval)
                cbValf2Ac()
            }  
        })
        .catch(err=>console.log(err)) 
    }, 1000);
    
    
}

function valf2Ac(kart){
    console.log('valf 2 açılıyor..')
    plc.readInputRegisters(1,1)
    .then(res=>{
        console.log(res.data)
        programCalis(kart)
    })
    .catch(err=>console.log(err))
}
function valf2Kapat(kart){
    console.log('valf 2 kapatılıyor..')
    plc.readInputRegisters(1,1)
    .then(res=>{
        console.log(res.data)
    })
    .catch(err=>console.log(err))
}

function programCalis(kart){
    var {islemler} = require('./programRun')
    islemler.basla(kart)
}







// function valf1Kontrol(valfler,callback){
//     //setTimeout(() => {
//         if(valfler.some(item=>item==='valf1')){
//             console.log('valf1')
//             plc.readInputRegisters(0,1)
//             .then(res=>{
//                 console.log(res.data)
//                 callback(valfler)      
//             })
//             .catch(err=>console.log(err)) 
//         }
//         else callback(valfler)  
//     //}, 1000);
    
// }
// function valf2Kontrol(valfler,callback){
//     //setTimeout(() => {
//         if(valfler.some(item=>item==='valf2')){
//             console.log('valf2')
//             plc.readInputRegisters(2,1)
//             .then(res=>{
//                 console.log(res.data)
//                 callback(valfler)      
//             })
//             .catch(err=>console.log(err)) 
//         }
//         else callback(valfler)   
//     //}, 1000);   
// }
// function valf3Kontrol(valfler,callback){
//     //setTimeout(() => {
//         if(valfler.some(item=>item==='valf3')){
//             console.log('valf3')
//             plc.readInputRegisters(4,1)
//             .then(res=>{
//                 console.log(res.data)
//                 callback(valfler)                                    
//             })
//             .catch(err=>console.log(err)) 
//         }
//         else callback(valfler)  
//     //}, 1000);
// }
// function valf4Kontrol(valfler){
//     //setTimeout(() => {
//         if(valfler.some(item=>item==='valf4')){
//             console.log('valf4')
//             plc.readInputRegisters(6,1)
//             .then(res=>{
//                 console.log(res.data)                                    
//             })
//             .catch(err=>console.log(err)) 
//         }  
//     //}, 1000);
// }
exports.run = run
exports.stop = stop