import {
    Text,
    Tag,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,} from "@chakra-ui/react";
import React from "react";
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { OngoingTask } from "../task/TaskOngoing";

export type TaskTableProps = {
    data:OngoingTask[]
}

const TaskTable: React.FC<TaskTableProps> = ({data}) => {
    const columns = React.useMemo(() => [
        {
            accessorKey: "createdAt",
            header: "date",
            cell: (props:any) => <Text>{new Date(props.getValue()).toLocaleDateString()}</Text>
        },
        {
            accessorKey: "title",
            header: "title",
            cell: (props:any) => <Text>{props.getValue()}</Text>,
            size: 400
        },
        {
            accessorKey: "skills",
            header: "skills",
            cell: (props:any) => <p>{Array.from(props.getValue()).map((s:any, id:number) => (
                <Tag key={id} m={'1'}>{s}</Tag>
            ))}</p>,
            size: 400
        },
        {
            accessorKey: "status",
            header: "status",
            cell: (props:any) => <Text color={props.getValue() === 'complete' ? 'blue.400': 'red.300'}>{props.getValue()}</Text>
        }
    ], []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // console.log(table.getHeaderGroups());
    return(
    <div style={{ width: '100%', maxHeight:'60vh', overflowX:'auto', tableLayout: 'fixed'}}>
    <TableContainer mt={'1em'}>
        <Table style={{minWidth: 'max-content', width: '100%'}} variant={'simple'} size={'sm'}>
            <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={`headerGroup-${headerGroup.id}`}>
                    {headerGroup.headers.map((header) => (
                        <Th
                        key={`header-${header.id}`}
                        colSpan={header.colSpan}
                        style={{
                            width: header.getSize() !== 0 ? header.getSize() : undefined, // to style individual columns in 2024
                        }}>
                            {header.column.columnDef.header as React.ReactNode}
                        </Th>
                    ))}
                </Tr>
                ))}
            </Thead>
            <Tbody>
                {table.getRowModel().rows.map((row) => (
                <Tr key={`row-${row.id}`}>
                    {row.getVisibleCells().map((cell) => (
                    <Td key={`cell-${row.id}-${cell.id}`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                    ))}
                </Tr>
                ))}
            </Tbody>
        </Table>
    </TableContainer>
    </div>
    )
}

export default TaskTable;