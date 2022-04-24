import {
    Box,
    chakra,
    Container,
    Stack,
    Text,
    useColorModeValue,
    VisuallyHidden,
  } from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaYoutube,FaSafari, FaChrome } from 'react-icons/fa';
import React, { ReactNode } from 'react';
  
class SocialButton extends React.Component{

  render(){
    return (
      <chakra.button
        bg='blackAlpha.100'
        rounded={'full'}
        w={8}
        h={8}
        cursor={'pointer'}
        as={'a'}
        href={this.props.href}
        target={"_blank"}
        rel={"noreferrer"}
        display={'inline-flex'}
        alignItems={'center'}
        justifyContent={'center'}
        transition={'background 0.3s ease'}
        _hover={{
          bg: 'blackAlpha.200'
        }}
        _dark={{
          bg: "whiteAlpha.100",
          _hover: {
            bg: "whiteAlpha.200"
          }    
        }}
        >
        <VisuallyHidden>{this.props.label}</VisuallyHidden>
        {this.props.children}
      </chakra.button>
    );
  };
}
  
  export default function Footer() {
    return (
      <Box position={"fixed"} id="footer" bottom={0} w={"100vw"} bg={useColorModeValue('gray.50', 'gray.900')} color={useColorModeValue('gray.700', 'gray.200')}>
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}>
          <Text>© 2022 Wootton life. All rights reserved</Text>
          <Stack direction={'row'} spacing={6}>
            <SocialButton label={'Chrome'} href={'https://www2.montgomeryschoolsmd.org/schools/woottonhs/'}>
              <FaChrome />
            </SocialButton>
            <SocialButton label={'YouTube'} href={'https://www.youtube.com/user/WoottonPatriotTV/videos'}>
              <FaYoutube />
            </SocialButton>
            <SocialButton label={'Instagram'} href={'https://www.instagram.com/woottonsga/?hl=en'}>
              <FaInstagram />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    );
}