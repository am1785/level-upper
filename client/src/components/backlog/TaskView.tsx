import React, {useState} from "react";
import { Box, Heading, Stack, StackDivider, Text, Card, CardHeader, CardBody, CardFooter, Tag, Link, HStack, VStack } from '@chakra-ui/react'
import Markdown from 'react-markdown';
import { useParams } from "react-router-dom";
import { useOneTaskData } from "../../hooks/useTasksData";
import TaskEditModal from "../task/TaskEditModal";

//@ts-ignore
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
//@ts-ignore
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useQueryClient } from "@tanstack/react-query";
import { useAuthData } from "../../hooks/useAuthData";

// import { userData } from "../home/Ongoing";

const TaskView: React.FC = () => {
    // TODO: USER AUTH, task view can be public facing but editing requires matching user info

    const { status:userDataStatus, data: userData, error:userDataError } = useAuthData();

    const {task_id} = useParams();
    const { status, data } = useOneTaskData(task_id ? task_id : "");
    const queryClient = useQueryClient();

    return(<>
        {status === "success" && data.title && data.title.length > 0 ? <Card>
        <CardHeader>
            <VStack justifyContent={'flex-start'}>
            <Heading size='md'>{data.title}</Heading>
            {/* <Heading size='xs'>{userData.nickname && userData.nickname.length > 1 ? userData.nickname: userData.username}</Heading> */}
            </VStack>
        </CardHeader>

        <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
            <Box>
                <Link href={data.link} pt={'2'} fontSize={'sm'} textColor={'blue.500'}>
                    {data.link}
                </Link>
            </Box>
            <Box>
                <Text pt={'2'} fontSize={'sm'}>
                    {data.skills?.map((s:any, id:any) => (
                    <Tag key={id} m={'1'}>{s}</Tag>
                    ))}
                </Text>
            </Box>
            <div>
                <article className="markdownView">
                <Markdown remarkRehypeOptions={{}} components={{
                    code(props) {
                        const {children, className, node, ...rest} = props
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                        <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            children={String(children).replace(/\n$/, '')}
                            language={match[1]}
                            style={atomDark}
                        />
                        ) : (
                        <code {...rest} className={className}>
                            {children}
                        </code>
                        )
                    }
                // , h1: "h2"}}>{data.content}</Markdown> <= substitute h1 for h2 tags
                }}>{data.content}</Markdown>
                </article>
            </div>
            </Stack>
        </CardBody>
        <CardFooter justifyContent={'end'}>
            <Stack divider={<StackDivider />} spacing='4' direction={"row"}>
                {data.title && data.title.length > 0 && userData && userData.user && userData.user.id === data.author && <Box>
                    <TaskEditModal task_id={data?._id} className="backlog" onSuccess={()=>{queryClient.invalidateQueries({queryKey: ['fetchOngoingTask']})}} />
                </Box>}
                <Box alignContent={'center'}>
                    <Text fontSize={'xs'}>updated {new Date(data.updatedAt).toLocaleDateString()} {new Date(data.updatedAt).toLocaleTimeString()}</Text>
                </Box>
            </Stack>
        </CardFooter>
        </Card> : <Card mt={1}>Entry Not Found</Card>}
    </>)
}

export default TaskView;