import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import Root from './routes/root.tsx'
import Footer from './components/Footer.tsx'
import Ongoing from './components/Ongoing.tsx'
import './index.css'

import { Routes, Route } from 'react-router'
import {BrowserRouter} from "react-router-dom";
import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle, extendTheme } from '@chakra-ui/react'

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
     <ChakraProvider theme={theme}>
        <BrowserRouter>
        <Root />
          <Routes>
              <Route path="/" element= {<Ongoing />} />
              <Route path="/backlog" element={<Ongoing />} />
              <Route path="/mylevel" element={<Ongoing />} />
          </Routes>
        <Footer />
        </BrowserRouter>
      </ChakraProvider>
  </React.StrictMode>,
)
