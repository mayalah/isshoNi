import Fastify from "fastify";
import "dotenv/config";
import cors from "@fastify/cors";
import userRoutes from "./routes/userRoutes.js";
// import FastifyJwt from '@fastify/jwt';
// import cookie from '@fastify/cookie';
import auth from "./services/authService.js";
import chatRoutes from "./routes/chatRoutes.js";
import liveblockRoutes from "./routes/liveblocksRoute.js";

const fastify = Fastify({logger: false})


fastify.register(cors, {
    origin: ["http://localhost:3000"],
    methods: ["GET","POST"]
})

fastify.register(auth)
fastify.register( userRoutes, {prefix:"/api/user"})
fastify.register(chatRoutes,{prefix:"/api/chat"})
fastify.register(liveblockRoutes,{prefix:"/api/liveblocks"})

fastify.listen({port: process.env.PORT}).then(()=>{
    console.log(`sever is running on ${process.env.PORT}`)
}).catch((e)=>{
    fastify.log(e)
    process.exit(1);
})