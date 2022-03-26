import { Box, HStack, Flex, useColorModeValue, Select, Text, Button, FormControl, FormLabel, Input,Center, Textarea, background  } from '@chakra-ui/react';
import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import CardGrid from "./components/CardGrid"
import { getAuth } from "firebase/auth";
import { db } from "./config";
import { AddIcon } from '@chakra-ui/icons';
import FileUpload from "./FileUpload";
import { storage } from "./config";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const auth = getAuth();

function Dashboard(){
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
    const [startDate, setStartDate] = useState(null);
    const [toSend, setFile] = useState(null);

    async function sendData(){
        const userId=auth.currentUser.uid;
        
        try {

            const storageRef = ref(storage, toSend.name);

            // 'file' comes from the Blob or File API
            uploadBytes(storageRef, toSend).then(() => {
                getDownloadURL(ref(storage, toSend.name))
                .then((url) => {
                    
                    addDoc(collection(db, "activities"), {
                        title: document.getElementById("AddName").value,
                        time: document.getElementById("AddTime").value,
                        date: document.getElementById("AddDate").value,
                        tags: document.getElementById("AddTags").value,
                        description: document.getElementById("AddDescription").value,
                        organizer: document.getElementById("AddOrganizer").value,
                        contact: document.getElementById("AddContact").value,
                        uid: userId,
                        src: url
                    })
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
        
        <Center>
            <Button onClick={onOpenAdd} colorScheme={"linkedin"} variant="outline" mb={10} ><AddIcon/>&nbsp;Add Activity</Button>
        </Center>
        
        <Modal isOpen={isOpenAdd} onClose={onCloseAdd} size={"lg"}>
            
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Add Activity</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>

                    <FormControl isRequired>
                        
                        <FormLabel >Activity Name</FormLabel>
                        <Input id="AddName" placeholder='Game Dev. Club'/>
                    </FormControl>
                    
                    <HStack mt={2}>
                        
                        <FormControl isRequired>
                            <FormLabel>Time</FormLabel>
                            <Select placeholder='Choose Time' variant="filled" id="AddTime" isRequired>
                                <option value='Before School'>Before School</option>
                                <option value='Advisory'>Advisory</option>
                                <option value='Lunch'>Lunch</option>
                                <option value='After School'>After School</option>
                            </Select>
                        </FormControl>
                        
                        <FormControl mt={4}>
                            <FormLabel>Date (Optional)</FormLabel>
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} minDate={new Date()} id="AddDate"/>
                        </FormControl>
                        
                    </HStack>
                    

                    <FormControl mt={4}>
                        <FormLabel>Tags</FormLabel>
                        <Input placeholder='Programming, Science, English' id="AddTags"/>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Description</FormLabel>
                        <Textarea placeholder='Description' id="AddDescription" h={"120px"}/>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Organizer(s)</FormLabel>
                        <Input placeholder='Phineas and Ferb' id="AddOrganizer"/>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Contact</FormLabel>
                        <Input placeholder='me@gmail.com' id="AddContact"/>
                    </FormControl>
                    
                    <FormControl mt={4}>
                        <FormLabel>Activity Icon</FormLabel>
                        <FileUpload setFile={setFile}/>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={sendData} colorScheme='green' pdy={3} mr={3} id="AddSubmitBtn">
                    Submit
                    </Button>
                    <Button onClick={onCloseAdd}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
        </Modal>
            
        <CardGrid isDashboard={true}/>
        </>
        
    )
}


export default Dashboard;