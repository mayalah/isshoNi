import {createClient} from '@libsql/client';
import nodemailer from 'nodemailer';
import {v4 as uuid} from 'uuid';
import 'dotenv/config';

const dbconnector = createClient({
    url: "libsql://isshoni-nhitran26197.turso.io",
    authToken: process.env.DB_TOKEN
});

//create a nodemailer transporter
const transporter = nodemailer.createTransport({
service: 'gmail',
auth:{
    user: process.env.GMAIL_USER,
    pass:process.env.GMAIL_PW
}
})
// sending mail confirmations
export const sendingMail = async (fastify, usermail)=>{

    const token = await fastify.jwt.sign({email: usermail}, {expiresIn: '10m'})

    const url_id= uuid()
    const res= await dbconnector.execute({
        sql:'INSERT INTO email_verification(id, email, token) VALUES(?,?,?)',
        args : [url_id, usermail, token]
    })

const mailConfiguration = {
    from: process.env.GMAIL_USER,
    to : usermail,
    subject: "Account Verification",
    text:`Please follow the given link to verify your email 
        http://localhost:${process.env.PORT}/api/user/verify/${url_id}  
        Thanks`
}

try{
    await transporter.sendMail(mailConfiguration)
    console.log("Email sent successfully")
    return 
}catch(err){
    console.log(err.message)
    return 
}

}
export const verifyEmailService= async(fastify, id)=>{
    const res= await dbconnector.execute({
        sql:'SELECT token FROM email_verification WHERE id =?',
        args : [id]
    })

    const token = res.rows[0].token
    const decode = await fastify.jwt.verify(token)
    const email = decode.email

    try{
        await dbconnector.execute({
            sql:'UPDATE user SET email_confirmed = 1 WHERE email =?',
            args : [email]
        }) 
    }catch(err){
        console.log("err at update")
        return ("failed")
    }
    try{
        
        await dbconnector.execute({
            sql:'DELETE FROM email_verification WHERE id =?',
            args : [id]
        })
    }catch(err){
        console.log("err at")
        return ("failed")
    }
    console.log("success")
        return("success")
   

}