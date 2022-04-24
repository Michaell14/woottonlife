import React, { useState } from "react";
import { Box, Image, HStack, Flex, Menu, MenuButton, IconButton, Grid, Stack, Avatar, Heading, useColorModeValue, Select, Text, Button, FormControl, FormLabel, Input,MenuList, Textarea, MenuItem  } from '@chakra-ui/react';
import useFirestore from "../hooks/useFirestore";
import { InfoOutlineIcon, SettingsIcon, StarIcon } from "@chakra-ui/icons";
import $ from "jquery"
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
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react'

import DatePicker from "react-datepicker";
import FileUpload from "../FileUpload";
import { doc, getDoc, setDoc, deleteDoc, documentId } from "firebase/firestore";
import {db} from "../config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const storage = getStorage();

function CardGrid(props){
    const [startDate, setStartDate] = useState(null);
    const [deleteDocId, setDeleteDocId] = useState(null);
    const { docs } = useFirestore("activities", props.isDashboard);
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
    const [toSend, setFile] = useState(null);
    const { isOpen: isOpenDeleteDialog, onOpen: onOpenDeleteDialog, onClose: onCloseDeleteDialog } = useDisclosure()
    const cancelRef = React.useRef()

    async function editData(){
        const id=$("#EditSubmitBtn").val();
    
        var toSubmit=[];
        var ids=["Time", "Description", "Name", "Organizer", "Tags", "ActivityType", "Contact", "SubmitBtn"];
        for (let i=0; i<ids.length; i++){
            toSubmit.push($("#Edit"+ids[i]).val())
        }
        setDoc(doc(db, "activities", id), {
            time: toSubmit[0],
            description: toSubmit[1],
            title: toSubmit[2],
            organizer: toSubmit[3],
            tags: toSubmit[4],
            activityType: toSubmit[5],
            contact: toSubmit[6]
        }, { merge: true }).then(() => {
            onCloseAdd();
        })

        if (toSend==null){
            return;
        }
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
            <Grid templateColumns='repeat(4, 1fr)' gap={10} mx={"65px"} mb={"100px"}>
                { docs && docs.map(doc => (

                    <Box key={doc.id} maxW={'460px'} position={"relative"} minW={"240px"} h={"fit-content"} w={'full'} bg="white" _dark={{bg: 'gray.900'}} p={6}
                        boxShadow={'2xl'}
                        rounded={'md'}
                        overflow={'hidden'}>
                        <Box bg={'gray.100'} mt={-6} mx={-6} mb={6} minH={"120px"} maxH={"190px"} pos={'relative'}>
                            <Image
                                objectFit='cover'
                                src={doc.src}
                                minW={"full"}
                                maxH={"120px"}
                                layout={'full'}
                            />
                        </Box>
                        <Stack>
                            <Flex justify={"space-between"}>
                                {doc.activityType && 
                                    <Text
                                    color={'green.500'}
                                    textTransform={'uppercase'}
                                    fontWeight={800}
                                    fontSize={'sm'}
                                    letterSpacing={1.05}>
                                    {doc.activityType}
                                    </Text>}
                                <Text
                                    color={'green.500'}
                                    textTransform={'uppercase'}
                                    fontWeight={800}
                                    fontSize={'sm'}
                                    letterSpacing={1.05}>
                                    {doc.date}
                                </Text>
                            </Flex>
                            
                            <Heading
                                color="gray.700"
                                _dark={{color: "white"}}
                                fontSize={'2xl'}
                                fontFamily={'body'}>
                                {doc.title}
                            </Heading>
                            <Text color={'gray.500'} maxH={"180px"} overflowY={"auto"}>
                                {doc.description}
                            </Text>

                            <Flex flexWrap={"wrap"} mt={5}>
                            {doc.tags.split(", ").map(tag => (
                               <Text bg={"green.100"} key={tag} color="black" fontSize={"12px"} h={"fit-content"} mr={3} mb={2} p={"2.6px 6.6px"} borderRadius={"3px"}>{tag}</Text> 
                            ))}
                        </Flex>
                        </Stack>
                            <HStack align={"end"}>
                            <Stack mt={5} direction={'row'} spacing={4} align={'center'}>
                                <Image
                                    src={doc.profileSrc}
                                    alt={'Organizer'}
                                />
                                <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                                    <Text fontWeight={600}>{doc.organizer}</Text>
                                    <Text color={'gray.500'}>{doc.contact}</Text>
                                </Stack>
                            </Stack>
                            
                            {props.isDashboard &&
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        aria-label='Options'
                                        icon={<SettingsIcon />}
                                        variant="ghost"
                                        position={"absolute"} bottom={5} right={5}
                                    />

                                    <MenuList>
                                        <MenuItem onClick={function(){ fillCardData(doc.id); onOpenAdd()}} minH='44px'>
                                            <Text>Edit</Text>
                                        </MenuItem>
                                        <MenuItem onClick={function(){ setDeleteDocId(doc.id); onOpenDeleteDialog()}} value={doc.id} minH='40px'>
                                            <Text color="red">Delete</Text>
                                        </MenuItem>
                                        
                                    </MenuList>
                            </Menu>}
                            {/*}
                            {!props.isDashboard && 
                                
                                <Menu>
                                    <MenuButton
                                        bg="whiteAlpha"
                                        as={IconButton}
                                        aria-label='Options'
                                        icon={<InfoOutlineIcon />}
                                    />
                                    <MenuList>
                                        <MenuItem>Add to List&nbsp;&nbsp;<StarIcon/></MenuItem>                                   
                                    </MenuList>
                                </Menu>
                            }*/}
                            </HStack>
                    </Box>
                    
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
                
                <FormControl mt={3} isRequired>
                          <FormLabel>Activity Type</FormLabel>
                          <Select placeholder='Choose Activity' variant="filled" id="EditActivityType" isRequired>
                              <option value='Club'>Club</option>
                              <option value='Sports'>Sports</option>
                              <option value='Academic'>Academic</option>
                              <option value='Miscellaneous'>Miscellaneous</option>
                          </Select>
                      </FormControl>

                <FormControl mt={5}>
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

        <AlertDialog
            isOpen={isOpenDeleteDialog}
            leastDestructiveRef={cancelRef}
            onClose={onCloseDeleteDialog}
        >
            <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Event
                </AlertDialogHeader>

                <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onCloseDeleteDialog}>
                    Cancel
                </Button>
                <Button colorScheme='red' onClick={function(){ deleteCard(deleteDocId); onCloseDeleteDialog()}} ml={3}>
                    Delete
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
                            
        </>
    )
}

async function fillCardData(id){
    console.log(1)
    const docRef = doc(db, "activities", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data=docSnap.data();
        var ids=["Time", "Description", "Name", "Organizer", "Tags", "ActivityType", "Contact", "SubmitBtn"];
        var currData=[data.time, data.description, data.title, data.organizer, data.tags, data.activityType, data.contact, id];

        for (let i=0; i<ids.length; i++){
            $("#Edit"+ids[i]).val(currData[i]);
        }
    } else {
        alert("There is no data available");
    }
}

async function deleteCard(id){
    await deleteDoc(doc(db, "activities", id));
}

export default CardGrid;