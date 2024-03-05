import React from "react";
import { Button, Tag } from "@chakra-ui/react";

export type TableSkillTagProps = {
    active: boolean;
    skillName: string;
    onClick: (skill:string) => void;
}

const TableSkillTag:React.FC<TableSkillTagProps> = ({active, skillName, onClick})=> {

    return(<>
        {!active ?
        <Button p={'0'} variant={"unstyled"} h={'min-content'} w={'min-content'} border={'hidden'} _hover={{borderColor:"white"}} onClick={() => {onClick(skillName)}}>
            <Tag>{skillName}</Tag>
        </Button>
        :
        <Button p={'0'} bgGradient='linear(to-r, teal.500, green.500)' h={'min-content'} w={'min-content'} border={'hidden'} _hover={{borderColor:"white"}} onClick={() => {onClick(skillName)}}>
        <Tag variant={"unstyled"} color={"white"} fontWeight={500}>{skillName}</Tag>
        </Button>}
    </>)
}

export default TableSkillTag;