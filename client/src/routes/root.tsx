import { Image, Flex, Badge, useColorMode, IconButton, Icon } from "@chakra-ui/react"
import { MoonIcon } from "@chakra-ui/icons";
import { Tabs, TabList, Tab } from '@chakra-ui/react'
import { NavLink as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink, useMediaQuery } from '@chakra-ui/react'

import logo from '../assets/img/logo.png'
import logoShortened from '../assets/img/icon.png'
import logoShortenedDark from '../assets/img/icon-dark.png'
import logoDark from '../assets/img/logo-dark.png'
import '../App.css'

export default function Root() {
    const { colorMode, toggleColorMode } = useColorMode();

    const [isDesktop] = useMediaQuery('(min-width: 768px)');

    return (
      <>
        <Flex align="center" justify="space-between">
          {isDesktop ? colorMode === "dark" ? <Image className="logo" src={logoDark} alt="levelupper Logo" />
                                            : <Image className="logo" src={logo} alt="levelupper Logo" />
                     : colorMode === "dark" ? <Image className="logo" src={logoShortenedDark} alt="levelupper Logo" />
                                            : <Image className="logo" src={logoShortened} alt="levelupper Logo" />}
          <nav>
          <Tabs isFitted variant='enclosed' mb={4}>
            <TabList>
              <Flex w="100%" justify="space-between" mb="0">
                <Tab border="0px" p={isDesktop ? "1em" : ".5em"}>
                  <ChakraLink
                    as={ReactRouterLink}
                    to="/"
                    fontSize={isDesktop ? "md" : "xs"}
                    // sx={isOngoingActive ? {color: "gray.800", fontWeight: "600", backgroundColor: "gray.100", rounded:"full", p:"6px"} : {color: "gray.500", fontWeight: "500"}}
                  >
                    tasks
                  </ChakraLink>
                </Tab>
                <Tab border="0px"  p={isDesktop ? "1em" : ".5em"}>
                  <ChakraLink
                    as={ReactRouterLink}
                    to="/backlog"
                    fontSize={isDesktop ? "md" : "xs"}
                    // sx={isBacklogActive ? {color: "gray.800", fontWeight: "600", backgroundColor: "gray.100", rounded:"full", p:"6px"} : {color: "gray.500", fontWeight: "500"}}
                  >
                    log
                  </ChakraLink>
                </Tab>
                <Tab border="0px" p={isDesktop ? "1em" : ".5em"}>
                  <ChakraLink
                    as={ReactRouterLink}
                    to="/mylevel"
                    fontSize={isDesktop ? "md" : "xs"}
                    // sx={isMyLevelActive ? {color: "gray.800", fontWeight: "600", backgroundColor: "gray.100", rounded:"full", p:"6px"} : {color: "gray.500", fontWeight: "500"}}
                  >
                    level
                  </ChakraLink>
                </Tab>
              </Flex>
            </TabList>
          </Tabs>
        </nav>
        <Flex>
          <ChakraLink as={ReactRouterLink} to="/profile">
            <IconButton aria-label="profile" colorScheme="none" color={"gray.400"} _dark={{color:"white"}} icon={<Icon viewBox="0 0 576 512">
              <path
                fill="currentColor"
                d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
              </Icon>}></IconButton>
            </ChakraLink>
          <IconButton aria-label="color mode" colorScheme="none" color={"gray.400"} icon={<MoonIcon />} onClick={toggleColorMode} _dark={{color: 'yellow.300'}}/>
        </Flex>
      </Flex>
      </>
    );
  }