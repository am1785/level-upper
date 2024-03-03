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
    ButtonGroup,
    Box,
    VStack,
    Portal,
} from "@chakra-ui/react";
import React from "react";
import { Column, useReactTable, getCoreRowModel, flexRender, Cell, getFilteredRowModel, ColumnDef, getPaginationRowModel } from '@tanstack/react-table';
import {ChevronDownIcon, MinusIcon, ViewIcon, CheckCircleIcon, SpinnerIcon} from '@chakra-ui/icons';
import TaskEditModal from "../task/TaskEditModal";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as taskApi from '../../api/tasks';
import * as backlogApi from '../../api/backlog';
import TableSkillTag from "./TableSkillTag";


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
            <IconButton size="sm" variant='solid' colorScheme='red' isRound={true} aria-label='delete task' icon={<MinusIcon />} onClick={onOpen} />
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

    const [columnFilters, setColumnFilters] = React.useState([
      {
        id:'title',
        value:'',
      }
    ]);

    const columns = React.useMemo<ColumnDef<{col1: string}>[]>(() => [
        {
          accessorKey: "status",
          header: "status",
          size: 0,
          enableSorting: true,
          cell: (props:any) =>
          <Text textAlign={'center'}>
            {data && data[props.row.id] && props.getValue() === "complete" ? <CheckCircleIcon color={'green.400'} /> : <SpinnerIcon />}
          </Text>
        },
        {
          accessorKey: "exp",
          header: "size",
          size: 0,
          cell: (props:any) =>
          <Text textAlign={'center'}>
            {data && data[props.row.id] && <Tag colorScheme={EXP_MAP.get(data[props.row.id]['exp'])['colorScheme']}>{EXP_MAP.get(data[props.row.id]['exp'])['size']}</Tag>}
          </Text>
        },
        {
            accessorKey: "title",
            header: "title",
            cell: (props:any) => <HStack>
                <Text>
                {props.getValue()}
                </Text>
                </HStack>,
            size: 400
        },
        {
            accessorKey: "skills",
            header: "skills",
            cell: (props:any) =>
              <HStack rowGap={'1'}>
                {Array.from(props.getValue()).map((s:any, id:number) => (
                  <TableSkillTag key={id} skillName={s} onClick={(s) => toggleSkillFilter(s)} active={columnFilters.some((c) => c.value === s)}/>
              ))}
            </HStack>,
            filterFn: 'arrIncludes',
            size: 400,
        },
        {
          accessorKey: "_id",
          header: "actions",
          size: 100,
          cell:  (prop:any) => <Popover>
          <PopoverTrigger>
            <Button><ChevronDownIcon /></Button>
          </PopoverTrigger>
          <PopoverContent w={'13.25em'}>
            <PopoverArrow />
            <PopoverCloseButton />
          <PopoverBody>
              {/* <HStack justify={'start'}><Button colorScheme="teal"><ViewIcon /></Button><TaskEditModal className="backlogEdit" task={data[prop.row.id]}/><DeleteTaskDialog props={prop.getValue()} onRemove = {removeTaskMutation(data[prop.row.id]._id)}/></HStack> <= an arrow function here WILL DELETE EVERYTHING  */}
              {/* <HStack justify={'start'}><Button colorScheme="teal"><ViewIcon /></Button><TaskEditModal className="backlogEdit" task={data[prop.row.id]}/><DeleteTaskDialog props={prop.getValue()} onRemove = {removeTaskMutation(prop.getValue())}></DeleteTaskDialog></HStack> <= this still DELETES EVERYTHING WTF */}
              {/* <HStack justify={'start'}><Button colorScheme="teal" onClick={() => getView(prop.getValue())}><ViewIcon /></Button><TaskEditModal onSuccess={() => {queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']}); queryClient.invalidateQueries({queryKey: ['fetchSkills']})}} className="backlogEdit" task={data[prop.row.id]}/><CellTaskDelete onRemove = {removeTaskMutation(prop.getValue())} _id={prop.getValue()}></CellTaskDelete></HStack>
               <= this also deletes EVERYTHING */}

              <HStack justify={'start'}><IconButton icon={<ViewIcon />} size="md" colorScheme="teal" aria-label="viewTask" onClick={() => getView(prop.getValue())} /><TaskEditModal onSuccess={() => {queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']}); queryClient.invalidateQueries({queryKey: ['fetchSkills']})}} className="backlogEdit" task_id={data[prop.row.id]._id}/><CellTaskDelete onRemove = {() => removeTaskMutation(prop.getValue())} _id={prop.getValue()}></CellTaskDelete></HStack>

          </PopoverBody>
          </PopoverContent>
        </Popover>
      },
        {
          accessorKey: "createdAt",
          header: "date",
          cell: (props:any) => <Text>{new Date(props.getValue()).toLocaleDateString()}</Text>
      },
    ], [data, columnFilters]);

    // console.log(columnFilters);
    // console.log(columnFilters.some((c) => c.value === "react.js"));

    const toggleSkillFilter = (skill:string) => {
      columnFilters?.find((c) => c.value === skill) ?
      setColumnFilters(columnFilters.filter((c) => c.value !== skill)) :
      setColumnFilters((prev) => [...prev, {id: 'skills', value: skill}])
    }

    const table = useReactTable({
        data,
        columns,
        state: {
          columnFilters
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // console.log(table.getHeaderGroups());
    return(<>
    {status === "pending" ? <Stack><Skeleton height='20px' /><Skeleton height='20px' /></Stack>
    : status === "error" ? <Text>{error.message}</Text>
    // : <div style={{ width: '100%', maxHeight:'60vh', overflowX:'auto', tableLayout: 'fixed'}}>
    : <> <Box w={'100%'} overflowX={'auto'}>
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
    <Box>
    <Text mb={2} mt={2} fontSize={'sm'}>
      page {table.getState().pagination.pageIndex + 1} of {" "}
      {table.getPageCount()}
    </Text>
    <ButtonGroup size={"sm"} isAttached variant={"outline"}>
    <Button onClick={()=> table.previousPage()} isDisabled={!table.getCanPreviousPage()}>
          {"<"}
      </Button>
      <Button onClick={()=> table.nextPage()} isDisabled={!table.getCanNextPage()}>
          {">"}
      </Button>
    </ButtonGroup>
    </Box>
    </Box>
</>}
    </>)
}

export default TaskTable;