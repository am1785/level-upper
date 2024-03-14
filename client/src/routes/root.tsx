import { Image, Flex, Badge, useColorMode, IconButton } from "@chakra-ui/react"
import { MoonIcon } from "@chakra-ui/icons";
import { Tabs, TabList, Tab, TabIndicator } from '@chakra-ui/react'
import { NavLink as ReactRouterLink, useLocation } from 'react-router-dom'
import { Link as ChakraLink, useMediaQuery } from '@chakra-ui/react'

import logo from '../assets/img/logo.png'
import logoShortened from '../assets/img/icon.png'
import logoShortenedDark from '../assets/img/icon-dark.png'
import logoDark from '../assets/img/logo-dark.png'
import '../App.css'
import { color } from "framer-motion";

export default function Root() {
    const location = useLocation();
    const {pathname} = location;
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
                    {/* <ReactRouterLink to={"/"} end
                    className={({ isActive }) =>`nav-link ${isActive && 'active'}`}>
                      ongoing
                    </ReactRouterLink> */}
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
                  {/* <ReactRouterLink to={"/backlog"} className={({ isActive }) =>`nav-link ${isActive && 'active'}`}>
                    backlog
                  </ReactRouterLink> */}
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
                  {/* <ReactRouterLink to={"/mylevel"} className={({ isActive }) =>`nav-link ${isActive && 'active'}`}>
                    level
                  </ReactRouterLink> */}
                </Tab>
              </Flex>
            </TabList>
          </Tabs>
        </nav>
          <IconButton aria-label="color mode toggle" colorScheme="none" color={"gray.400"} icon={<MoonIcon />} onClick={toggleColorMode} _dark={{color: 'yellow.300'}}/>
        </Flex>
      </>
    );
  }