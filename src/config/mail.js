var nodemailer = require('nodemailer');

async function mailAt(baslik,icerik){

    var transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth: {
        user: 'apratarimsistem@gmail.com',
        pass: 'ApraTarim2020'
        }       
      });

    var info = await transporter.sendMail({
        from: '"APRA Tarım Sistem" <apratarimsistem@gmail.com>', 
        to: "akin@apradanismanlik.com,atilla@apradanismanlik.com,rahsan@apradanismanlik.com,ozbilgin_1907@hotmail.com", 
        subject: baslik, 
        text: icerik,
      });
      console.log('mail atıldı: ',baslik)
}


async function sunucuStartMail(baslik,icerik){

    var transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth: {
        user: 'apratarimsistem@gmail.com',
        pass: 'ApraTarim2020'
        }       
      });

    var info = await transporter.sendMail({
        from: '"APRA Tarım Sistem" <apratarimsistem@gmail.com>', 
        to: "akin@apradanismanlik.com,atilla@apradanismanlik.com,rahsan@apradanismanlik.com,ozbilgin_1907@hotmail.com", 
        subject: baslik, 
        text: icerik,
      });
      console.log('start maili atıldı: ',baslik)
}

exports.mailAt = mailAt
exports.sunucuStartMail = sunucuStartMail