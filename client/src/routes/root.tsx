import { Image, Flex } from "@chakra-ui/react"
import { Tabs, TabList, Tab } from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'

import logo from '../assets/img/logo.png'
import '../App.css'

export default function Root() {

    return (
        <>
        <Flex align="center" justify="center">
          <Image className='logo' src={logo} alt='levelupper Logo' />
        </Flex>
        <nav>
        <Tabs w="100%" align='center' variant='line'>
        <TabList>
        <Flex w="100%" justify='space-around' mb='4'>
            <Tab border='0px'>
                <ChakraLink as={ReactRouterLink} to='/' fontSize='md' _activeLink={{ fontWeight: "bold" }}>
                    ongoing
                </ChakraLink>
            </Tab>
            <Tab border='0px'>
                <ChakraLink as={ReactRouterLink} to='/backlog' fontSize='md'>
                    backlog
                </ChakraLink>
            </Tab>
            <Tab border='0px'>
                <ChakraLink as={ReactRouterLink} to='/mylevel' fontSize='md'>
                    my level
                </ChakraLink>
            </Tab>
        </Flex>
        </TabList>
        </Tabs>
        </nav>
        </>
      )

}