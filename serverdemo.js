const axios = require('axios')
//const serverUrl = require('./src/config/serverUrl')

    let xurl = 'http://127.0.0.1:3001' + '/programListele'
    let yurl = 'http://127.0.0.1:3001' + '/aktifProgramListele'

    function programListele(){
        return axios.get(xurl)
    }
    function aktifProgramListele(){
        return axios.get(yurl)
    }
    // axios.all([programListele,aktifProgramListele()])
    //   .then(axios.spread((xRes,yRes)=>{
    //     console.log('xyz')         
    //     console.log(xRes)
    //     //   console.log(yRes)
    //   }))
    //   .catch((xError,yError)=>{
    //      console.log(xError) 
    //     //  console.log(yError)
    //     console.log('error') 
    //   })
    axios.get(yurl)
        .then(function(res){
            console.log(res.data)
        })