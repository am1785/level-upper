import React, { useState } from 'react'
import { Button, Box } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import TaskOngoing, { OngoingTask } from './TaskOngoing';
import TaskInput from './TaskInput';

const MTaskOngoing = React.memo(TaskOngoing);

export default function Ongoing(){

    const [task, setTasks] = useState<OngoingTask[]>([]);
    const [adding, setAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [exp, setExp] = useState(0);
    const [tags, setTags] = useState<string[] | null>([]);
    const [addingTags, setAddingTags] = useState(false);

    /**
     * add an ongoing task to frontend only
     */

    const addTaskDisplay = () => {
        const newTasks = [...task];
        const data = {
            id: newTasks.length > 0 ? newTasks[newTasks.length-1].id + 1 : 0,
            title: title,
            link: "",
            tags: [...tags!],
            created: Date.now(),
            completed: -1,
            exp: exp
        };
        // console.log(`pushing to front: ${JSON.stringify(data)}`);
        newTasks.push(data);
        setTasks(newTasks);
        setTags([]);
        setAdding(false);
    }

    function addTagDisplay(e: string) {
        if(tags) {
            const prev = [...tags];
            setTags([...prev, e]);
            // console.log(tags);
        }
    }

    // TODO: Implement useCallback hooks to cache functions
    // const addTagDisplay = React.useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //     if(tags) {
    //         const prev = [...tags];
    //         setTags([...prev, (e.currentTarget.parentElement!.previousSibling! as HTMLInputElement).value as string]);
    //         // console.log(tags);
    //     }
    // }, []);

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
        {task && task.length > 0 ? task.map((t, id)=>(
            <MTaskOngoing key={id} task={t} onRemove={() => {removeTask(t.id)}}/>
        )): <Box boxShadow='md' p='5' rounded='md' bg='white' mt='3' mb='3'>add some tasks to level up today!</Box>}
        <div style={{ marginTop:'1em'}}>
            {!adding ? <Button size="lg" onClick={() => setAdding(true)}><AddIcon sx={{marginRight:'10px'}}/>add</Button>
            : <Box boxShadow='base' p='5' rounded='md' bg='white' mt='3' mb='3'>
                <TaskInput handleSubmit={addTaskDisplay} onCancel={() => setAdding(false)} setTitle={(e)=>setTitle(e.currentTarget.value)} setExp={(e) => setExp(Number(e.currentTarget.value))} setTag={(e)=> addTagDisplay(e)} addingTags={addingTags} />
                </Box>}
        </div>
    </main>
    </>)
}