import { Box, Text, Select, Textarea, Flex, Button, Menu, MenuButton, IconButton, useColorMode, MenuItem, MenuList, InputGroup, Avatar, InputRightElement, Input,useDisclosure, Image, FormControl, FormLabel, HStack, useRadioGroup, useRadio } from '@chakra-ui/react';
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
import { AddIcon } from '@chakra-ui/icons';
import DatePicker from "react-datepicker";
import FileUpload from "../FileUpload";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged  } from "firebase/auth";
import { auth, db, storage } from "../config";
import { useNavigate } from "react-router-dom";
import $ from "jquery";

function Header(){
    let navigate = useNavigate();

    //Sign up and Login modals
    const { isOpen: isOpenLogin, onOpen: onOpenLogin, onClose: onCloseLogin } = useDisclosure()
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
    const [startDate, setStartDate] = useState(null);
    const [showLoginError, setLoginError] = useState(false);
    const [showSubmitError, setSubmitError] = useState(false);
    const [toSend, setFile] = useState(null);
    const [isAuth, setIsAuth] = useState(true);
    const [showLogin, setShowLogin ] = useState(false);
    const handleClickLogin = () => setShowLogin(!showLogin);
    const [profileSrc, setProfilePic] = useState(null);
    
    onAuthStateChanged(auth, (user) => {
      
      //Sets the display name when there is a user
      if (user) {
        //const uid = user.uid;
        setProfilePic(user.photoURL);
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    });

    function login(){
        const email = document.getElementById("LoginEmail").value;
        const password = document.getElementById("LoginPassword").value;
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
            const user = userCredential.user;
            onCloseLogin();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode=="auth/user-not-found"){
            setLoginError(true);
          }
        });
    }

    async function sendData(){
      if ($("#name").val()=="" || $("#time").val()=="Choose Time" || $("#activityType").val()=="Choose Activity" || $("#description").val()=="" || $("#organizer").val()=="" || $("#contact").val()=="" || toSend==null){
        setSubmitError(true);
        return;
      }else{
        setSubmitError(false);
      }
      
      let userId=null;
      if (auth.currentUser){
        userId=auth.currentUser.uid;
      }

      try {
          const storageRef = ref(storage, toSend.name);

          // 'file' comes from the Blob or File API
          uploadBytes(storageRef, toSend).then(() => {
              getDownloadURL(ref(storage, toSend.name))
              .then((url) => {
                 
                  console.log(url);
                  addDoc(collection(db, "activities"), {
                      title: $("#name").val(),
                      time: $("#time").val(),
                      date: $("#date").val(),
                      tags: $("#tags").val(),
                      activityType: $("#activityType").val(),
                      description: $("#description").val(),
                      organizer: $("#organizer").val(),
                      contact: $("#contact").val(),
                      profileSrc: profileSrc,
                      uid: userId,
                      src: url
                  }).then(function() {
                    onCloseAdd();
                    setFile(null)
                    navigate("/dashboard", { replace: true });
                  }).catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                  // Handle any errors
                  console.log(error);
              });
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }     
    }  

    return(
        <>

            <Flex justify={"space-between"} px={"65px"} py={10}>
                <Flex>
                  <a href="/"><Text pr={5}>Discover</Text></a>
                  {isAuth && <a href="/dashboard"><Text pl={5}>Dashboard</Text></a>}
                </Flex>

                <Flex>
                    {isAuth && <Button onClick={onOpenAdd} colorScheme={"linkedin"} variant="outline" mr={7}><AddIcon/>&nbsp;Add Activity</Button>}
                    {!isAuth &&  
                      <Button onClick={onOpenLogin} colorScheme={"green"} id="Login">Log in</Button>}

                    {isAuth &&  
                    <Menu offset={[0, 40]}>
                      <MenuButton
                        as={IconButton}
                        borderRadius={"50%"}
                        variant={"unstyled"}
                        size={"xs"}
                        aria-label='Options'
                        icon={<Avatar src={profileSrc}/>}
                        _focus={{
                          boxShadow:
                            '0 0 0 0',
                        }}/>

                      <MenuList>
                        <a href={"./profile"}>
                          <MenuItem>
                            Edit Profile  
                          </MenuItem>
                        </a>
                        <a href="/"><MenuItem onClick={logOut}>Sign Out</MenuItem></a>
                      </MenuList>
                    </Menu> }
                    </Flex>
            </Flex>



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

                      {showLoginError && <FormLabel mt={2}><Text color={"red"} fontSize={"sm"}>Account does not exist</Text></FormLabel>}
                        <FormLabel mt={3}>Don't have an account? <Text as="u"><a href="/signup">Sign Up</a></Text></FormLabel>
                    </ModalBody>
                  <ModalFooter>
                  <Button onClick={login} colorScheme='green' mr={3}>Submit</Button>
                      <Button onClick={function(){onCloseLogin(); setLoginError(false)}}>Cancel</Button>
                  </ModalFooter>
              </ModalContent>
            </Modal>

                <Modal isOpen={isOpenAdd} onClose={onCloseAdd} size={"lg"}>
            
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Add Activity</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>

                    <FormControl isRequired>
                        
                        <FormLabel >Activity Name</FormLabel>
                        <Input id="name" placeholder='Game Dev. Club'/>
                    </FormControl>
                    
                    <HStack mt={3}>
                        
                        <FormControl isRequired>
                            <FormLabel>Time</FormLabel>
                            <Select placeholder='Choose Time' variant="filled" id="time" isRequired>
                                <option value='Before School'>Before School</option>
                                <option value='Advisory'>Advisory</option>
                                <option value='Lunch'>Lunch</option>
                                <option value='After School'>After School</option>
                                <option value='Entire Day'>Entire Day</option>
                            </Select>
                        </FormControl>
                        
                        <FormControl mt={4}>
                            <FormLabel>Date (Optional)</FormLabel>
                            <DatePicker colorSCheme={"black"} selected={startDate} onChange={(date) => setStartDate(date)} minDate={new Date()} id="date"/>
                        </FormControl>
                        
                    </HStack>

                    <FormControl mt={3} isRequired>
                          <FormLabel>Activity Type</FormLabel>
                          <Select placeholder='Choose Activity' variant="filled" id="activityType" isRequired>
                              <option value='Club'>Club</option>
                              <option value='Sports'>Sports</option>
                              <option value='Academic'>Academic</option>
                              <option value='Miscellaneous'>miscellaneous</option>
                          </Select>
                      </FormControl>

                    <FormControl mt={4} isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea placeholder='Description' id="description" h={"110px"}/>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Tags (comma separated)</FormLabel>
                        <Input placeholder='Programming, Science, English' id="tags"/>
                    </FormControl>

                    <FormControl mt={4} isRequired>
                        <FormLabel>Organizer(s)</FormLabel>
                        <Input placeholder='Phineas and Ferb' id="organizer"/>
                    </FormControl>

                    <FormControl mt={4} isRequired>
                        <FormLabel>Contact Email</FormLabel>
                        <Input placeholder='me@gmail.com' id="contact"/>
                    </FormControl>
                    
                    <FormControl mt={4} isRequired>
                        <FormLabel>Activity Banner</FormLabel>
                        <FileUpload setFile={setFile}/>
                    </FormControl>
                    
                    {showSubmitError && <FormLabel mt={5}><Text color="red" fontSize={"lg"}>Please fill out all inputs</Text></FormLabel>}

                </ModalBody>

                <ModalFooter>
                    <Button onClick={sendData} colorScheme='green' pdy={3} mr={3}>
                    Submit
                    </Button>
                    <Button onClick={onCloseAdd}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
        </Modal>
        </>
    )
}

//Logs a user out
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