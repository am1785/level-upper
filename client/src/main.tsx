import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import Root from './routes/root.tsx'
import Ongoing from './components/home/Ongoing.tsx'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route } from 'react-router'
import {BrowserRouter} from "react-router-dom";
import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle, extendTheme } from '@chakra-ui/react'
import Backlog from './components/home/Backlog.tsx'
import Mylevel from './components/home/Mylevel.tsx'
import TaskView from './components/backlog/TaskView.tsx'
import Footer from './components/home/Footer.tsx'

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
        <BrowserRouter>
        <Root />
          <Routes>
              <Route path="/" element = {<Ongoing />} />
              <Route path="/backlog" element = {<Backlog />} />
              <Route path="/mylevel" element = {<Mylevel />} />
              <Route path="/view/:task_id" element = {<TaskView />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </ChakraProvider>
      </QueryClientProvider>
  </React.StrictMode>,
)
