import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { RecoilRoot } from 'recoil';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';

const root = createRoot(document.getElementById('root'));

const theme = extendTheme({
	config: {
		initialColorMode: 'dark',
		useSystemColorMode: false
	},
});

root.render(
	<RecoilRoot>
		<ChakraProvider theme={theme}>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<App />
		</ChakraProvider>
	</RecoilRoot>,
);
