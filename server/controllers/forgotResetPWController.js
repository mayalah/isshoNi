import { sendingMail } from "../services/mailService.js";
import { changePasswordService } from "../services/forgotResetPWService.js";
export const forgotPassword = async(fastify, request, reply)=>{
    const email = request.body.email
    console.log(email)
    try{
        await sendingMail(fastify, email)
        reply.status(200).send({message:"Email sent"})
    }catch(err){
        console.log(err.message)
        reply.status(401).send({message:"Fail"})
    }
}

export const changePassword= async(request, reply)=>{
    const email = request.body.email
    const password = request.body.password
    const res = await changePasswordService(email, password)
    if (res==='password updated'){
        reply.status(200).send({message:"success"})
    }else{
        reply.status(500).send({message:"fail"})
    }
}