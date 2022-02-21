import logo from './logo.svg';
import './App.css';
import { Box, Flex, Text, Grid, GridItem, Button, FormControl, FormLabel, Input,UnorderedList, ListItem } from '@chakra-ui/react';
import React from 'react';
import CardGrid from "./components/CardGrid";

function Discover(){

    return(
        <>
            <CardGrid isDashboard={false}/>
        </>
    )
}

export default Discover;

  