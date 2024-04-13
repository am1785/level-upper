import React, { useState, useEffect, useRef } from "react"
import { Text, Skeleton, Button, FormControl, FormLabel, HStack, IconButton, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Switch, Tag, Textarea, useDisclosure, useToast } from "@chakra-ui/react"
import { CloseIcon, EditIcon, ArrowUpDownIcon } from "@chakra-ui/icons"
import { taskForm } from "./TaskInput"
// import { UseMutationResult, useMutation, } from "@tanstack/react-query"
import * as taskApi from '../../api/tasks'
import { Trie } from "../../data/trie"
import { useEditTaskMutation } from "../../hooks/useTasksMutations"


export type TaskEditProps = {
    task_id: string,
    className: string,
    onSuccess: () => void,
}

const TaskEditModal:React.FC<TaskEditProps> = ({task_id, className, onSuccess}) => {
  const toast = useToast();
  const {mutate:editTaskMutation} = useEditTaskMutation(toast, onSuccess);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [task, setTask] = useState({
      _id: "",
      title: "",
      link: "",
      content: "",
      skills: [""],
      status: "",
      exp: 1,
      hidden: false,
      author: "default",
      task_collection: [""],
      createdAt: "",
      updatedAt: ""
    })

    const [Loading, setLoading] = useState(false);

    const [skillRecs, setSkillRecs] = useState<string[]>([]);
    const prefixTree = new Trie();
    const SKILLS_CACHE:string[] = localStorage.getItem("userSkills") === null ? [] : JSON.parse(localStorage['userSkills']);
    for(let skill of SKILLS_CACHE) {
      prefixTree.insert(skill);
    }

    useEffect(() => { // set loading state best practice: https://www.youtube.com/watch?v=V0VfR0eaz98
      async function fetchTaskData() {
        try {
          setLoading(true);
          const res = await taskApi.fetchView(task_id);
          if (res) {
            setTask(res);
            setTags(new Set(res.skills));
            setForm({
              title : res.title,
              link : res.link,
              content : res.content,
              skills : res.skills,
              exp : res.exp,
              hidden: res.hidden,
              author: res.author,
              status: res.status
            });
          }
        } catch(err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }

      if (isOpen) {
        fetchTaskData();
      }
      }, [isOpen])

    const [form, setForm] = useState<taskForm>({
        title : task?.title,
        link : task?.link,
        content : task?.content,
        skills : task?.skills,
        exp : task?.exp,
        hidden: task?.hidden,
        author: task?.author,
        status: task?.status
        });

    const [expanded, setExpanded] = useState(false);

    const [currTag, setCurrTag] = useState('');
    const [tags, setTags] = useState(new Set(task?.skills));
    const tagsInputRef = useRef<HTMLInputElement>(null);
    const [contentSize, setContentSize] = useState(0);

    async function submitForm(event:any){
        event.preventDefault();
        // if edited, submit, else don't submit
        const edited = JSON.stringify(form) !== JSON.stringify({
            title : task.title,
            link : task.link,
            content : task.content,
            skills : task.skills,
            exp : task.exp,
            hidden: task.hidden,
            author: task.author,
            status: task.status
            })
            // (editTaskMutation(task._id, form); resetForm()) : resetForm();
        if(edited) {
          editTaskMutation({_id:task._id, update: form});
          resetForm();
        } else {
          resetForm();
        }
      }

      function updateForm(value:any) {
        return setForm((prev) => {
          return { ...prev, ...value };
        });
      }

      function resetForm() {
        setCurrTag('');
        onClose();
      }

      function handleKeyDown (event: React.KeyboardEvent) {
        if (event.key === 'Enter') {
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

      function handleSkillChange(e:React.ChangeEvent<HTMLInputElement>) {
        const tagName:string = e.currentTarget.value;
        setCurrTag(tagName.toLowerCase());
        const recommendations:string[] = tagName.length === 0 ? [] : prefixTree.findWordsStartingWith(tagName);
        setSkillRecs(recommendations);
      }

      function toggleExpand(){
        setExpanded((prev) => !prev) // functional way of updating value
      }

    return (
        <>
        {className === 'ongoingEdit' ? <IconButton p={'2px'} bgColor={'whiteAlpha.100'} size={'s'} aria-label='edit task' onClick={onOpen} icon={<EditIcon />}></IconButton> :
        <IconButton onClick={onOpen} colorScheme="gray" variant={"outline"} bg={"white"} _dark={{bg: "gray.700"}} icon={<EditIcon />} aria-label="Edit button" />}
          <Modal isOpen={isOpen} onClose={onClose} isCentered size={'lg'} scrollBehavior={'inside'}>
            <ModalOverlay />
            <ModalContent maxW={expanded ? "100%" : "90%"} maxH={expanded ? "100%" : "90%"}>
              <ModalHeader>Edit Task</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
              {Loading ? <Stack><Skeleton height='20px' /><Skeleton height='20px' /></Stack> :
              <form onSubmit={(e) => {submitForm(e); onClose();}}>
              <FormControl isRequired>
              <FormLabel>title</FormLabel>
              <Input isRequired type='text' placeholder='title' defaultValue={task?.title} onChange={(e) => {updateForm({title:e.currentTarget.value})}}/>
              </FormControl>

              <FormControl mt={'1em'}>
              <FormLabel>link</FormLabel>
              <Input type='url' placeholder='any links' defaultValue={task?.link} onChange={(e) => {updateForm({link:e.currentTarget.value})}}/>
              </FormControl>

              <FormControl mt={'1em'}>
              <FormLabel>skills</FormLabel>
              <HStack mb={'.5em'} wrap='wrap'>
              {tags ? Array.from(tags).map((t:any, id)=> (
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
                    <Button key={id} variant={"ghost"} size={'xs'} onClick={() => {setCurrTag(rec); tagsInputRef.current && tagsInputRef.current.focus()}}>{rec}</Button>
                  )
              )}
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
              <Textarea maxLength={10000} h={expanded ? '30em' : '15em'} defaultValue={task?.content} placeholder='plain text or markdown' onChange={(e)=> {updateForm({content:e.currentTarget.value}); setContentSize(e.currentTarget.textLength)}} />
              <Text fontSize={"xs"} mt={1}>{10000 - contentSize} characters remain</Text>
              </FormControl>
              <HStack justifyContent='end' mt={'.5em'}>
                <Button onClick={toggleExpand} size={'sm'} _active={{transform: 'scale(1.2)'}} colorScheme={expanded ? "blue" : "gray"}><ArrowUpDownIcon /></Button>
              </HStack>

              <FormControl mt={'1em'} display='flex' alignItems='center'>
              <FormLabel htmlFor='hidden' mb='0'>
                  Hidden?
              </FormLabel>
              <Switch defaultChecked={task?.hidden} id='hidden' onChange={(e)=>{updateForm({hidden:!form.hidden})}}/>
              </FormControl>

              <FormControl mt={'1em'} display='flex' alignItems='center'>
              <FormLabel htmlFor='status' mb='0'>
                  Complete?
              </FormLabel>
              <Switch defaultChecked={task?.status === "complete"} id='status' onChange={(e)=>{ updateForm({status: e.target.checked ? "complete" : "ongoing"})}}/>
              </FormControl>

              <HStack justifyContent={'space-around'} mt={'2em'}>
                  <Button variant='ghost' onClick={() => {resetForm()}}>Close</Button>
                  <Button type='submit' colorScheme='blue' mr={3}>Save</Button>
              </HStack>
              </form>}
              </ModalBody>

              <ModalFooter>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default TaskEditModal;