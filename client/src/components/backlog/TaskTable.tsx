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
    HStack,
    Skeleton,
    Stack,
    ButtonGroup,
    Box,
    Input,
    Select,
    Flex,
    Badge,
    Checkbox
} from "@chakra-ui/react";
import React from "react";
import { VisibilityState, useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, ColumnDef, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import { ArrowUpDownIcon, SearchIcon, CheckCircleIcon, SpinnerIcon} from '@chakra-ui/icons';
import { useQueryClient } from '@tanstack/react-query';
import TableSkillTag from "./TableSkillTag";
import TableFloatingActions from "./TableFloatingActions";

import { useAllTasksData } from "../../hooks/useTasksData";
import { userData } from "../home/Ongoing";

export const EXP_MAP = new Map([
    [1, {size: 'xs', variant:'solid', colorScheme: 'gray'} as const],
    [2, {size: 's', variant:'solid', colorScheme: 'blue'} as const],
    [4, {size: 'm', variant:'solid', colorScheme: 'teal'} as const],
    [8, {size: 'l', variant:'solid', colorScheme: 'orange'} as const],
    [12, {size: 'xl', variant:'solid', colorScheme: 'purple'} as const],
])

type TaskTableProps = {
  userData: userData
}

const TaskTable: React.FC<TaskTableProps> = ({userData}) => {
    const queryClient = useQueryClient();

    const [selected, setSelected] = React.useState<string[]>([]);
    const [prevSelectedLen, setPrevSelectedLen] = React.useState<number>(0);

    const { status, data, error } = useAllTasksData(userData.id);

    let COLLECTIONS: string[] = [];

    if(status === "success") {
      data.forEach((d:any) => {
        d.task_collection.forEach((c:string) => {
          COLLECTIONS.indexOf(c) === -1 && COLLECTIONS.push(c);
        })
      })
    }

    function handleSelect(_id: string) {
      setPrevSelectedLen(selected.length);

      if (selected.find((id) => id === _id)) {
        setSelected((prev) => prev.filter(id => id !== _id));
      } else {
        setSelected((prev) => [...prev, _id]);
      }
    }

    const [columnFilters, setColumnFilters] = React.useState([
      {
        id:'title',
        value:'',
      },
    ]);

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
      'task_collection': false,
  })

    const columns = React.useMemo<ColumnDef<{col1: string}>[]>(() => [
        {
          accessorKey: "_id",
          header: "",
          size: 0,
          enableSorting: false,
          cell: (props:any) =>
            <Box>
              <Checkbox isChecked={selected.includes(String(props.getValue()))} onChange={() => handleSelect(String(props.getValue()))}></Checkbox>
            </Box>
        },
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
            {data && data[props.row.id] && <Tag colorScheme={EXP_MAP.get(data[props.row.id]['exp'])!['colorScheme']}>{EXP_MAP.get(data[props.row.id]['exp'])!['size']}</Tag>}
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
        },
      {
          accessorKey: "createdAt",
          header: "date",
          cell: (props:any) => <Text>{new Date(props.getValue()).toLocaleDateString()}</Text>,
          size: 100
        },
      {
        accessorKey: "task_collection",
        header: "collection",
        cell: (props:any) => <HStack rowGap={'1'}>
        {Array.from(props.getValue()).map((c:any, id:number) => (
          <Badge key={id}>{c}</Badge>
        ))}
        </HStack>,
        filterFn: 'arrIncludes'
    },
    ], [data, columnFilters, selected]);

    const toggleSkillFilter = (skill:string) => {
      columnFilters?.find((c) => c.value === skill) ?
      setColumnFilters(columnFilters.filter((c) => c.value !== skill)) :
      setColumnFilters((prev) => [...prev, {id: 'skills', value: skill}])
    }

    const table = useReactTable({
        data,
        columns,
        state: {
          columnFilters,
          columnVisibility,
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handlePageTurn = (event:React.KeyboardEvent<HTMLInputElement>) => {
      const page = Number(event.currentTarget.value);
      isNaN(page) ? 0 :
      table.setPageIndex(Math.min(page-1, table.getPageCount()-1));
    }

    const handleTextFilter = (query : string) => {
      setColumnFilters(prev => [{id: 'title', value: query}, ...prev.slice(1)]);
    }

    const handleCollectionFilter = (c:string) => {

      if(!c) {
        setColumnFilters((prev) => prev.filter((f) => f.id !== "task_collection"));
        return
      }

      const c_filter_idx = columnFilters.findIndex((collection) => collection.id === "task_collection");

      if(c_filter_idx === -1) {
        setColumnFilters((prev) => [...prev, {id: "task_collection", value: c}])
      } else {
        let newFilters:any = [];
        columnFilters.forEach((filter, id) => {
          id !== c_filter_idx ? newFilters.push(filter)
                              : newFilters.push({id:"task_collection", value:c});
        });
        setColumnFilters(newFilters);
      }

      return
    }

    const handleSelectAll = (isChecked: boolean) => {
      setPrevSelectedLen(selected.length);
      if(isChecked) {
        // @ts-ignore
        const targetIds = table.getFilteredRowModel().flatRows?.map((o) => o.original._id);
        setSelected(targetIds);
      } else {
        setSelected([]);
      }
    }

    return (<>
    {status === "pending" ? <Stack><Skeleton height='20px' /><Skeleton height='20px' /></Stack>
    : status === "error" ? <Text>{error.message}</Text>
    // : <div style={{ width: '100%', maxHeight:'60vh', overflowX:'auto', tableLayout: 'fixed'}}>
    : <> <Box w={'100%'} overflowX={'auto'} mt={'.5em'}>
    <Flex alignItems={'center'} alignContent={'center'} gap={5} mt={'3'}>
      <HStack>
        <SearchIcon fontSize={'sm'} />
        <Input size={"sm"} maxW={'8em'} variant={'flushed'} onChange={(e) => handleTextFilter(e.currentTarget.value)}/>
      </HStack>
      <Select placeholder='collection' size={'sm'} maxW={'8em'} onChange={(e) => handleCollectionFilter(e.currentTarget.value)}>
        {COLLECTIONS?.map((c, id) => (
          <option key={id} value={c}>{c}</option>
        ))}
      </Select>
    </Flex>
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
                            {header.id === '_id' && <Checkbox onChange={(e) => handleSelectAll(e.currentTarget.checked)}></Checkbox>}
                            {
                              header.column.getCanSort() && <ArrowUpDownIcon
                                fontSize={"10px"} mx={1} onClick={header.column.getToggleSortingHandler()}/>
                            }
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

    <TableFloatingActions actionIds={selected} prevIdsLength={prevSelectedLen} taskCollections={COLLECTIONS}
    onEditSuccess={() => queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']})}
    onDeleteSuccess={() => {setSelected([]); setPrevSelectedLen(selected.length);} }
    />

    <Box>
    <ButtonGroup size={"sm"} isAttached variant={"outline"} mb={2} mt={2}>
      <Button onClick={()=> table.previousPage()} isDisabled={!table.getCanPreviousPage()}>
          {"<"}
      </Button>
        <Input onKeyDown={(e) => e.key === "Enter" ? handlePageTurn(e) : null} size={'sm'} fontSize={'xs'} w={'3em'} marginLeft={".5em"} marginRight={".5em"} min={1} max={table.getPageCount()} />
      <Button onClick={()=> table.nextPage()} isDisabled={!table.getCanNextPage()}>
          {">"}
      </Button>
    </ButtonGroup>
    <Text fontSize={'xs'}>
      page {table.getState().pagination.pageIndex + 1} of {" "}
      {table.getPageCount()}
    </Text>
    </Box>
    </Box>
    </>}
  </>)
}

export default TaskTable;