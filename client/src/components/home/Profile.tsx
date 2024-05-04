import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { SlideFade, Box, Stack, Input, Text,  Card, Heading, CardBody, StackDivider,  IconButton, Icon, Radio, RadioGroup } from "@chakra-ui/react";
import { userData } from "./Ongoing";

export type ProfileProps = {
    userData: userData
}

const Profile:React.FC<ProfileProps> = ({userData}) => {
    const user = userData.username; // TODO user auth

    const currHour = new Date().getHours();

    // TODO: email, password (change pass modal), language, joined since, delete account, log out
    return (<>
    <Stack mt={2} direction={'column'} alignItems={'center'}>
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
                    user@example.com
                    </Text>
                </Box>
                <Box>
                    <Heading size='xs' mb={2}>
                    nickname
                    </Heading>
                    <IconButton zIndex={1} position={'absolute'} aria-label="change password" right={5} icon={<EditIcon />}/>
                    <Input type="text" disabled defaultValue={user}></Input>
                </Box>
                <Box>
                    <Heading size='xs' mb={2}>
                    password
                    </Heading>
                    <IconButton zIndex={1} position={'absolute'} aria-label="change password" right={5} icon={<EditIcon />}/>
                    <Input type="password" disabled defaultValue={'12345'}></Input>
                </Box>
                <Box>
                    <Heading size='xs' mb={2}>
                    language
                    </Heading>
                    <RadioGroup defaultValue='1'>
                    <Stack spacing={5} direction='row'>
                        <Radio value='1' size={'sm'}>
                        English
                        </Radio>
                        <Radio value='2' size={'sm'}>
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
                    04-26 2024
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
                    <IconButton w="4em" h={'2em'} colorScheme="blue" aria-label="logout button" icon={<Icon viewBox="0 0 512 512" fill="currentColor"> <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></Icon>} />
                </Box>
                </Stack>
            </CardBody>
        </Card>
    </Stack>
    </>)
}

export default Profile;