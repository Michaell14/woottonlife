import React, { useState } from "react";
import { Box, Image, HStack, Flex, Menu, Grid, GridItem, MenuButton, IconButton, useColorModeValue, Select, Text, Button, FormControl, FormLabel, Input,MenuList, Textarea, MenuItem  } from '@chakra-ui/react';
import useFirestore from "../hooks/useFirestore";
import { InfoOutlineIcon, SettingsIcon } from "@chakra-ui/icons";
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
import FileUpload from "../FileUpload";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import {db} from "../config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const storage = getStorage();

function CardGrid(props){
    const [startDate, setStartDate] = useState(null);
    const { docs } = useFirestore("activities", props.isDashboard);
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
    const cardBg = useColorModeValue('#C7E8F3', '#3A506B')
    const [toSend, setFile] = useState(null);

    async function editData(){
        const id=document.getElementById("EditSubmitBtn").value;
    
        var toSubmit=[];
        var ids=["Time", "Description", "Name", "Organizer", "Tags", "Contact", "SubmitBtn"];
        for (let i=0; i<ids.length; i++){
            toSubmit.push(document.getElementById("Edit"+ids[i]).value)
        }
        setDoc(doc(db, "activities", id), {
            time: toSubmit[0],
            description: toSubmit[1],
            title: toSubmit[2],
            organizer: toSubmit[3],
            tags: toSubmit[4],
            contact: toSubmit[5]
        }, { merge: true }).then(() =>{
            console.log(toSend.name)
        })

        try {

            const storageRef = ref(storage, toSend.name);

            // 'file' comes from the Blob or File API
            uploadBytes(storageRef, toSend).then(() => {
                getDownloadURL(ref(storage, toSend.name))
                .then((url) => {
                
                    setDoc(doc(db, "activities", id), {
                        src: url
                    }, { merge: true }).then(() =>{
                        console.log(toSend.name)
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
            <Grid templateColumns='repeat(4, 1fr)' gap={10} mx={40}>
                { docs && docs.map(doc => (
                    <GridItem className={"card"} w={"100%"} minW={"260px"} key={doc.id} boxShadow='2xl' h={"fit-content"} maxW={"300px"} bg={cardBg} position="relative" p={5} pb={20} borderRadius={"7px"}>
                        
                        <Flex justify={"space-between"} mx={"5px"}>
                            <Image src={doc.src} boxSize='40px' borderRadius={"full"} fallbackSrc='https://s3-us-west-2.amazonaws.com/scorestream-team-profile-pictures/7558/20210401175559_308_mascotOrig.png'/>
                            <Text>❤</Text>
                        </Flex>
                        <Text fontSize="xl" fontWeight={"bold"} mt={5}>{doc.title}</Text>
                        <Flex mb={5} justify={"space-between"}>
                            <Text fontSize={"sm"}>{doc.time}</Text>
                            <Text fontSize={"sm"}>{doc.date}</Text>
                        </Flex>
                        <Text maxH={"120px"} overflowY={"auto"} id={"description"}>{doc.description}</Text>
                        <Flex flexWrap={"wrap"} mt={5}>
                            {doc.tags.split(", ").map(tag => (
                               <Text bg={"#30292F"} key={tag} color="#E2E8F0" fontSize={"12px"} h={"fit-content"} mr={3} mb={2} p={"2.6px 6.6px"} borderRadius={"3px"}>{tag}</Text> 
                            ))}
                        </Flex>
                        
                        <Flex position={"absolute"} bottom={5} justify="space-between" w={"85%"}>
                            {props.isDashboard &&
                            <Menu>
                            <MenuButton
                                as={IconButton}
                                aria-label='Options'
                                icon={<SettingsIcon />}
                                variant="ghost"
                                position={"absolute"} 
                                right={0}
                                bottom={0}
                            />{/* onOpenAdd */}
                                <MenuList>
                                    <MenuItem onClick={function(event){ fillCardData(doc.id); onOpenAdd()}} minH='44px'>
                                        <Text>Edit</Text>
                                    </MenuItem>
                                    <MenuItem onClick={function(event){ deleteCard(doc.id)}} value={doc.id} minH='40px'>
                                        <Text color="red">Delete</Text>
                                    </MenuItem>
                                    
                                </MenuList>
                            </Menu>}
                        </Flex>
                    </GridItem>
                ))}
            </Grid>

            <Modal isOpen={isOpenAdd} onClose={onCloseAdd} size={"lg"}>
            
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Edit Activity</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>

                <FormControl isRequired>
                    
                    <FormLabel >Activity Name</FormLabel>
                    <Input id="EditName" placeholder="Game Dev. Club"/>
                </FormControl>
                
                <HStack mt={2}>
                    
                    <FormControl isRequired>
                        <FormLabel>Time</FormLabel>
                        <Select placeholder='Choose Time' variant="filled" id="EditTime" isRequired>
                            <option value='Before School'>Before School</option>
                            <option value='Advisory'>Advisory</option>
                            <option value='Lunch'>Lunch</option>
                            <option value='After School'>After School</option>
                        </Select>
                    </FormControl>
                    
                    <FormControl mt={4}>
                        <FormLabel>Date (Optional)</FormLabel>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} minDate={new Date()} id="EditDate"/>
                    </FormControl>
                    
                </HStack>
                

                <FormControl mt={4}>
                    <FormLabel>Tags</FormLabel>
                    <Input placeholder='Programming, Science, English' id="EditTags"/>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Description</FormLabel>
                    <Textarea placeholder="Description" id="EditDescription" h={"120px"}/>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Organizer(s)</FormLabel>
                    <Input placeholder='Phineas and Ferb' id="EditOrganizer"/>
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Contact</FormLabel>
                    <Input placeholder='me@gmail.com' id="EditContact"/>
                </FormControl>
                
                <FormControl mt={4}>
                    <FormLabel>Activity Icon</FormLabel>
                    <FileUpload setFile={setFile}/>
                </FormControl>
            </ModalBody>

            <ModalFooter>
                <Button onClick={editData} colorScheme='green' pdy={3} mr={3} id="EditSubmitBtn">
                Submit
                </Button>
                <Button onClick={onCloseAdd}>Cancel</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
                            
        </>
    )
}

async function fillCardData(id){

    const docRef = doc(db, "activities", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data=docSnap.data();
        var ids=["Time", "Description", "Name", "Organizer", "Tags", "Contact", "SubmitBtn"];
        var currData=[data.time, data.description, data.title, data.organizer, data.tags, data.contact, id];

        for (let i=0; i<ids.length; i++){
            document.getElementById("Edit"+ids[i]).value=currData[i];
        }
    } else {
    // doc.data() will be undefined in this case
        alert("There is some sort of error apparently");
    }
}


async function deleteCard(id){
    await deleteDoc(doc(db, "activities", id));
}

export default CardGrid;