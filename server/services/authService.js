import fp from 'fastify-plugin';
import FastifyJwt from '@fastify/jwt';
import 'dotenv/config';
import cookie from '@fastify/cookie';
const auth = fp(async function(fastify, options){

    fastify.register(FastifyJwt, {
        secret: process.env.JWT_SECRET,
         cookie: {
            cookieName : 'token'
         }
      })
   
    fastify.register(cookie)

    fastify.decorate("authenticate", async function(request, reply){
        try{
            console.log(request.cookies.token)           
            const decode = await fastify.jwt.verify(request.cookies.token)
            request.email = decode.email
            console.log(request.email)


        }catch(err){
            console.log(err)
            reply.status(401).send({message: "Authentication failed"})
        }
})

})
export default auth;