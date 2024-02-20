import {
    Button,
    Text,
    Tag,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    HStack,
    IconButton,
    useDisclosure,
    Skeleton,
    Stack,
} from "@chakra-ui/react";
import React from "react";
import { useReactTable, getCoreRowModel, flexRender, Cell } from '@tanstack/react-table';
import {ChevronDownIcon, MinusIcon, ViewIcon, CheckCircleIcon, SpinnerIcon} from '@chakra-ui/icons';
import { OngoingTask } from "../task/TaskOngoing";
import TaskEditModal from "../task/TaskEditModal";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as taskApi from '../../api/tasks';
import * as backlogApi from '../../api/backlog';


export type CellTaskDelete = {
    onRemove: (_id:string) => void,
    _id: string;
}

export const EXP_MAP = new Map([
    [1, Object({size: 'xs', variant:'solid', colorScheme: 'gray'})],
    [2, Object({size: 's', variant:'solid', colorScheme: 'blue'})],
    [4, Object({size: 'm', variant:'solid', colorScheme: 'teal'})],
    [8, Object({size: 'l', variant:'solid', colorScheme: 'orange'})],
    [12, Object({size: 'xl', variant:'solid', colorScheme: 'purple'})],
])

const TaskTable: React.FC= () => {
    const queryClient = useQueryClient();

    const user = 'default'; // TODO: get current user based on auth

    const { status, data, error } = useQuery({
        queryFn: () => backlogApi.fetchAllTasks(user),
        queryKey: ['fetchOngoingTasks', { user }],
      })

    const { mutate } = useMutation({
        mutationFn: (_id:string) => taskApi.deleteTask(_id),
        mutationKey: ['deleteTask'],
      });

      const removeTaskMutation = async (_id:string) =>
        await mutate(_id, {
          onSuccess(data, variables, context) {
            queryClient.invalidateQueries({queryKey: ['deleteTask']});
            queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
            queryClient.invalidateQueries({queryKey: ['fetchSkills']});
          },
        })

    const CellTaskDelete:React.FC<CellTaskDelete> = ({onRemove, _id}) => {
        const { isOpen, onOpen, onClose } = useDisclosure()
        const cancelRef = React.useRef(null)
        // console.log(props);
        return (
          <>
            <IconButton variant='solid' colorScheme='red' isRound={true} aria-label='delete task' icon={<MinusIcon />} onClick={onOpen} />
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
              size={'sm'}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Delete Task:
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme='red' ml={2} onClick={() => {onRemove(_id); onClose();}}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )
      }

    function getView(_id:string) {
        window.open(`/view/${_id}`, "_blank") //to open new page;
    }

    const columns = React.useMemo(() => [
        {
            accessorKey: "title",
            header: "title",
            cell: (props:any) => <HStack>
                {data && data[props.row.id] && data[props.row.id]['status'] === "complete" ? <CheckCircleIcon color={'green.400'} /> : <SpinnerIcon />}
                {data && data[props.row.id] && <Tag colorScheme={EXP_MAP.get(data[props.row.id]['exp'])['colorScheme']}>{EXP_MAP.get(data[props.row.id]['exp'])['size']}</Tag>}
                <Text>
                {props.getValue()}
                </Text>
                </HStack>,
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
          accessorKey: "_id",
          header: "actions",
          size: 100,
          cell:  (prop:any) => <Popover>
          <PopoverTrigger>
            <Button><ChevronDownIcon /></Button>
          </PopoverTrigger>
          <PopoverContent w={'15em'}>
            <PopoverArrow />
            <PopoverCloseButton />
          <PopoverBody>
              {/* <HStack justify={'start'}><Button colorScheme="teal"><ViewIcon /></Button><TaskEditModal className="backlogEdit" task={data[prop.row.id]}/><DeleteTaskDialog props={prop.getValue()} onRemove = {removeTaskMutation(data[prop.row.id]._id)}/></HStack> <= an arrow function here WILL DELETE EVERYTHING  */}
              {/* <HStack justify={'start'}><Button colorScheme="teal"><ViewIcon /></Button><TaskEditModal className="backlogEdit" task={data[prop.row.id]}/><DeleteTaskDialog props={prop.getValue()} onRemove = {removeTaskMutation(prop.getValue())}></DeleteTaskDialog></HStack> <= this still DELETES EVERYTHING WTF */}
              <HStack justify={'start'}><Button colorScheme="teal" onClick={() => getView(prop.getValue())}><ViewIcon /></Button><TaskEditModal onSuccess={() => {queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']}); queryClient.invalidateQueries({queryKey: ['fetchSkills']})}} className="backlogEdit" task={data[prop.row.id]}/><CellTaskDelete onRemove = {() => removeTaskMutation(prop.getValue())} _id={prop.getValue()}></CellTaskDelete></HStack>
          </PopoverBody>
          </PopoverContent>
        </Popover>
      },
        {
          accessorKey: "createdAt",
          header: "date",
          cell: (props:any) => <Text>{new Date(props.getValue()).toLocaleDateString()}</Text>
      },
    ], [data]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // console.log(table.getHeaderGroups());
    return(<>
    {status === "pending" ? <Stack><Skeleton height='20px' /><Skeleton height='20px' /></Stack>
    : status === "error" ? <Text>{error.message}</Text>
    : <div style={{ width: '100%', maxHeight:'60vh', overflowX:'auto', tableLayout: 'fixed'}}>
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
    </div>}
    </>)
}

export default TaskTable;