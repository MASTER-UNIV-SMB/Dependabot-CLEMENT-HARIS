import React from 'react';
import ReactDOM from 'react-dom';
import './styles/app.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';
import theme from './Theme';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <>
        <App />
        <ToastContainer limit={1} draggableDirection={'y'} />
      </>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
