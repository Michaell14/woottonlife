import React from 'react';
import { Text, Flex, Button, Input,HStack, FormControl, FormLabel, useToast, Textarea } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react'
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { getAuth, updateProfile, onAuthStateChanged  } from "firebase/auth";
import { auth, db } from "./config";
import $ from "jquery";

function Profile(){

    const { colorMode, toggleColorMode } = useColorMode();
    const toast = useToast();

    //Fills in profile information
    async function setBio(uid){
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            $("#updateFirstName").val(docSnap.data().firstName);
            $("#updateLastName").val(docSnap.data().lastName);
            $("#updateBio").val(docSnap.data().bio);
        }
    }

    //Fills in information when user is signed in
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setBio(user.uid);
        }
      });

    //Updates a person's information
    function updateDisplay(){
        const auth=getAuth();

        const newFirstName=$("#updateFirstName").val();
        const newLastName=$("#updateLastName").val();
        const newBio = $("#updateBio").val();
    
        updateProfile(auth.currentUser, {
            displayName: newFirstName + " " + newLastName
        }).then(() =>{
            const userRef = doc(db, 'users', auth.currentUser.uid);

            setDoc(userRef, { 
                firstName: newFirstName,
                lastName: newLastName,
                bio: newBio
            }, { merge: true }).then(() => {
                toast({
                    title: 'Info saved',
                    description: "We've saved your information for you.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                  })
            });
        })
    }


    return (
        <>
            <Flex w={"470px"} mx="auto" flexDirection={"column"} justify="space-between" h={"fit-content"}>
                
                <Text as='b' fontSize={"3xl"} >Edit Profile</Text>

                <HStack mt={5}>
                    <FormControl>       
                        <FormLabel htmlFor='updateFirstName'>First Name</FormLabel>
                        <Input id='updateFirstName'/>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor='updateyLastName'>Last Name</FormLabel>
                        <Input id='updateLastName'/>
                    </FormControl>  
                </HStack>

                <FormControl mt={5}>
                    
                    <FormLabel htmlFor='updateBio'>Bio</FormLabel>
                    <Flex w={"100%"} justify={"space-between"}>
                        <Textarea h={"140px"} lineHeight={"26px"} id="updateBio" />
                    </Flex>
                    
                </FormControl>

                <Button mt={5} colorScheme="green" onClick={updateDisplay} >Save</Button>

                <Button onClick={toggleColorMode} mt={5}>
                    Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
                </Button>
            </Flex>
        </>
    )
}

export default Profile;