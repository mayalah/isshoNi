import {createClient} from '@libsql/client';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';
import {sendingMail} from "./mailService.js";

import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

// connect to Turso DB

const dbconnector = createClient({
    url: "libsql://isshoni-nhitran26197.turso.io",
    authToken: process.env.DB_TOKEN,
    });


const hashedPW = async function hashingPassword(userID,email, password){
    const workfactor = process.env.WORK_FACTOR          
    const salt = await bcrypt.genSalt(workfactor)

    try{
        const hashedpw = await bcrypt.hash(password, salt)

        try{
            const updateDB = dbconnector.execute({
                sql:'UPDATE user SET userID= ?, password =? WHERE email =?',
                args : [userID,hashedpw,email]
            })
            return "success"
        }catch(e){
            return "fail"
        }
    }catch(e){
        console.log(e.message)
        return "Fail"
    }
}
export const signUpService = async(fastify,email, password, username) =>{
    try {
        await dbconnector.execute({
            sql: 'INSERT INTO user(email, name) VALUES(?,?)',
            args: [email, username]
        });
        const id = uuid()
        await hashedPW(id,email,password)
        await sendingMail(fastify, email)
        return "SignUp successfully"

    } catch (e) {
        console.error(e.message); 
        reply.send({message: "email exists"})
    }
}
export const  addUserSignUpWithGoogle = async (credential) =>{

    try{
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
        const user = await dbconnector.execute({
            sql: 'SELECT * FROM user WHERE googleID = ?',
            args: [googleID]
        })


        if (user.rows.length > 0){
            return {message: "success",name:name, email: email, image: pictureURL}
        }
        
        await dbconnector.execute({
            sql:"INSERT INTO user (userID, googleID, email, name, pictureURL, email_confirmed) VALUES (?,?,?,?,?,?)",
            args: [userID, googleID, email, name,pictureURL, 1]
        })
        return {message: "success", name:name, email: email, image: pictureURL}
    }catch(e){
        return {message: "fail",  name:"", email: "", image: ""}
    }
}


