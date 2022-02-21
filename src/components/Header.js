import { Box, Text, Flex, Button, InputGroup, InputRightElement, Input,useDisclosure, Image, FormControl, FormLabel, HStack, useRadioGroup, useRadio } from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import React, {useState} from 'react'; 
import { Link } from "react-router-dom";
import Avator from "boring-avatars";
  // Import the functions you need from the SDKs you need
import SignUp from "../SignUp";
import { getAuth, updateProfile , createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification  } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { auth } from "../config";


function Header(){

    //Sign up and Login modals
    const { isOpen: isOpenLogin, onOpen: onOpenLogin, onClose: onCloseLogin } = useDisclosure()
    const { isOpen: isOpenSignUp, onOpen: onOpenSignUp, onClose: onCloseSignUp } = useDisclosure()
    const [isAuth, setIsAuth] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false)
    const [showLogin, setShowLogin ] = useState(false);
    const handleClickSignUp = () => setShowSignUp(!showSignUp);
    const handleClickLogin = () => setShowLogin(!showLogin);
    const [displayName, setDisplayName] = useState();
    const [profileSrc, setProfilePic] = useState();
    
    onAuthStateChanged(auth, (user) => {
      if (user) {

        const uid = user.uid;
        setDisplayName(user.displayName);
        setProfilePic(user.photoURL);
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    });

    return(
        <>

            <Flex justify={"space-between"} m={10}>
                
                {isAuth && <Text id="displayName">{displayName}</Text>}
                <Flex>
                    <a href="/discover"><Button>Discover</Button></a>
                    {isAuth && <a href="/dashboard"><Button>Dashboard</Button></a>}
                </Flex>

                <Box>
                    {!isAuth && <Button onClick={onOpenSignUp} variant="outline"  borderWidth={"2px"} colorScheme="green" id="SignUp">Sign Up</Button>}
                    {!isAuth && <Button onClick={onOpenLogin} colorScheme={"green"} id="Login">Log in</Button>}
                    {isAuth && <Image src={profileSrc}/>}
                    {isAuth && <Button onClick={logOut} id="Logout" >Sign Out</Button>}

                    <Modal isOpen={isOpenSignUp} onClose={onCloseSignUp} size={"lg"}>
                        <ModalOverlay />
                        <ModalContent>
                        <ModalHeader>Sign Up</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <HStack>

                                <FormControl isRequired>
                                
                                    <FormLabel >First Name</FormLabel>
                                    <Input id="SignUpFirstName" placeholder='Thomas'/>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Last Name</FormLabel>
                                    <Input id="SignUpLastName" placeholder='Wootton'/>
                                </FormControl>
                            </HStack>

                            <FormControl mt={4} isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input id="SignUpEmail" placeholder='WoottonPatriot12' />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Password</FormLabel>
                                <Input id="SignUpPassword" type={"password"} placeholder="Enter password" />
                            </FormControl>

                            <FormControl mt={4} isRequired>
                                <FormLabel>Confirm Password</FormLabel>

                                <InputGroup size='md'>
                                  <Input
                                    pr='4.5rem'
                                    type={showSignUp ? 'text' : 'password'}
                                    placeholder='Confirm password'
                                    id="SignUpPasswordConfirm"
                                  />
                                  <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClickSignUp}>
                                      {showSignUp ? 'Hide' : 'Show'}
                                    </Button>
                                  </InputRightElement>
                                </InputGroup>

                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <SignUp/> 
                            <Button onClick={onCloseSignUp}>Cancel</Button>
                        </ModalFooter>
                        </ModalContent>
                    </Modal>

                    <Modal isOpen={isOpenLogin} onClose={onCloseLogin}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Login</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input id="LoginEmail" placeholder='Wootton@patriot.com' />
                                </FormControl>

                                <FormControl mt={4} isRequired>
                                    <FormLabel>Password</FormLabel>

                                    <InputGroup size='md'>
                                      <Input
                                        pr='4.5rem'
                                        type={showLogin ? 'text' : 'password'}
                                        placeholder='**********'
                                        id="LoginPassword"
                                      />
                                      <InputRightElement width='4.5rem'>
                                        <Button h='1.75rem' size='sm' onClick={handleClickLogin}>
                                          {showLogin ? 'Hide' : 'Show'}
                                        </Button>
                                      </InputRightElement>
                                    </InputGroup>

                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <Button onClick={login} colorScheme='green' mr={3}>
                                Submit
                                </Button>
                                <Button onClick={onCloseLogin}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                </Box>
            </Flex>

        </>
    )
}

function login(event){
    const email = document.getElementById("LoginEmail").value;
    const password = document.getElementById("LoginPassword").value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
        const user = userCredential.user;
        document.getElementById("displayName").innerHTML="Welcome " + user.displayName;
        console.log(user.uid);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage)
    });
}

function logOut(){
    signOut(auth).then(() => {
      }).catch((error) => {
        console.log(error);
        console.log("Error with signing out")
      });
}


// 1. Create a component that consumes the `useRadio` hook
function RadioCard(props) {
    const { getInputProps, getCheckboxProps } = useRadio(props)
  
    const input = getInputProps()
    const checkbox = getCheckboxProps()
  
    return (
      <Box as='label'>
        <input {...input} />
        <Box
          {...checkbox}
          cursor='pointer'
          borderWidth='1px'
          borderRadius='md'
          boxShadow='md'
          _checked={{
            bg: 'teal.600',
            color: 'white',
            borderColor: 'teal.600',
          }}
          _focus={{
            boxShadow: 'outline',
          }}
          px={4}
          py={2}
        >
          {props.children}
        </Box>
      </Box>
    )
  }

function addCard(){

}
  
// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
function Tabs() {
    const options = ['Athletics', 'Clubs', 'Resources', "Gallery"]

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'tab',
        defaultValue: 'Home',
    })

    const group = getRootProps()

    return (
        <HStack {...group}>
        {options.map((value) => {
            const radio = getRadioProps({ value })
            return (
            <RadioCard key={value} {...radio}>
                {value}
            </RadioCard>
            )
        })}
        </HStack>
    )
}



export default Header;