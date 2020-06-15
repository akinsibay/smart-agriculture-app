var ip = require('ip')
let pcIP = ip.address()
const serverUrl = 'http://'+pcIP+':3001'
export default serverUrl