import Fastify from "fastify";
import "dotenv/config";
import cors from "@fastify/cors";
import userRoutes from "./routes/userRoutes.js";
// import FastifyJwt from '@fastify/jwt';
// import cookie from '@fastify/cookie';
import auth from "./services/authService.js";

const fastify = Fastify({logger: false})


fastify.register(cors, {
    origin: ["http://localhost:3000"],
    methods: ["GET","POST"]
})
// fastify.register(FastifyJwt, {
//     secret: process.env.JWT_SECRET,
//      cookie: {
//         cookieName : 'token'
//      }
//   })


// fastify.register(cookie)
// fastify.decorate("authenticate", async function(request, reply){
//     try{
//         console.log(request.cookies.token)           
//         const decode = await fastify.jwt.verify(request.cookies.token)
//         request.email = decode.email
//         console.log(email)

//     }catch(err){
//         console.log(err)
//         reply.status(401).send({message: "Authentication failed"})
//     }
// })
fastify.register(auth)
fastify.register( userRoutes, {prefix:"/api/user"})

fastify.listen({port: process.env.PORT}).then(()=>{
    console.log(`sever is running on ${process.env.PORT}`)
}).catch((e)=>{
    fastify.log(e)
    process.exit(1);
})