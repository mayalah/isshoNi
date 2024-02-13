import { verifyEmailService } from "../services/mailService.js";

export const verifyEmail = async(fastify,request, reply) =>{
    const {id} = request.params
        const res = await verifyEmailService(fastify, id)
        if (res === "failed"){
            reply.status(401).send({message: "failed"})
        }else{
            reply.status(200).send({message: "success"})
        }
}