import React, { useEffect, useState } from "react";
import $ from "jquery"
import DatePicker from "react-datepicker";
import FileUpload from "../FileUpload";
import {db, auth} from "../config";
import { onAuthStateChanged } from "firebase/auth";

//import Chakra UI components
import { Box, Image, HStack, Flex, IconButton, Grid, Stack, Heading, Select, Text, Button, FormControl, FormLabel, Input, Textarea, filter, Icon  } from '@chakra-ui/react';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton} from '@chakra-ui/react';
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, } from '@chakra-ui/react'
import { SettingsIcon } from "@chakra-ui/icons";
import {FiHeart} from "react-icons/fi";
import { BsFilter } from "react-icons/bs";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
  } from '@chakra-ui/react'

//import firebase libraries
import useFirestore from "../hooks/useFirestore";
import { doc, getDoc, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

function CardGrid(props){
    const [startDate, setStartDate] = useState(null);
    const [deleteDocId, setDeleteDocId] = useState(null);
    const [filters, setFilter] =useState(["Club", "Sports", "Academic", "Miscellaneous"]);
    const [sortType, setSortType] = useState("Recent");
    const [isAuth, setIsAuth] = useState(true);
 
    //Modal disclosures
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
    const { isOpen: isOpenProfile, onOpen: onOpenProfile, onClose: onCloseProfile } = useDisclosure()
    const { isOpen: isOpenDeleteDialog, onOpen: onOpenDeleteDialog, onClose: onCloseDeleteDialog } = useDisclosure()
    const [toSend, setFile] = useState(null);
    const cancelRef = React.useRef()

    var {docs}=useFirestore("activities", props.isDashboard);

    onAuthStateChanged(auth, (user) => {
        //Sets the display name when there is a user
        if (user) {
            setIsAuth(true);
            
        } else {
            setIsAuth(false);
        }
      });

    //Sort function
    function sortCards(a,b){
        if (sortType=="Recent"){
            return b.uploadDate-a.uploadDate;
        }else if (sortType=="Oldest"){
            return a.uploadDate-b.uploadDate;
        }else if (sortType=="Popular"){
            return b.list.length-a.list.length;
        }else if (sortType=="Alphabetical"){
            return a.title.localeCompare(b.title);
        }
    }

    //Adds an activity to the user's liked activities
    async function likeActivity(docId){
        const userRef=doc(db, "activities", docId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()){
            if (docSnap.data().list.includes(auth.currentUser.uid)){
                await updateDoc(userRef, {
                    list: arrayRemove(auth.currentUser.uid)
                });
            }else{
                await updateDoc(userRef, {
                    list: arrayUnion(auth.currentUser.uid)
                })
            }
        }
    }

    //Sets a filter
    function addFilter(filter){
        if (filters.includes(filter)){
            const index=filters.indexOf(filter);
            const temp = [...filters];
            temp.splice(index, 1);
            setFilter(temp);
        }else{
            setFilter(filters => [...filters, filter])
        }
      }

    //Edits card data
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

        //Handles updating the background banner
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
            <Box w={"100%"} pl={"65px"} pb={5}>
                <Menu closeOnSelect={false}>
                <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<BsFilter size={20}/>}
                variant='outline'
            />
            <MenuList minWidth='240px'>
                <MenuOptionGroup title='Order' onChange={(e) => setSortType(e)} defaultValue={"Recent"} type='radio'>
                    <MenuItemOption value='Recent'>Recent</MenuItemOption>
                    <MenuItemOption value='Oldest'>Oldest</MenuItemOption>
                    <MenuItemOption value='Popular'>Popular</MenuItemOption>
                    <MenuItemOption value='Alphabetical'>Alphabetical</MenuItemOption>
                </MenuOptionGroup>
                <MenuDivider />
                <MenuOptionGroup defaultValue={["Club", "Sports", "Academic", "Miscellaneous"]} title='Activity Type' type='checkbox'>
                    <MenuItemOption onClick={() => addFilter("Club")} isChecked={true} value='Club'>Club</MenuItemOption>
                    <MenuItemOption onClick={() => addFilter("Sports")} value='Sports'>Sports</MenuItemOption>
                    <MenuItemOption onClick={() => addFilter("Academic")} value='Academic'>Academic</MenuItemOption>
                    <MenuItemOption onClick={() => addFilter("Miscellaneous")} value='Miscellaneous'>Miscellaneous</MenuItemOption>
                </MenuOptionGroup>
            </MenuList>
            </Menu></Box>


            <Grid templateColumns='repeat(4, 1fr)' gap={10} mx={"65px"} mb={"100px"} overflow={"wrap"}>
                { docs && docs.filter((doc) => {if (filters.includes(doc.activityType)){return doc;}}).sort(sortCards).map(doc => (
                     
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
                                

                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        borderRadius={"50%"}
                                        variant={"unstyled"}
                                        aria-label='Options'
                                        icon={<Image src={doc.profileSrc}/>}
                                        alt={'Organizer'}
                                        _focus={{
                                        boxShadow:
                                            '0 0 0 0',
                                        }}/>

                                    <MenuList>
                                        
                                        <MenuItem>
                                            <Text onClick={function(){fillProfileInfo(doc.uid); onOpenProfile()}}>View Profile</Text>  
                                        </MenuItem>
                                    </MenuList>
                                    </Menu>

                                <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                                    <Text fontWeight={600}>{doc.organizer}</Text>
                                    <Text color={'gray.500'}>{doc.contact}</Text>
                                </Stack>
                            </Stack>
                            
                            {isAuth && 
                                <Button
                                as={IconButton}
                                aria-label='Options'
                                icon={<FiHeart size={"17px"} fill={doc.list.includes(auth.currentUser.uid) ? "#e31b23" : "rgba(0,0,0,0)"}/>}
                                variant="ghost"
                                position={"absolute"} top={3} right={3}
                                size={"xs"}
                                h={8}
                                color={"#e31b23"}

                                onClick={function() {likeActivity(doc.id)}}
                            />

                            }

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

        <Modal onClose={onCloseProfile} isOpen={isOpenProfile} isCentered>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader id="profileName">Name</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text id="profileBio">Bio</Text>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onCloseProfile}>Close</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

//Fills in modal information
async function fillCardData(id){
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

//Deletes a card
async function deleteCard(id){
    await deleteDoc(doc(db, "activities", id));
}

//Fills in profile info
async function fillProfileInfo(uid){
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()){
        $("#profileName").html(docSnap.data().firstName + " "+ docSnap.data().lastName);
        $("#profileBio").html(docSnap.data().bio);
    }
}

export default CardGrid;