import { useState, useEffect, useRef } from "react";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { useToast, SlideFade, Box, Stack, Input, Text,  Card, Heading, CardBody, StackDivider,  IconButton, Icon, Radio, RadioGroup, Button, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import { userData } from "./Ongoing";
import { useLogoutMutation } from "../../hooks/useAuthMutation";
import { useEditUserMutation } from "../../hooks/useUsersMutation";
import { useOneUserData } from "../../hooks/useUsersData";
import { useResetPasswordMutation } from "../../hooks/useAuthMutation";

import DeleteAccountAlert from "../profile/DeleteAccountAlert";

export type ProfileProps = {
    userData: userData
}

const Profile:React.FC<ProfileProps> = ({userData}) => {

    const {data, status, error} = useOneUserData(userData.id);
    const {data: logoutData, mutate:logoutUserMutation, status: logoutStatus} = useLogoutMutation();
    const {data: editData, mutate:editUserMutation, status:editStatus} = useEditUserMutation();
    const {data: resetPasswordData, mutate:resetPasswordMutation, status:resetPasswordStatus} = useResetPasswordMutation();
    const toast = useToast();

    const [isNameDisabled, setIsNameDisabled] = useState(true);
    const [isPassDisabled, setIsPassDisabled] = useState(true);
    const nicknameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [nickname, setNickname] = useState<string>(userData.nickname);
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPass, setShowPass] = useState<boolean>(false);

    let user = userData.username;
    if (data && status === "success") {
        user = data.nickname && data.nickname.length > 0 ? data.nickname : data.email;
    }

    const currHour = new Date().getHours();

    useEffect(() => {
        if(editStatus === "success" || resetPasswordStatus === "success") {
            toast({
                title: 'info',
                description: "Edit success",
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        } else if (editStatus === "error" || resetPasswordStatus === "error") {
            toast({
                title: 'info',
                description: "Edit failed",
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [data, resetPasswordData])

    const handleChangeName = () => {
        editUserMutation({_id: userData.id, update: {nickname: nickname}});
        setIsNameDisabled(prev => !prev);
        setNickname("");
    }

    const handlePasswordChange = () => {
        confirmPassword !== newPassword ?
        toast({
            title: 'warning',
            description: "passwords do not match",
            status: 'warning',
            duration: 2000,
            isClosable: true,
          }) : newPassword.length < 5 ?
        toast({
            title: 'warning',
            description: "password too short (>=5)",
            status: 'warning',
            duration: 2000,
            isClosable: true,
          }) :  resetPasswordMutation({email: userData.username, password: newPassword});


        setIsPassDisabled(prev => !prev);
        setNewPassword("");
        setConfirmPassword("");
    }

    return (<>

    {status === "success" && data && <Stack mt={2} direction={'column'} alignItems={'center'}>
        <SlideFade in={true} delay={0.5}>
            <Text fontSize={'xl'}>👋 Good {currHour > 4 && currHour < 12 ? "morning" : currHour > 11 && currHour < 18 ? "afternoon" : "evening"}, <strong>{user}</strong></Text>
        </SlideFade>
        <Card mt={5} w={'360px'}>
            <CardBody  textAlign={'left'}>
                <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                    <Heading size='xs'>
                    email
                    </Heading>
                    <Text pt='2' fontSize='sm'>
                    {userData.username}
                    </Text>
                </Box>
                <Box>
                    <Heading size='xs' mb={2}>
                    nickname
                    </Heading>
                    <InputGroup size='md'>
                        <Input size='md' autoComplete="off" type="text" ref={nicknameRef} disabled={isNameDisabled} defaultValue={userData.nickname} onChange={(e) => (setNickname(e.currentTarget.value))} />
                        <InputRightElement>
                            <IconButton size={'sm'} colorScheme={isNameDisabled ? "gray" : "blue"} aria-label="change nickname" icon={<EditIcon />} onClick={() => {setIsNameDisabled(prev => !prev); setTimeout(()=>{nicknameRef.current?.focus();}, 500)}} />
                        </InputRightElement>
                    </InputGroup>
                    {!isNameDisabled && <SlideFade in={!isNameDisabled} delay={0.5}>
                        <Button isDisabled= {editStatus === "pending"} size={'sm'} w={'200px'} left={'60px'} colorScheme='blue' sx={{marginTop: '1em'}} onClick={handleChangeName}>confirm</Button>
                    </SlideFade>}
                </Box>
                <Box>
                    <Heading size='xs' mb={2}>
                    password
                    </Heading>
                    <InputGroup size='md'>
                        <Input size='md' type="password" disabled defaultValue={12345}/>
                        <InputRightElement>
                            <IconButton size={'sm'} colorScheme={isPassDisabled ? "gray" : "blue"} aria-label="change password" icon={<EditIcon />} onClick={() => {setIsPassDisabled(prev => !prev); setTimeout(()=>{passwordRef.current?.focus();}, 500)}} />
                        </InputRightElement>
                    </InputGroup>
                    {!isPassDisabled && <SlideFade in={!isPassDisabled} delay={0.3}>
                        <VStack mt={'1em'}>
                            <InputGroup size='md'>
                            <Input size='md' type={showPass ? 'text' : 'password'} placeholder="new password" ref={passwordRef} onChange={(e) => (setNewPassword(e.currentTarget.value))} />
                                {/* <Input size='md' type={showPass ? 'text' : 'password'} placeholder="old password" ref={passwordRef} onChange={(e) => (setOldPassword(e.currentTarget.value))} /> */}
                                <InputRightElement>
                                    <IconButton size={'sm'} colorScheme={showPass ? "blue" : "gray"} aria-label="show password" icon={<ViewIcon />} onClick={() => setShowPass(prev => !prev)} />
                                </InputRightElement>
                            </InputGroup>
                                <Input size='md' type={showPass ? 'text' : 'password'} placeholder="confirm password" onChange={(e) => (setConfirmPassword(e.currentTarget.value))} />
                                <Button isDisabled= {editStatus === "pending"} size={'sm'} w={'200px'} colorScheme='blue' onClick={handlePasswordChange}>confirm</Button>
                        </VStack>
                        </SlideFade>}
                </Box>
                <Box>
                    <Heading size='xs' mb={2}>
                    language
                    </Heading>
                    <RadioGroup defaultValue={data.language} onChange={(e) => {editUserMutation({_id: userData.id, update: {language: e}})}}>
                    <Stack spacing={5} direction='row'>
                        <Radio value='English' size={'sm'}>
                        English
                        </Radio>
                        <Radio value='Chinese' size={'sm'}>
                        中文
                        </Radio>
                    </Stack>
                    </RadioGroup>
                </Box>
                <Box>
                    <Heading size='xs'>
                    joined since
                    </Heading>
                    <Text pt='2' fontSize='sm'>
                    {userData.createdAt.toLocaleString().substring(0,10)}
                    </Text>
                </Box>
                <Box>
                    <Heading size='xs' mb={2}>
                    delete account
                    </Heading>
                    {/* <IconButton mt={2} w="200px" h={'1.75em'} left={'60px'} colorScheme="red" aria-label="delete account button" icon={<DeleteIcon />} /> */}
                    <DeleteAccountAlert _id={userData.id}/>
                </Box>
                <Box>
                    <Heading size='xs' mb={2}>
                    logout
                    </Heading>
                    <IconButton mt={2} w="200px" h={'1.75em'} left={'60px'} colorScheme="blue" aria-label="logout button" onClick={() => logoutUserMutation()}
                    icon={<Icon viewBox="0 0 512 512" fill="currentColor"> <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></Icon>} />
                </Box>
                </Stack>
            </CardBody>
        </Card>
    </Stack>}
    </>)
}

export default Profile;