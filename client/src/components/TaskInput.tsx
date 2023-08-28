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

const [currTag, setCurrTag] = useState('');
const [tags, setTags] = useState<string[] | null>();
const toast = useToast();

function addTag(t:string){
  if(t.length > 0) {
  tags ? setTags(prev => [...prev as string[], t.toLowerCase()]) : setTags([t.toLowerCase()]);
  setCurrTag('');
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
<form onSubmit={handleSubmit}>
<FormControl isRequired>
  <FormLabel>title</FormLabel>
  <Input isRequired type='text' placeholder='title' onChange={(e) => setTitle(e)}/>
</FormControl>

<FormControl mt={'1em'}>
  <FormLabel>link</FormLabel>
  <Input type='text' placeholder='any links'/>
</FormControl>

<FormControl mt={'1em'}>
  <FormLabel>skills</FormLabel>
  <HStack mb={'.5em'} wrap='wrap'>
  {tags ? tags.map((t, id)=> (
    <Tag key={id}>{t}</Tag>
  )): <Tag>add skill tags from below</Tag>}
  </HStack>
  <InputGroup>
    <Input type='text' value={currTag} placeholder='skill tags' onChange={(e)=>setCurrTag(e.currentTarget.value)}/>
    <InputRightElement width={'5em'}>
    {/* <Button h='1.75rem' size='sm' onClick={() => {addTag(currTag); setCurrTag('');}}> */}
      <Button h='1.75rem' size='sm' onClick={(e) => {addTag(currTag); setTag(e)}}>
          + tag
      </Button>
    </InputRightElement>
  </InputGroup>
</FormControl>

<FormControl isRequired mt={'1em'}>
  <FormLabel>exp</FormLabel>
  <NumberInput max={12} min={0} placeholder='exp from completion'>
    <NumberInputField  onChange={(c) => {setExp(c)}}/>
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