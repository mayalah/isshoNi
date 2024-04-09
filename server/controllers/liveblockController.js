import { Liveblocks } from '@liveblocks/node';
import {getUserInfoService} from "../services/liveblocksService.js";
import 'dotenv/config';
import {createClient} from '@libsql/client';


const dbconnector = createClient({
    url: "libsql://isshoni-nhitran26197.turso.io",
    authToken: process.env.DB_TOKEN
});
const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY});
export const liveblocksAuth =async (request, reply)=>{
    const email = request.body.userEmail;


    const userInfo = await getUserInfoService(email);

    const userIndex = userInfo.email
    const session = liveblocks.prepareSession(userIndex,{
        userInfo:{
            // email: userInfo.email,
           name: userInfo.email,
          image: userInfo.pictureURL
        }
      });
    session.allow("*", session.FULL_ACCESS);
    const {status, body}= await session.authorize();

    reply.code(status).send(body);


}
async function getUser(userId){
  const res = await dbconnector.execute({
    sql: 'SELECT email, name, pictureURL FROM user WHERE email = ?',
    args: [userId]
  });
  return {
    name: res.rows[0].email.split('@')[0],
    avatar: res.rows[0].pictureURL
  }
}
export const resolveUsers = async (request, reply)=>{

  const userIds = Array.isArray(request.query.userIds)
    ? request.query.userIds
    : [request.query.userIds];
  console.log("userIds", userIds)
    // if (!userIds || !Array.isArray(userIds)) {
    //   reply.status(400).send('Missing or invalid userIds');
    // }
    const users = await Promise.all(userIds.map((userId) => getUser(userId)));

    reply.status(200).send(users);
}




