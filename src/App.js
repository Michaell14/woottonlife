import logo from './logo.svg';
import './App.css';
import Header from "./components/Header"
import { Box, Flex, Text, Center, Button, useDisclosure  } from '@chakra-ui/react';
import {Link} from "react-router-dom";
import CardGrid from "./components/CardGrid";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

function App() {

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  return (
    <Box>      
      {/*}
      <Center id={"maininfo"}>
        <Box w={"450px"} mr={"100px"}>
          <Text fontSize={"5xl"} id="T1">Learn more about Wootton</Text>
          <Text fontSize={"xl"} id="T2">This is a listing of General wootton activities, open to everyone. 
          Discover what to do before, during, and even after school with WoottonLife!</Text>
        </Box>
        <img src="/friends.svg" width={"30%"}></img>
  </Center>*/}

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
