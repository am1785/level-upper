import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Text, Button, FormControl, Heading, Input, InputGroup, InputRightElement, VStack, SlideFade } from "@chakra-ui/react";
import { useState } from "react";
import { NavLink as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'

const Login:React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [show, setShow] = useState(false)

    const handleClick = () => setShow((prev) => !prev);

    const handleSubmit = () => {
        console.log(`registering: ${email}, ${password}`);
    }
    return (
    <main>
        <SlideFade in={true} delay={.5}>
            <VStack gap={5} mt={2}>
                <Heading size={'lg'} fontWeight={300}>
                    login
                </Heading>
                <Text fontSize={'sm'}>keep leveling up today!</Text>
                <form onSubmit={handleSubmit}>
                    <VStack>
                        <FormControl isRequired w={"300px"}>
                            <Input size='md' borderColor={"gray.500"} isRequired type='email' placeholder='email address*' onChange={(e) => (setEmail(e.currentTarget.value))} />
                        </FormControl>
                        <FormControl isRequired>
                            <InputGroup size='md'>
                                <Input size='md' borderColor={"gray.500"} isRequired type={show ? 'text' : 'password'} placeholder='password*' onChange={(e) => (setPassword(e.currentTarget.value))} />
                                    <InputRightElement width='3.5rem'>
                                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                                        {show ? <ViewOffIcon /> : <ViewIcon />}
                                        </Button>
                                    </InputRightElement>
                            </InputGroup>
                        </FormControl>
                    </VStack>
                    <Button size={'md'} w={'300px'} type='submit' colorScheme='blue' sx={{marginTop: '1em'}}>continue</Button>
                </form>
                <Text mt={-1}>don't have an account? <ChakraLink
                    ml={2}
                    as={ReactRouterLink}
                    to="/register"
                  >
                    sign up
                  </ChakraLink></Text>
            </VStack>
        </SlideFade>
    </main>)
}

export default Login;