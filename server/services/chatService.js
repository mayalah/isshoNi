import {createClient} from '@libsql/client';
import 'dotenv/config';

import {v4 as uuid} from 'uuid';

const dbconnector = createClient({
    url: "libsql://isshoni-nhitran26197.turso.io",
    authToken: process.env.DB_TOKEN
});

export const getAllFriendsService =async (email)=>{
    

    const friends = await dbconnector.execute({
        sql:"select userID, name, email,pictureURL  from user where email in (select friend from friend where user = ?)",
        args:[email]
    })

    console.log(friends.rows)
    return ["success", friends.rows]
}

export const getMessagesService = async (email, friendEmail)=>{
    const messages = await dbconnector.execute({
        sql:"select * from message where (sender = ? and receiver = ?) or (sender = ? and receiver = ?) order by date, time",
        args:[email, friendEmail, friendEmail, email]
    })
    return ["success", messages.rows]
}

export const addMessageService = async (sender, receiver, message)=>{
    const message_id = uuid()
    const time = new Date().toLocaleTimeString()
    const date = new Date().toLocaleDateString().replace(/\//g,"-").split("-").reverse().join("-")

    const res = await dbconnector.execute({
        sql:"insert into message (message_id,sender, receiver, message_content, time, date) values (?,?,?,?,?,?)",
        args:[message_id,sender, receiver, message, time , date]
    })

    return ["success",res.rows]
}

