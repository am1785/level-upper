import React, { useState } from 'react'
import { Button, Box } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import TaskOngoing, { OngoingTask } from './TaskOngoing';
import TaskInput from './TaskInput';

const MTaskOngoing = React.memo(TaskOngoing);

const initialTasks = [
    {
        id: 0,
        title: "2Sum Leetcode Easy",
        link: "",
        tags:['Stack','Recursion','dynamic programming', 'queues', 'binary search'],
        created: Date.now(),
        completed: -1,
        exp: 4
    },
    {
        id: 1,
        title: "3Sum Leetcode medium iterative approach",
        link: "https://www.typescriptlang.org/docs/handbook/basic-types.html",
        tags:['Stack','Recursion'],
        created: Date.now(),
        completed: -1,
        exp: 4
    },
]

const defaultTask = [{
    id: -999,
    title: "2Sum Leetcode Easy",
    link: "",
    tags:['Stack','Recursion','dynamic programming', 'queues', 'binary search'],
    created: Date.now(),
    completed: -1,
    exp: 4
}]

export default function Ongoing(){

    const [task, setTasks] = useState(initialTasks);
    const [adding, setAdding] = useState(false);
    /**
     * add an ongoing task to frontend and create a new record in database
     */

    const addTask = () => {
        console.log('adding task');
        setAdding(true);
    }

    function removeTask(id:number) {
        const newTasks:any = [];
        task.forEach(t=>{
            if(t.id !== id){
                newTasks.push(t);
            }
        });
        setTasks(newTasks);
    }

    return (<>
    <main>
        {task[0].id !== -999 ? task.map((t, id)=>(
            <MTaskOngoing key={id} task={t} onRemove={() => {removeTask(t.id)}}/>
        )): <Box boxShadow='md' p='5' rounded='md' bg='white' mt='3' mb='3'>Nothing yet, add some tasks to level up today.</Box>}
        <div style={{ marginTop:'1em'}}>
            {!adding ? <Button size="lg" onClick={addTask}><AddIcon sx={{marginRight:'10px'}}/>add</Button>
            : <Box boxShadow='base' p='5' rounded='md' bg='white' mt='3' mb='3'>
                <TaskInput task={defaultTask[0]} onCancel={() => setAdding(false)} onAdd={() => setAdding(false)}/>
                </Box>}
        </div>
    </main>
    </>)
}