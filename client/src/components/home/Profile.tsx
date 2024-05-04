import { useState, useEffect } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useToast, SlideFade, Box, Stack, Input, Text,  Card, Heading, CardBody, StackDivider,  IconButton, Icon, Radio, RadioGroup } from "@chakra-ui/react";
import { userData } from "./Ongoing";
import { useLogoutMutation } from "../../hooks/useAuthMutation";
import { useEditUserMutation } from "../../hooks/useUsersMutation";
import { useOneUserData } from "../../hooks/useUsersData";

export type ProfileProps = {
    userData: userData
}

const Profile:React.FC<ProfileProps> = ({userData}) => {

    const {data, status, error} = useOneUserData(userData.id);
    const {data: logoutData, mutate:logoutUserMutation, status: logoutStatus} = useLogoutMutation();
    const {data: editData, mutate:editUserMutation, status:editStatus} = useEditUserMutation();
    const toast = useToast();

    const [isNameDisabled, setIsNameDisabled] = useState(true);
    const [isPassDisabled, setIsPassDisabled] = useState(true);

    let user = userData.username;
    if (data && status === "success") {
        user = data.nickname && data.nickname.length > 0 ? data.nickname : data.email;
    }

    const currHour = new Date().getHours();

    useEffect(() => {
        if(editStatus === "success") {
            toast({
                title: 'info',
                description: "Edit success",
                status: 'info',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [data])

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
                    <IconButton zIndex={1} position={'absolute'} aria-label="change nickname" right={5} icon={<EditIcon />} onClick={() => setIsNameDisabled(prev => !prev)} />
                    <Input type="text" disabled={isNameDisabled} defaultValue={userData.nickname}></Input>
                </Box>
                <Box>
                    <Heading size='xs' mb={2}>
                    password
                    </Heading>
                    <IconButton zIndex={1} position={'absolute'} aria-label="change password" right={5} icon={<EditIcon />} onClick={() => setIsPassDisabled(prev => !prev)}/>
                    <Input type="password" disabled={isPassDisabled} defaultValue={'12345'}></Input>
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
                    <IconButton w="4em" h={'2em'} colorScheme="red" aria-label="delete account button" icon={<DeleteIcon />} />
                </Box>
                <Box>
                    <Heading size='xs' mb={2}>
                    logout
                    </Heading>
                    <IconButton w="4em" h={'2em'} colorScheme="blue" aria-label="logout button" onClick={() => logoutUserMutation()}
                    icon={<Icon viewBox="0 0 512 512" fill="currentColor"> <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></Icon>} />
                </Box>
                </Stack>
            </CardBody>
        </Card>
    </Stack>}
    </>)
}

export default Profile;