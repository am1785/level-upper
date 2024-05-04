import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle, extendTheme } from '@chakra-ui/react'
import App from './App'


const queryClient = new QueryClient();

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const sizes = {
  xl: definePartsStyle({
    control: defineStyle({
      boxSize: 12,
      rounded: "full"
    }),
    label: defineStyle({
      fontSize: "3xl",
      marginLeft: 6
    })
  }),
}

export const checkboxTheme = defineMultiStyleConfig({ sizes })

export const theme = extendTheme({
  components: { Checkbox: checkboxTheme },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
     <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
      </QueryClientProvider>
  </React.StrictMode>,
)