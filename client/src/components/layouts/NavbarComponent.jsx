import React from 'react';
import { Box, Button, Flex, Stack, useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import githubWhite from '../../images/github_white.png';
import github from '../../images/github.png';

export default function NavbarComponent() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box bg={useColorModeValue('white', 'gray.900')} px={4} position={'fixed'} w={'100%'} top={0}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box fontWeight={'bold'} fontSize={'1.2em'}>
            Dependabot
          </Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={3}>
              <Button onClick={toggleColorMode}>{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}</Button>
              <a href={'https://github.com/univ-smb-m1-isc-2021/dependabot-coliche-delouvencourt.git'} target={'_blank'}>
                <Button>{colorMode === 'light' ? <img src={github} style={{ height: 20 }} /> : <img src={githubWhite} style={{ height: 20 }} />}</Button>
              </a>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
