
import {authentication, verifyGoogleAccount} from "../services/loginService.js";


export const login = async(fastify, request, reply) =>{

    const email = request.body.email
    console.log(email)
    const password = request.body.password

    const res = await authentication(email, password) 

    if (res == "login success"){
        const token = await fastify.jwt.sign({email: email}, {expiresIn: '10d'})
        reply

            .setCookie('token', token, {
            httpOnly: true,
            sameSite: true // alternative CSRF protection
            })
            .code(200)
            .status(200).send({message:"login success"})

    }else{
        reply.status(401).send({message:res})
    } 
}
export const logOut = async(request, reply)=>{
    console.log("logging out")
    reply.setCookie('token','',{expires:new Date(0), httpOnly: true})
    reply.send({message:"Logged Out"})
}



export const loginWithGoogle = async(fastify,  request, reply)=>{
    
    const credential = request.body.credential


    const res = await verifyGoogleAccount(credential)
    if (res ==="fail"){
        reply.status(401).send({message:"fail"})
   
    }else{
         const email = res
         const token = await fastify.jwt.sign({email: email}, {expiresIn: '10d'})

        reply
            .setCookie('token', token, {
            httpOnly: true,
            sameSite: true // alternative CSRF protection
            })
            .code(200)
            .status(200).send({message:"success"})


    }
}