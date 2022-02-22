import { Box, HStack, Flex, Text, Button, FormControl, FormLabel, Input,Center, Textarea  } from '@chakra-ui/react';
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
  import { Select } from '@chakra-ui/react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import CardGrid from "./components/CardGrid"
import { getAuth } from "firebase/auth";
import { db } from "./config";
import { AddIcon } from '@chakra-ui/icons';

const auth = getAuth();

function Dashboard(){
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
    const [startDate, setStartDate] = useState(null);

    return(
        <>  
        
        <Center>
            <Button onClick={onOpenAdd} colorScheme={"red"} variant="outline" mb={10} ><AddIcon/>&nbsp;Add Activity</Button>
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

                </ModalBody>

                <ModalFooter>
                    <Button onClick={sendData} colorScheme='green' mr={3} id="AddSubmitBtn">
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

async function sendData(){
    const userId=auth.currentUser.uid;
    console.log(userId);
    try {
        const docRef = await addDoc(collection(db, "activities"), {
          title: document.getElementById("AddName").value,
          time: document.getElementById("AddTime").value,
          date: document.getElementById("AddDate").value,
          tags: document.getElementById("AddTags").value,
          description: document.getElementById("AddDescription").value,
          organizer: document.getElementById("AddOrganizer").value,
          contact: document.getElementById("AddContact").value,
          uid: userId
        }).then(() =>
         {
             alert("Submitted")
         });
      } catch (e) {
        console.error("Error adding document: ", e);
      }     
}


export default Dashboard;