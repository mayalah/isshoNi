import React, {useEffect, useState} from "react";
import { signUpWithGoogleRoute } from "../utils/APIRoutes";
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
            console.log(response.data)
            const res = response.data.message
            console.log(res)

             if (res == "success"){
                    navigate("/home")
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
            theme: "filled_black",
            text: "signin_with",
            shape: "pill",
          });
    
        }
      }, [handleGoogle]);
    return(
      <>
      <nav style={{ padding: "2rem" }}>
        <Link to="/">Go Back</Link>
      </nav>
      <header style={{ textAlign: "center" }}>
        <h1>Login </h1>
      </header>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >

        {loading ? <div>Loading....</div> : <div id="signUpDiv"></div>}
      </main>
      <footer></footer>
    </>
    )
}