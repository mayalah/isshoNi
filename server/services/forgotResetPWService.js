import bcrypt from 'bcrypt';
import {createClient} from '@libsql/client';
import 'dotenv/config';

const dbconnector = createClient({
    url: "libsql://isshoni-nhitran26197.turso.io",
    authToken: process.env.DB_TOKEN
});

export const changePasswordService = async(email, password)=>{
    const workfactor = process.env.WORK_FACTOR
    console.log(email)
    const salt = await bcrypt.genSalt(workfactor)
    const hashedPW = await bcrypt.hash(password, salt)
    console.log(hashedPW)
    try{
        await dbconnector.execute({
            sql:'UPDATE user SET password = ? where email =?',
            args:[hashedPW, email]
        })
        console.log("changed password successfully")
        return 'password updated'

    }catch(err){
        console.log("Change password failed")
        return "fail"

    }

}

