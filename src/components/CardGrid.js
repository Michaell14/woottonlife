import React from "react";
import { Flex, Text, Grid, GridItem, Button } from '@chakra-ui/react';
import useFirestore from "../hooks/useFirestore";
import { InfoOutlineIcon } from "@chakra-ui/icons";

function CardGrid(props){
    
    const { docs } = useFirestore("activities", props.isDashboard);

    return(
        <>
            <Grid templateColumns='repeat(4, 1fr)' gap={10} mx={40}>
                { docs && docs.map(doc => (
                    <GridItem className={"card"} w={"100%"} key={doc.id} h={"fit-content"} maxW={"300px"} bg={"#3A506B"} position="relative" p={5} pb={20} borderRadius={"7px"}>
                        
                        <Flex justify={"space-between"} mx={"5px"}>
                            <Text>LOGO</Text>
                            <Text>Heart</Text>
                        </Flex>
                        <Text fontSize="xl" fontWeight={"bold"} mt={5}>{doc.title}</Text>
                        <Flex mb={5} justify={"space-between"}>
                            <Text fontSize={"sm"}>{doc.time}</Text>
                            <Text fontSize={"sm"}>{doc.date}</Text>
                        </Flex>
                        <Text maxH={"120px"} overflowY={"auto"} id={"description"}>{doc.description}</Text>
                        <Flex flexWrap={"wrap"} mt={5}>
                            {doc.tags.split(", ").map(tag => (
                               <Text bg={"#30292F"} key={tag} color="#E2E8F0" fontSize={"12px"} h={"fit-content"} mr={3} mb={2} p={"2.6px 6.6px"} borderRadius={"3px"}>{tag}</Text> 
                            ))}
                        
                        </Flex>
                        
                        <Flex position={"absolute"} bottom={5} justify="space-between" w={"85%"}>
                            <Text>CLUB</Text>
                            <InfoOutlineIcon/>
                        </Flex>
                    </GridItem>
                ))}
            </Grid>
        </>
    )
}

export default CardGrid;