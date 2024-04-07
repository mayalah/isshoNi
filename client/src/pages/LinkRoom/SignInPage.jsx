import React, {useEffect, useState} from "react";
import { signUpWithGoogleRoute } from "../../utils/APIRoutes";
import { Link , useNavigate} from "react-router-dom";
import axios from "axios";
export default function Login(){
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
    const handleGoogle = async (response) => {
        const url = signUpWithGoogleRoute
        const credential =response.credential
        console.log(credential)
        setLoading(true)
        axios.post(url,
          {credential: credential}).then(response =>{
            const data = response.data
            const message = data.message
            console.log(data)

             if (message == "success"){
                localStorage.setItem("userName", data.name)
                localStorage.setItem("userEmail", data.email)
                localStorage.setItem("userImage", data.image)
                console.log(localStorage.getItem("userName"))
                console.log(localStorage.getItem("userEmail"))
                console.log(localStorage.getItem("userImage"))
                navigate("/link")
            }
            setLoading(false)
        }).catch(error =>{
          console.log(error)

        })
    
      }
    useEffect(() => {

        /* global google */

        if (window.google) {
          console.log("render the ggl button")
          google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleGoogle,
          });
          google.accounts.id.renderButton(document.getElementById("signUpDiv"), {
            theme: "filled_white",
            text: "signin_with",
            shape: "pill",
          });
    
        }
      }, [handleGoogle]);
    return(
      <>
        {loading ? <div>Loading....</div> : <div id="signUpDiv"></div>}
    </>
    )
}