import bcrypt from 'bcrypt'
import {createClient} from '@libsql/client';
import 'dotenv/config';
import {promisify} from 'util';
import {v4 as uuid} from 'uuid';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

const dbconnector = createClient({
    url: "libsql://isshoni-nhitran26197.turso.io",
    authToken: process.env.DB_TOKEN
});

const compare = promisify(bcrypt.compare)

export const authentication = async(email, password)=>{  
    const res = await dbconnector.execute({
        sql:'select email, password, email_confirmed from user where email = ? ',
        args: [email]
    })

    if (res.rows){
            const user = res.rows[0]
            if (!user.email_confirmed){
                return "account not confirmed"
            }
            const hashedpw = user.password           
            const result = await compare(password, hashedpw)
            
            if (result){
                console.log("login success")
                return "login success"
                
            }else{
                console.log("password is not correct")
                return "password is not correct"
            } 
    }else{
        console.log("account does not exist")
        return "account does not exist"
    }

}

export const verifyGoogleAccount = async( credential) =>{
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const googleID = payload['sub']
    const email = payload['email']
    const pictureURL = payload['picture']
    const name = payload['name']
    const userID = uuid()

    let res = await dbconnector.execute({
        sql:"select googleID from user where email = ?",
        args:[email]
    })

    if (res.rows.length === 0){

        await dbconnector.execute({
            sql:"INSERT INTO user (userID, googleID, email, name, pictureURL, email_confirmed) VALUES (?,?,?,?,?,?)",
            args: [userID, googleID, email, name,pictureURL, 1]
        })
        res = await dbconnector.execute({
            sql:"select googleID from user where email = ?",
            args:[email]
        })
        
    }
    const googleIDResult = res.rows[0].googleID
        
    if (googleID === googleIDResult){
        console.log("login ggl account success")
        return email
    }else{
        console.log("login to ggl account failed")
        return "fail"
    } 

}