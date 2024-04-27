import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useToast, Text, Button, FormControl, Heading, Input, InputGroup, InputRightElement, VStack, SlideFade } from "@chakra-ui/react";
import { useState } from "react";
import { NavLink as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'

const Register:React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [show, setShow] = useState(false);
    const toast = useToast();

    const handleClick = () => setShow((prev) => !prev);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        confirmPassword === password ?
        console.log(`registering: ${email}, ${password}`) :
        toast({
            title: 'warning',
            description: "passwords do not match",
            status: 'warning',
            duration: 2000,
            isClosable: true,
          })
    }
    return (
    <main>
        <SlideFade in={true} delay={.5}>
        <VStack gap={5} mt={2}>
            <Heading size={'lg'} fontWeight={300}>
                sign up
            </Heading>
            <Text fontSize={'sm'}>start leveling up today!</Text>
            <form onSubmit={(e) => handleSubmit(e)}>
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
                    {password && password.length > 0 && <FormControl isRequired>
                        <Input size='md' borderColor={"gray.500"} isRequired type={show ? 'text' : 'password'} placeholder='confirm password' onChange={(e) => (setConfirmPassword(e.currentTarget.value))} />
                    </FormControl>}
                </VStack>
                <Button size={'md'} w={'300px'} type='submit' colorScheme='blue' sx={{marginTop: '1em'}}>continue</Button>
            </form>
            <Text mt={-1}>already have an account? <ChakraLink
                    ml={2}
                    as={ReactRouterLink}
                    to="/login"
                  >
                    login
                  </ChakraLink></Text>
        </VStack>
        </SlideFade>
    </main>)
}

export default Register;