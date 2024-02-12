import React, { useState } from "react"
import { OngoingTask } from "./TaskOngoing"
import { Button, FormControl, FormLabel, HStack, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Switch, Tag, Textarea, useDisclosure, useToast } from "@chakra-ui/react"
import { CloseIcon, EditIcon } from "@chakra-ui/icons"
import { taskForm } from "./TaskInput"
import { useQueryClient, UseMutationResult, useMutation } from "@tanstack/react-query"
import * as taskApi from '../../api/tasks'

export type TaskEditProps = {
    task: OngoingTask
}

type TaskId = string;
type TaskUpdate = any;

const TaskEditModal:React.FC<TaskEditProps> = ({task}) => {

    const queryClient = useQueryClient();
    const { mutate }: UseMutationResult<void, unknown, { _id: TaskId; update: TaskUpdate }> = useMutation({
    mutationFn: ({ _id, update }) => taskApi.editTask(_id, update),
    mutationKey: ['editTask'],
    });

    const editTaskMutation = async (_id: TaskId, update: TaskUpdate) => {
    await mutate({ _id, update }, {
        onSuccess: (data, variables, context) => {
        // Handle success if needed
        queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
        queryClient.invalidateQueries({queryKey: ['fetchSkills']});
        },
        // Add other options as needed
    });
    };
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [form, setForm] = useState<taskForm>({
        title : task.title,
        link : task.link,
        content : task.content,
        skills : task.skills,
        exp : task.exp,
        recurring: task.recurring,
        author: task.author,
        status: task.status
        });

        const [currTag, setCurrTag] = useState('');
        const [tags, setTags] = useState(new Set(task.skills));
        const toast = useToast();

    async function submitForm(event:any){
        event.preventDefault();
        // if edited, submit, else don't submit
        JSON.stringify(form) !== JSON.stringify({
            title : task.title,
            link : task.link,
            content : task.content,
            skills : task.skills,
            exp : task.exp,
            recurring: task.recurring,
            author: task.author,
            status: task.status
            }) ?
        editTaskMutation(task._id, form) : resetForm();
      }

      function updateForm(value:any) {
        return setForm((prev) => {
          return { ...prev, ...value };
        });
      }

      function resetForm() {
        setTags(new Set(task.skills));
        setCurrTag('');
        updateForm({
            title : task.title,
            link : task.link,
            content : task.content,
            skills : task.skills,
            exp : task.exp,
            recurring: task.recurring,
            author: task.author,
            status: task.status
            });
      }

      function handleKeyDown (event: React.KeyboardEvent) {
        if(event.key === 'Enter'){
          event.preventDefault();
          addTag(currTag);
        }
      }

      function addTag(t:string) { // using a set to ensure no duplicate tags exist
        if(t.length > 0) {
        tags ? setTags(prev => new Set([...prev as Set<string>, t.toLowerCase()])) : setTags(new Set([t.toLowerCase()]));
        setCurrTag('');
        const newTagsSet = new Set([...form.skills, t.toLowerCase()]);
        updateForm({skills: Array.from(newTagsSet)});
        } else {
            toast({
              title: 'warning',
              description: "tag cannot be empty",
              status: 'info',
              duration: 1250,
              isClosable: true,
            })
        }
      }

      function removeTag(tag:string) {
        const newTags = tags;
        newTags?.delete(tag);
        updateForm({skills:Array.from(newTags as Set<string>)});
        setTags(newTags);
      }
    return (
        <>
          <Button mt={'1em'} mb={'-.25em'} h={"1.25em"} w={"75%"} aria-label='edit task' onClick={onOpen}><EditIcon /></Button>
          <Modal isOpen={isOpen} onClose={onClose} isCentered size={'lg'} scrollBehavior={'inside'}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Task</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
              <form onSubmit={(e) => {resetForm(); submitForm(e);}}>
                <FormControl isRequired>
                <FormLabel>title</FormLabel>
                <Input isRequired type='text' placeholder='title' defaultValue={task.title} onChange={(e) => {updateForm({title:e.currentTarget.value})}}/>
                </FormControl>

                <FormControl mt={'1em'}>
                <FormLabel>link</FormLabel>
                <Input type='text' placeholder='any links' defaultValue={task.link} onChange={(e) => {updateForm({link:e.currentTarget.value})}}/>
                </FormControl>

                <FormControl mt={'1em'}>
                <FormLabel>skills</FormLabel>
                <HStack mb={'.5em'} wrap='wrap'>
                {tags ? Array.from(tags).map((t, id)=> (
                    <Tag key={id}>{t} <CloseIcon fontSize={'.5em'} sx={{ marginLeft: ".75em"}} onClick={()=>removeTag(t)} /></Tag>
                )): <Tag>add skill tags from below</Tag>}
                </HStack>
                <InputGroup>
                    <Input type='text' value={currTag} placeholder='skill tags' onChange={(e)=>setCurrTag(e.currentTarget.value)} onKeyDown={(e) => {handleKeyDown(e);}} />
                    <InputRightElement width={'5em'}>
                    <Button h='1.75rem' size='sm' onClick={() => {addTag(currTag)}}>
                    {/* <Button h='1.75rem' size='sm' onClick={(e) => setTag(e)}> */}
                        + tag
                    </Button>
                    </InputRightElement>
                </InputGroup>
                </FormControl>

                <FormControl isRequired mt={'1em'}>
                <FormLabel>exp</FormLabel>
                <Select variant='filled' defaultValue={task.exp} placeholder='' onChange={(e)=>updateForm({exp: Number(e.currentTarget.value)})}>
                    <option value='1'>XS (1)</option>
                    <option value='2'>S (2)</option>
                    <option value='4'>M (4)</option>
                    <option value='8'>L (8)</option>
                    <option value='12'>XL (12)</option>
                </Select>
                </FormControl>

                <FormControl mt={'1em'}>
                <FormLabel>content</FormLabel>
                <Textarea maxLength={4000} h={'15em'} defaultValue={task.content} placeholder='plain text or markdown' onChange={(e)=>updateForm({content:e.currentTarget.value})} />
                </FormControl>

                <FormControl mt={'1em'} display='flex' alignItems='center'>
                <FormLabel htmlFor='recurring' mb='0'>
                    Recurring?
                </FormLabel>
                <Switch defaultChecked={task.recurring} id='recurring' onChange={(e)=>{updateForm({recurring:!form.recurring})}}/>
                </FormControl>
                <HStack justifyContent={'space-around'} mt={'2em'}>
                    <Button variant='ghost' onClick={() => {resetForm(); onClose()}}>Close</Button>
                    <Button type='submit' colorScheme='blue' onClick={onClose} mr={3}>Save</Button>
                </HStack>
                </form>
              </ModalBody>

              <ModalFooter>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default TaskEditModal;