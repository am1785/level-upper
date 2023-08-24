import React, { useState } from 'react'
import { OngoingTask } from './TaskOngoing';
import {
    FormControl,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Button,
    HStack,
  } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons';

export type InputProps = {
    task: OngoingTask;
    onCancel: () => void;
    onAdd: () => void;
}

const TaskInput: React.FC<InputProps> = ({onCancel, onAdd}) => {


return (<>
<FormControl>
  <FormLabel>title</FormLabel>
  <Input isRequired type='text' placeholder='title'/>
  <FormLabel>link</FormLabel>
  <Input type='text' placeholder='any links'/>
  <FormLabel>skills</FormLabel>
  <Input type='text' placeholder='skill tags'/>
  <FormLabel>exp</FormLabel>
  <NumberInput isRequired max={12} min={0} placeholder='exp from completion'>
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
</FormControl>
<HStack justifyContent={'space-around'}>
<Button sx={{marginTop: '1em'}} onMouseDown={()=>onCancel()}>cancel</Button>
<Button sx={{marginTop: '1em'}} onMouseDown={()=>onAdd()}><AddIcon sx={{marginRight:'10px'}}/>add</Button>
</HStack>
</>)
}

export default TaskInput;