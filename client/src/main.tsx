import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import Root from './routes/root.tsx'
import Footer from './components/Footer.tsx'
import Ongoing from './components/Ongoing.tsx'
import './index.css'

import { Routes, Route } from 'react-router'
import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <ChakraProvider>
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
