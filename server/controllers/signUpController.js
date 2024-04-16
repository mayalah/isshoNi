import {signUpService, addUserSignUpWithGoogle} from "../services/signUpService.js";


export const signUp= async(fastify,request, reply)=>{
    const email = request.body.email;
    const password = request.body.password
    const username = request.body.username
    console.log("backend sign up hit")

    const res = await signUpService(fastify,email, password, username)
    console.log(res)
    if (res === "SignUp successfully"){
        reply.status(200).send({message: 'signup success'}) 
    }else{
        reply.status(500).send({message: 'signup fail'})
    }
        
}

export const signUpWithGoogle = async(fastify, request, reply)=>{
    const credential = request.body.credential


    const res = await addUserSignUpWithGoogle( credential)
    console.log(res)
    if (res.message=== "fail"){
        reply.status(500).send({message: "fail"})
    }else{
        const email = res.email
        const name = res.name
        const image = res.image
        const token = await fastify.jwt.sign({email: email}, {expiresIn: '10d'})

        reply
            .setCookie('token', token, {
            httpOnly: true,
            sameSite: true // alternative CSRF protection
            })
            .code(200)
            .status(200).send({message:"success", name: name, email:email, image:image})
    }
}
