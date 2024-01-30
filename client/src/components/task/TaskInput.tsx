import React, { useState } from 'react'
import {
    FormControl,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
    FormLabel,
    Button,
    HStack,
    Tag,
    InputRightElement,
    InputGroup,
    useToast,
    Heading,
    Textarea,
  } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons';
import { OngoingTask } from './TaskOngoing';

export type InputProps = {
    task: OngoingTask;
    onCancel: () => void;
    handleSubmit: () => void;
    setTitle: (e: React.FormEvent<HTMLInputElement>) => void;
    setLink: (e: React.FormEvent<HTMLInputElement>) => void;
    setExp: (e: React.FormEvent<HTMLInputElement>) => void;
    setContent: (e: React.FormEvent<HTMLTextAreaElement>) => void;
    setTag: (e: any) => void;
    setRecurring: (e: React.FormEvent<HTMLInputElement>) => void;
}

const TaskInput: React.FC<InputProps> = ({task, handleSubmit, onCancel, setTitle, setExp, setTag, setContent, setLink, setRecurring}) => {

type taskForm = {
title: string;
link?: string[];
content?: string;
skills: Set<string> | null;
exp: number;
reccuring: boolean;
}

const [form, setForm] = useState<taskForm>({
title : '',
link : [],
content : '',
skills : new Set(),
exp : 1,
reccuring: false
});

const [currTag, setCurrTag] = useState('');
const [currLink, setCurrLink] = useState('');
const [tags, setTags] = useState<Set<string> | null>();

const toast = useToast();

async function submitForm(event:any){
  event.preventDefault();
  console.log(form);
  setCurrTag('');
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
    setCurrTag('');
  }
}

function addTag(t:string) { // using a set to ensure no duplicate tags exist
  if(t.length > 0) {
  tags ? setTags(prev => new Set([...prev as Set<string>, t.toLowerCase()])) : setTags(new Set([t.toLowerCase()]));
  setCurrTag('');
  setTag(tags);
  updateForm({skills: new Set([...form.skills as Set<string>, t.toLowerCase()])});
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

return (<>
<Heading as={'h1'} size={'sm'}>add task</Heading>
<form onSubmit={(e) => {submitForm(e); handleSubmit();}}>
<FormControl isRequired>
  <FormLabel>title</FormLabel>
  <Input isRequired defaultValue={task.title} type='text' placeholder='title' onChange={(e) => {setTitle(e); updateForm({title:e.currentTarget.value})}}/>
</FormControl>

<FormControl mt={'1em'}>
  <FormLabel>link</FormLabel>
  <Input defaultValue={task.link} type='text' placeholder='any links' onChange={(e) => {setLink(e); updateForm({link:e.currentTarget.value})}}/>
</FormControl>

<FormControl mt={'1em'}>
  <FormLabel>skills</FormLabel>
  <HStack mb={'.5em'} wrap='wrap'>
  {tags ? Array.from(tags).map((t, id)=> (
    <Tag key={id}>{t}</Tag>
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
  <NumberInput max={12} min={1} placeholder='exp from completion'>
    <NumberInputField defaultValue={task.exp} onChange={(c) => {setExp(c); updateForm({exp: c.currentTarget.value})}}/>
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
</FormControl>

<FormControl mt={'1em'}>
  <FormLabel>content</FormLabel>
  <Textarea defaultValue={task.content} placeholder='notes or code' onChange={(e)=>setContent(e)} />
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