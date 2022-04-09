import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
  fonts: {
    heading: 'Aeonik, sans-serif',
    body: 'Aeonik, sans-serif',
  },
};

const theme = extendTheme({
  config,
});

export default theme;
