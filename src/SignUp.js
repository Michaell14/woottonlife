import { Box, Button } from '@chakra-ui/react';
import React from 'react'; 
import { getAuth, updateProfile , createUserWithEmailAndPassword  } from "firebase/auth";
import { auth } from "./config";

function SignUp(){

    function signUpWithEmail(){
        const firstName = document.getElementById("SignUpFirstName").value;
        const lastName=document.getElementById("SignUpLastName").value;
        const email = document.getElementById("SignUpEmail").value;
        const password = document.getElementById("SignUpPassword").value;
        const passwordConfirm = document.getElementById("SignUpPasswordConfirm").value;
    
        if (password!==passwordConfirm){
            alert("Passwords do not match")
            return;
        }
    
    
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
    
            updateProfile(user, {
                displayName: firstName + " " + lastName,
                photoURL: "https://source.boringavatars.com/marble/40/"+firstName+"%20"+lastName

              }).then(() => {
                // Update successful
                // ...
                alert("Welcome " + user.displayName)
                document.getElementById("displayName").innerHTML="Welcome " + user.displayName;
              })          
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage)
            if (errorCode === "auth/email-already-in-use"){
                alert("This Email account is already in use")
            }
        });
    }
    

    return(
        <Button onClick={signUpWithEmail} colorScheme='green' mr={3}>Submit</Button>
    )
}

export default SignUp;