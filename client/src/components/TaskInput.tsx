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
  } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons';

export type InputProps = {
    onCancel: () => void;
    handleSubmit: () => void;
    setTitle: (e: React.FormEvent<HTMLInputElement>) => void;
    setExp: (e: React.FormEvent<HTMLInputElement>) => void;
    setTag: (e: any) => void;
    addingTags: boolean;
}

const TaskInput: React.FC<InputProps> = ({handleSubmit, onCancel, setTitle, setExp, setTag}) => {

type taskForm = {
title: string;
link?: string;
skills: Set<string> | null;
exp: number;
}

const [form, setForm] = useState<taskForm>({
title : '',
link : '',
skills : new Set(),
exp : -1
});

const [currTag, setCurrTag] = useState('');
const [tags, setTags] = useState<Set<string> | null>();
const toast = useToast();

async function submitForm(){
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

function addTag(t:string) {
  if(t.length > 0) {
  tags ? setTags(prev => new Set([...prev as Set<string>, t.toLowerCase()])) : setTags(new Set([t.toLowerCase()]));
  setCurrTag('');
  setTag(t);
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
<Heading as={'h1'} size={'sm'}>add a task</Heading>
<form onSubmit={() => {submitForm(); handleSubmit();}}>
<FormControl isRequired>
  <FormLabel>title</FormLabel>
  <Input isRequired type='text' placeholder='title' onChange={(e) => {setTitle(e); updateForm({title:e.currentTarget.value})}}/>
</FormControl>

<FormControl mt={'1em'}>
  <FormLabel>link</FormLabel>
  <Input type='text' placeholder='any links'/>
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
      <Button h='1.75rem' size='sm' onClick={(e) => {addTag(currTag)}}>
      {/* <Button h='1.75rem' size='sm' onClick={(e) => setTag(e)}> */}
          + tag
      </Button>
    </InputRightElement>
  </InputGroup>
</FormControl>

<FormControl isRequired mt={'1em'}>
  <FormLabel>exp</FormLabel>
  <NumberInput max={12} min={0} placeholder='exp from completion'>
    <NumberInputField  onChange={(c) => {setExp(c); updateForm({exp: c.currentTarget.value})}}/>
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
</FormControl>
  <HStack justifyContent={'space-around'}>
<Button sx={{marginTop: '1em'}} onMouseDown={()=>onCancel()}>cancel</Button>
<Button type='submit' sx={{marginTop: '1em'}}><AddIcon sx={{marginRight:'10px'}}/>add</Button>
</HStack>
</form>
</>)
}

export default TaskInput;