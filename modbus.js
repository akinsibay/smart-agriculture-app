var ModbusRTU = require("modbus-serial");
var plc = new ModbusRTU(); 


function run(kart){  
    
    plc.connectTCP("192.168.6.6",{port:502})
    .then(res=>{
        setTimeout(() => {
            console.log('PLC connection OK')
            let valfler = kart._valfler.valf; //valfler arrayini oluştur
            plcRun(valfler)   //plcyi bu valf bilgileriyle sür 
        }, 1000);
        
    })             
    .catch(error=>{console.log(error)})
    
}
function stop(){
    return 0
    //buraya plc digital outputları 0 yapacak modbus kodu yazılacak
}

function plcRun(valfler){
    valf1Kontrol(valfler,function(){
        valf2Kontrol(valfler,function(){
            valf3Kontrol(valfler,function(){
                valf4Kontrol(valfler)
            })
        })
    })  
}
function valf1Kontrol(valfler,callback){
    //setTimeout(() => {
        if(valfler.some(item=>item==='valf1')){
            console.log('valf1')
            plc.readInputRegisters(0,1)
            .then(res=>{
                console.log(res.data)
                callback(valfler)      
            })
            .catch(err=>console.log(err)) 
        }
        else callback(valfler)  
    //}, 1000);
    
}
function valf2Kontrol(valfler,callback){
    //setTimeout(() => {
        if(valfler.some(item=>item==='valf2')){
            console.log('valf2')
            plc.readInputRegisters(2,1)
            .then(res=>{
                console.log(res.data)
                callback(valfler)      
            })
            .catch(err=>console.log(err)) 
        }
        else callback(valfler)   
    //}, 1000);   
}
function valf3Kontrol(valfler,callback){
    //setTimeout(() => {
        if(valfler.some(item=>item==='valf3')){
            console.log('valf3')
            plc.readInputRegisters(4,1)
            .then(res=>{
                console.log(res.data)
                callback(valfler)                                    
            })
            .catch(err=>console.log(err)) 
        }
        else callback(valfler)  
    //}, 1000);
}
function valf4Kontrol(valfler){
    //setTimeout(() => {
        if(valfler.some(item=>item==='valf4')){
            console.log('valf4')
            plc.readInputRegisters(6,1)
            .then(res=>{
                console.log(res.data)                                    
            })
            .catch(err=>console.log(err)) 
        }  
    //}, 1000);
}
exports.run = run
exports.stop = stop