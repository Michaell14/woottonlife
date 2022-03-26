import logo from './logo.svg';
import './App.css';
import Header from "./components/Header"
import { Box, Flex, Text, Center } from '@chakra-ui/react';
import {Link} from "react-router-dom";


function App() {
  return (
    <>      
      
      <Center id={"maininfo"}>
        <Box w={"450px"} mr={"100px"}>
          <Text fontSize={"5xl"} id="T1">Learn more about Wootton</Text>
          <Text fontSize={"xl"} id="T2">This is a listing of General wootton activities, open to everyone. 
          Discover what to do before, during, and even after school with WoottonLife!</Text>
        </Box>
        <img src="/friends.svg" width={"30%"}></img>
      </Center>
    </>
  );
}

export default App;
