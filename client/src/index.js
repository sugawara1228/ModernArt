import { ColorModeScript, ChakraProvider } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import theme from './Theme';
import { RecoilRoot } from 'recoil';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(

    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <ColorModeScript />
        <App />
      </RecoilRoot>
    </ChakraProvider>

);

serviceWorker.unregister();
reportWebVitals();
