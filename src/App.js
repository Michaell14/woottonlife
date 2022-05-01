import './App.css';
import React, {useEffect} from 'react';
import { Box, Text, Button, useDisclosure, useToast } from '@chakra-ui/react';
import CardGrid from "./components/CardGrid";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react'
import $ from "jquery";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import {auth} from "./config";

if (isSignInWithEmailLink(auth, window.location.href)) {
  let email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    email = window.prompt('Please provide your email for confirmation');
  }
  // The client SDK will parse the code from the link for you.
  signInWithEmailLink(auth, email, window.location.href)
    .then((result) => {
      // Clear email from storage.
      window.localStorage.removeItem('emailForSignIn');
      auth.currentUser.emailVerified=true;
    })
}


function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast()

  useEffect(() => {

    $("#dashboard").removeClass("underline");
    $("#discover").addClass("underline");

    toast({
      title: 'Welcome🥰',
      description: 'This is a listing of General wootton activities, open to everyone. Discover what to do before, during, and even after school at Thomas S. Wootton HS!',
      duration: 3500,
      isClosable: true,
      variant: "subtle",
      position: "top-right",
      containerStyle: {
        width: "450px"
      }
    })
    
  }, [])

  return (
    <Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome🥰</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>This is a listing of General wootton activities, open to everyone. 
            Discover what to do before, during, and even after school with WoottonLife!
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <CardGrid isDashboard={false}/>

    </Box>
  );
}

export default App;
