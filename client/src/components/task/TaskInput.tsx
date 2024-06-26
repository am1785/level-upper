import React, { useRef, useState } from 'react'
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
    Textarea,
    Switch,
  } from '@chakra-ui/react'
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as taskApi from '../../api/tasks';
import { Trie } from "../../data/trie";
import { userData } from '../home/Ongoing';

export type InputProps = {
    userData: userData; // for auto complete capabilities
    onCancel: () => void;
}

export type taskForm = {
  title: string;
  link?: string;
  content?: string;
  skills: string[];
  exp: number;
  hidden: boolean;
  author: string;
  status: string;
  recurring: string;
  }

const TaskInput: React.FC<InputProps> = ({userData, onCancel}) => {

const queryClient = useQueryClient();

const { mutate } = useMutation({
  mutationFn: (variables: taskForm) => taskApi.addTask(variables),
  mutationKey: ['addTask'],
});

const addTaskMutation = async () =>
  await mutate(form, {
    onSuccess() {
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
hidden: false,
author: userData.id,
status: "ongoing",
recurring: ""
});

const [currTag, setCurrTag] = useState('');
const [tags, setTags] = useState<Set<string> | null>();
const tagsInputRef = useRef<HTMLInputElement>(null);
const recsButtonRef = useRef<HTMLButtonElement>(null);

const [skillRecs, setSkillRecs] = useState<string[]>([]);
const prefixTree = new Trie();
const SKILLS_CACHE:string[] = localStorage.getItem("userSkills") === null ? [] : JSON.parse(localStorage['userSkills']);
for(let skill of SKILLS_CACHE) {
  prefixTree.insert(skill);
}

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
  } else if (event.key === 'ArrowDown') {
    event.preventDefault(); // prevent page from scrolling down
    recsButtonRef.current?.focus();
  }
}

function handleSkillChange(e:React.ChangeEvent<HTMLInputElement>) {
  const tagName:string = e.currentTarget.value;
  setCurrTag(tagName.toLowerCase());
  const recommendations:string[] = tagName.length === 0 ? [] : prefixTree.findWordsStartingWith(tagName);
  setSkillRecs(recommendations);
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

return (<>
<form onSubmit={(e) => {submitForm(e);}}>
<FormControl isRequired>
  <FormLabel>title</FormLabel>
  <Input isRequired type='text' placeholder='title' onChange={(e) => {updateForm({title:e.currentTarget.value})}}/>
</FormControl>

<FormControl mt={'1em'}>
  <FormLabel>link</FormLabel>
  <Input type='url' placeholder='any links' onChange={(e) => {updateForm({link:e.currentTarget.value})}}/>
</FormControl>

<FormControl mt={'0em'} className='recurring'>
  <FormLabel>recurring</FormLabel>
  <Input tabIndex={-1} type='text' placeholder='task' onChange={(e) => {updateForm({recurring:e.currentTarget.value})}}/>
</FormControl>

<FormControl mt={'1em'}>
  <FormLabel>skills</FormLabel>
  <HStack mb={'.5em'} wrap='wrap'>
  {tags ? Array.from(tags).map((t, id)=> (
    <Tag key={id}>{t} <CloseIcon fontSize={'.5em'} sx={{ marginLeft: ".75em"}} onClick={()=>removeTag(t)} /></Tag>
  )): <Tag>add skill tags from below</Tag>}
  </HStack>
  <InputGroup>
    <Input type='text' ref={tagsInputRef} value={currTag} placeholder='skill tags' onChange={(e)=> {handleSkillChange(e)}} onKeyDown={(e) => {handleKeyDown(e);}} />
    <InputRightElement width={'5em'}>
      <Button h='1.75rem' size='sm' onClick={() => {addTag(currTag)}}>
          + tag
      </Button>
    </InputRightElement>
  </InputGroup>
  {skillRecs && skillRecs.length > 0 && skillRecs.map((rec:string, id:number) => (
    <Button key={id} ref={id === 0 ? recsButtonRef : null} variant={"ghost"} size={'xs'} onClick={() => {addTag(rec); setCurrTag(''); tagsInputRef.current && tagsInputRef.current.focus()}}>{rec}</Button>
  ))}
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
  <Textarea maxLength={10000} placeholder='plain text or markdown' onChange={(e)=>updateForm({content:e.currentTarget.value})} />
</FormControl>

<FormControl mt={'1em'} display='flex' alignItems='center'>
  <FormLabel htmlFor='hidden' mb='0'>
    Hidden?
  </FormLabel>
  <Switch id='hidden' onChange={(e)=>{updateForm({hidden:!form.hidden})}}/>
</FormControl>

<HStack justifyContent={'space-around'}>
    <Button sx={{marginTop: '1em'}} onMouseDown={()=>onCancel()}>cancel</Button>
    {/* <Button sx={{marginTop: '1em'}} onMouseDown={()=>onCancel()}>send to backlog</Button> */}
    <Button type='submit' colorScheme='blue' sx={{marginTop: '1em'}}><AddIcon sx={{marginRight:'10px'}}/>submit</Button>
</HStack>
</form>
</>)
}

export default TaskInput;