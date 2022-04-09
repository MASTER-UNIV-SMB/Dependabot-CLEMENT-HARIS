import React from 'react';
import { Box, Center, useColorModeValue } from '@chakra-ui/react';

export default function UICardComponent(props) {
  return (
    <Center py={6}>
      <Box maxW={'320px'} w={'full'} bg={useColorModeValue('white', 'gray.900')} boxShadow={'2xl'} rounded={'lg'} p={6} minW={450} textAlign={'left'}>
        {props.children}
      </Box>
    </Center>
  );
}
