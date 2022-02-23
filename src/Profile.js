import React, {useState} from 'react';
import { Box, Text, Flex, Button, Input,HStack, FormControl, FormLabel,FormHelperText, Textarea, InputRightElement } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react'
import { auth } from "./config";
import { getAuth, updateProfile, onAuthStateChanged  } from "firebase/auth";

function Profile(){

    const { colorMode, toggleColorMode } = useColorMode();
    const [isAuth, setIsAuth] = useState(false);
    const [ displayName, setDisplayName] = useState();
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setDisplayName(user.displayName);
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
      });


    function updateDisplayName(){
        const auth=getAuth();
        const newDisplayName=document.getElementById("updateDisplayName").value;
    
        updateProfile(auth.currentUser, {
            displayName: newDisplayName
        }).then(() =>{
            alert("profile updated. Hello " + auth.currentUser.displayName);
        })
    }


    return (
        <>
            <Flex w={"470px"} mx="auto" flexDirection={"column"} justify="space-between" h={"fit-content"}>
                
                <Text as='u' fontSize={"3xl"} >Edit Profile</Text>


                {isAuth && 
                <FormControl mt={5}>
                    <FormLabel htmlFor='updateDisplayName'>Display Name</FormLabel>

                    <HStack>

                        <Input id='updateDisplayName' placeholder={displayName}/>
                        <Button onClick={updateDisplayName} >Submit</Button>
                    </HStack>
                    <FormHelperText>You should use your name.</FormHelperText>
                </FormControl>}
                
                {isAuth &&
                <FormControl mt={5}>
                    
                    <FormLabel htmlFor='updatePassword'>Bio</FormLabel>
                    <Flex w={"100%"} justify={"space-between"}>
                        <Textarea w={"385px"} h={"140px"} lineHeight={"26px"} placeholder='👋Hey, I am...
🏂My hobbies include...'
                        />
                        <Button w={"75px"} onClick={updateDisplayName} >Submit</Button>
                    </Flex>
                    
                </FormControl>}

                <Button onClick={toggleColorMode} mt={10}>
                    Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
                </Button>
            </Flex>
        </>
    )
}

export default Profile;