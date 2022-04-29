import './App.css';
import { Box, Text, Button, useDisclosure  } from '@chakra-ui/react';
import CardGrid from "./components/CardGrid";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react'

function App() {

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

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
