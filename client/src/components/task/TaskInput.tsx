import React, { useState } from 'react'
import {
    FormControl,
    Input,
    Select,
    FormLabel,
    Button,
    HStack,
    Tag,
    InputRightElement,
    InputGroup,
    useToast,
    Heading,
    Textarea,
    Switch,
  } from '@chakra-ui/react'
import { AddIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { OngoingTask } from './TaskOngoing';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as taskApi from '../../api/tasks';

export type InputProps = {
    recentTasks: OngoingTask[]; // for auto complete capabilities
    onCancel: () => void;
}

export type taskForm = {
  title: string;
  link?: string;
  content?: string;
  skills: string[];
  exp: number;
  recurring: boolean;
  author: string;
  status: string;
  }

const TaskInput: React.FC<InputProps> = ({recentTasks, onCancel}) => {

const queryClient = useQueryClient();

const { mutate } = useMutation({
  mutationFn: (variables: taskForm) => taskApi.addTask(variables),
  mutationKey: ['addTask'],
});

const addTaskMutation = async () =>
  await mutate(form, {
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({queryKey: ['addTask']});
      queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
      onCancel();
    },
  })

const [form, setForm] = useState<taskForm>({
title : '',
link : '',
content : "",
skills : [],
exp : 1,
recurring: false,
author: "default",
status: "ongoing"
});

const [currTag, setCurrTag] = useState('');
const [tags, setTags] = useState<Set<string> | null>();

const toast = useToast();

async function submitForm(event:any){
  event.preventDefault();
  addTaskMutation();
}

function updateForm(value:any) {
  return setForm((prev) => {
    return { ...prev, ...value };
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
  // console.log(`deleted tag ${tag}`)
  // console.log(`current set: ${ newTags ? new Array(...newTags).join(' ') : 'none'}`)
  updateForm({skills:Array.from(newTags as Set<string>)});
  setTags(newTags);
}

return (<>
<Heading as={'h1'} size={'sm'}>add task</Heading>
<form onSubmit={(e) => {submitForm(e);}}>
<FormControl isRequired>
  <FormLabel>title</FormLabel>
  <Input isRequired type='text' placeholder='title' onChange={(e) => {updateForm({title:e.currentTarget.value})}}/>
</FormControl>

<FormControl mt={'1em'}>
  <FormLabel>link</FormLabel>
  <Input type='text' placeholder='any links' onChange={(e) => {updateForm({link:e.currentTarget.value})}}/>
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
  <Select variant='filled' placeholder='' onChange={(e)=>updateForm({exp: Number(e.currentTarget.value)})}>
    <option value='1'>XS (1)</option>
    <option value='2'>S (2)</option>
    <option value='4'>M (4)</option>
    <option value='8'>L (8)</option>
    <option value='12'>XL (12)</option>
</Select>
</FormControl>

<FormControl mt={'1em'}>
  <FormLabel>content</FormLabel>
  <Textarea maxLength={4000} placeholder='plain text or markdown' onChange={(e)=>updateForm({content:e.currentTarget.value})} />
</FormControl>

<FormControl mt={'1em'} display='flex' alignItems='center'>
  <FormLabel htmlFor='recurring' mb='0'>
    Recurring?
  </FormLabel>
  <Switch id='recurring' onChange={(e)=>{updateForm({recurring:!form.recurring})}}/>
</FormControl>

<HStack justifyContent={'space-around'}>
    <Button sx={{marginTop: '1em'}} onMouseDown={()=>onCancel()}>cancel</Button>
    {/* <Button sx={{marginTop: '1em'}} onMouseDown={()=>onCancel()}>send to backlog</Button> */}
    <Button type='submit' sx={{marginTop: '1em'}}><AddIcon sx={{marginRight:'10px'}}/>submit</Button>
</HStack>
</form>
</>)
}

export default TaskInput;