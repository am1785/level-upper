import { Image, Flex } from "@chakra-ui/react"
import { Tabs, TabList, Tab } from '@chakra-ui/react'
import { NavLink as ReactRouterLink, useLocation } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'

import logo from '../assets/img/logo.png'
import '../App.css'

export default function Root() {
    const location = useLocation();

    return (
      <>
        <Flex align="center" justify="center">
          <Image className="logo" src={logo} alt="levelupper Logo" />
        </Flex>
        <nav>
          <Tabs w="100%" align="center" variant="soft-rounded">
            <TabList>
              <Flex w="100%" justify="space-around" mb="4">
                <Tab border="0px">
                  <ChakraLink
                    as={ReactRouterLink}
                    to="/"
                    fontSize="md"
                    // sx={isOngoingActive ? {color: "gray.800", fontWeight: "600", backgroundColor: "gray.100", rounded:"full", p:"6px"} : {color: "gray.500", fontWeight: "500"}}
                  >
                    ongoing
                  </ChakraLink>
                </Tab>
                <Tab border="0px">
                  <ChakraLink
                    as={ReactRouterLink}
                    to="/backlog"
                    fontSize="md"
                    // sx={isBacklogActive ? {color: "gray.800", fontWeight: "600", backgroundColor: "gray.100", rounded:"full", p:"6px"} : {color: "gray.500", fontWeight: "500"}}
                  >
                    backlog
                  </ChakraLink>
                </Tab>
                <Tab border="0px">
                  <ChakraLink
                    as={ReactRouterLink}
                    to="/mylevel"
                    fontSize="md"
                    // sx={isMyLevelActive ? {color: "gray.800", fontWeight: "600", backgroundColor: "gray.100", rounded:"full", p:"6px"} : {color: "gray.500", fontWeight: "500"}}
                  >
                    my level
                  </ChakraLink>
                </Tab>
              </Flex>
            </TabList>
          </Tabs>
        </nav>
      </>
    );
  }