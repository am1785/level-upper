import React from "react";
import { Box, Heading, Stack, StackDivider, Text, Card, CardHeader, CardBody, CardFooter, Tag, Link } from '@chakra-ui/react'
import Markdown from 'react-markdown';
import { useQuery } from '@tanstack/react-query';
import * as taskApi from '../../api/tasks';
import { useParams } from "react-router-dom";

//@ts-ignore
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
//@ts-ignore
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism'

const TaskView: React.FC = () => {
    // TODO: USER AUTH
    const user = "default";
    const {task_id} = useParams();
    const { status, data, error } = useQuery({
        queryFn: () => taskApi.fetchView(task_id as string),
        queryKey: ['fetchOngoingTask', { task_id }],
    });


    return(<>
        {status === "success" && <Card>
        <CardHeader>
            <Heading size='md'>{data.title}</Heading>
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
            <Stack divider={<StackDivider />} spacing='4'>
                <Box>
                    <Text fontSize={'xs'}>updated {new Date(data.updatedAt).toLocaleDateString()} {new Date(data.updatedAt).toLocaleTimeString()}</Text>
                </Box>
            </Stack>
        </CardFooter>
        </Card>}
    </>)
}

export default TaskView;