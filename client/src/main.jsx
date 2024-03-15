import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ChatProvider from './Context/ChatProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>,
);
