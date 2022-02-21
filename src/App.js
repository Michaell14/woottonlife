import logo from './logo.svg';
import './App.css';
import Header from "./components/Header"
import { Box, Flex, Text, HStack } from '@chakra-ui/react';
import {Link} from "react-router-dom";


function App() {
  return (
    <>      
      
      <Flex justify={"center"} align={"center"} opacity={1} id={"maininfo"}>
        <Box w={"500px"}>
          <Text fontSize={"5xl"}>Learn more about Wootton</Text>
          <Text fontSize={"xl"}>This is a listing of General wootton activities. Discover what to do before, during, and after
          school with #WoottonLife</Text>
        </Box>
        <img src="/friends.svg" width={"30%"}></img>
      </Flex>
    </>
  );
}

export default App;
