import React from 'react';
import { Badge, Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { StarIcon, ViewIcon } from '@chakra-ui/icons';

export default function RepoCardComponent(props) {
  return (
    <Flex marginTop={5} w="full" alignItems="center" justifyContent="center" cursor={'pointer'} onClick={() => props.onClick()}>
      <Box onClick={() => props.onClick()} borderWidth="1px" maxW={'320px'} w={'full'} cursor={'pointer'} bg={useColorModeValue('white', 'gray.800')} boxShadow={'lg'} rounded={'lg'} p={6} minW={450} textAlign={'left'}>
        <Box d="flex" alignItems="baseline">
          <Badge rounded="full" px="2" fontSize="0.8em">
            {props.repo.private ? 'Privé' : 'Public'}
          </Badge>
          <Badge rounded="full" px="2" colorScheme={'orange'} fontSize="0.8em" ml={1}>
            <StarIcon w={3} h={3} /> {props.repo.stargazers_count}
          </Badge>
          <Badge rounded="full" colorScheme={'blue'} px="2" fontSize="0.8em" ml={1}>
            <ViewIcon w={3} h={3} /> {props.repo.watchers}
          </Badge>
        </Box>
        <Text fontWeight={'bold'} fontSize={20} mt={2}>
          {props.repo.name} <Badge>{props.repo.owner.login}</Badge>
        </Text>
        <Text fontSize={13} mt={2}>
          {props.repo.description}
        </Text>
      </Box>
    </Flex>
  );
}
