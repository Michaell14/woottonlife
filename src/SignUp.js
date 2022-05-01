import React from 'react'; 
import { updateProfile , createUserWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink,signInWithEmailLink, reload  } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { db } from "./config";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import { getAuth } from "firebase/auth";
import { Flex, Box, FormControl, FormLabel, FormHelperText, Input, InputGroup, useToast,HStack,InputRightElement,Stack,Button,Heading,Text,useColorModeValue} from '@chakra-ui/react';

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'http://localhost:3000/',
  handleCodeInApp: true,
};

var auth=getAuth();
function SignUp(){
    let navigate = useNavigate();

    //Creates a new user and adds them to firebase
    async function addNewUser(uid, firstName, lastName, email, password){
      await setDoc(doc(db, "users", uid), {
        firstName: firstName,
        lastName: lastName,
        bio: "👋Hey, I am....🏂My hobbies include....",
        email: email,
        password: password
      });
    }
    
    //Signs a new person in with email
    function signUpWithEmail(){
        const firstName = $("#firstName").val();
        const lastName= $("#lastName").val();
        const email =  $("#email").val();
        const password =  $("#password").val();
        
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;   
              
              //Sends them a verification email
            sendSignInLinkToEmail(auth, email, actionCodeSettings)
            .then(() => {
              console.log("Log in was successful")
              // The link was successfully sent. Inform the user.
              // Save the email locally so you don't need to ask the user for it again
              // if they open the link on the same device.
              window.localStorage.setItem('emailForSignIn', email);
              // ...
                updateProfile(user, {
                  displayName: firstName + " " + lastName,
                  photoURL: "https://source.boringavatars.com/beam/40/"+firstName+"%20"+lastName

                }).then(() => {
                //Adds user
                  addNewUser(user.uid, firstName, lastName, email, password)

                  navigate("/", { replace: true });
                  window.location.reload();
              })
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode);
              console.log(errorMessage);
            });
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
    
    const [showPassword, setShowPassword] = useState(false);

    return(
        <>
        
        <Flex
      minH={'60vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('white', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText>We will send you a verification email.</FormHelperText>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                onClick={signUpWithEmail}
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign up
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
        
        </>
    )
}

export default SignUp;