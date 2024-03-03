import { Image, Flex } from "@chakra-ui/react"
import { Tabs, TabList, Tab } from '@chakra-ui/react'
import { NavLink as ReactRouterLink, useLocation } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'

import logo from '../assets/img/logo.png'
import '../App.css'

export default function Root() {
    const location = useLocation();
    const {pathname} = location;


    return (
      <>
        <Flex align="center" justify="center">
          <Image className="logo" src={logo} alt="levelupper Logo" />
        </Flex>
        <nav>
          <Tabs isFitted variant='enclosed' mb={4}>
            <TabList>
              <Flex w="100%" justify="space-around" mb="3">
                <Tab border="0px">
                  {/* <ChakraLink
                    as={ReactRouterLink}
                    to="/"
                    fontSize="md"
                    // sx={isOngoingActive ? {color: "gray.800", fontWeight: "600", backgroundColor: "gray.100", rounded:"full", p:"6px"} : {color: "gray.500", fontWeight: "500"}}
                  >
                    ongoing
                  </ChakraLink> */}
                  <ReactRouterLink to={"/"} end
                  className={({ isActive }) =>`nav-link ${isActive && 'active'}`}>
                    ongoing
                  </ReactRouterLink>
                </Tab>
                <Tab border="0px">
                  {/* <ChakraLink
                    as={ReactRouterLink}
                    to="/backlog"
                    fontSize="md"
                    // sx={isBacklogActive ? {color: "gray.800", fontWeight: "600", backgroundColor: "gray.100", rounded:"full", p:"6px"} : {color: "gray.500", fontWeight: "500"}}
                  >
                    backlog
                  </ChakraLink> */}
                  <ReactRouterLink to={"/backlog"} className={({ isActive }) =>`nav-link ${isActive && 'active'}`}>
                    backlog
                  </ReactRouterLink>
                </Tab>
                <Tab border="0px">
                  {/* <ChakraLink
                    as={ReactRouterLink}
                    to="/mylevel"
                    fontSize="md"
                    // sx={isMyLevelActive ? {color: "gray.800", fontWeight: "600", backgroundColor: "gray.100", rounded:"full", p:"6px"} : {color: "gray.500", fontWeight: "500"}}
                  >
                    my level
                  </ChakraLink> */}
                  <ReactRouterLink to={"/mylevel"} className={({ isActive }) =>`nav-link ${isActive && 'active'}`}>
                    level
                  </ReactRouterLink>
                </Tab>
              </Flex>
            </TabList>
          </Tabs>
        </nav>
      </>
    );
  }