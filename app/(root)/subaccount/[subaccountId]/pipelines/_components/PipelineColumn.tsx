"use client";
import CreateColumnForm from "@/components/forms/ColumnForm";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteColumn } from "@/actions/column";
import { ColumnDetail, TicketWithTags } from "@/types";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/ModalProvider";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Edit, MoreVertical, PlusCircleIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import CustomModal from "@/components/global/CustomModal";
import TicketForm from "@/components/forms/TicketForm";
import PipelineTicket from "./PipelineTicket";
import { toast } from '@/components/ui/use-toast';

interface PipecolumnColumnProps {
  setAllTickets: Dispatch<SetStateAction<TicketWithTags>>;
  allTickets: TicketWithTags;
  tickets: TicketWithTags;
  pipelineId: string;
  columnDetails: ColumnDetail;
  subaccountId: string;
  index: number;
}

const PipelineColumn: React.FC<PipecolumnColumnProps> = ({
  setAllTickets,
  tickets,
  pipelineId,
  columnDetails,
  subaccountId,
  allTickets,
  index,
}) => {
  const { setOpen } = useModal();
  const router = useRouter();

  const amt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  });

  const columnAmt = useMemo(() => {
    
    return tickets.reduce(
      (sum: any, ticket: any) => sum + (Number(ticket?.value) || 0),
      0
    );
  }, [tickets]);

  const randomColor = `#${Math.random().toString(16).slice(2, 8)}`;

  const addNewTicket = (ticket: TicketWithTags[0]) => {
    setAllTickets([...allTickets, ticket]);
  };

  const handleCreateTicket = () => {

    setOpen(
      <CustomModal
        title='Create A Ticket'
        subheading='Tickets are a great way to keep track of tasks'
      >
        <TicketForm
          getNewTicket={addNewTicket}
          columnId={columnDetails.id}
          subaccountId={subaccountId}
        />

      </CustomModal>
    );
  };

  const handleEditColumn = () => {
    setOpen(
      <CustomModal title='Edit Column Details' subheading=''>
        <CreateColumnForm pipelineId={pipelineId} defaultData={columnDetails} />
      </CustomModal>
    );
  };

  const handleDeleteColumn = async () => {
    try {
      const response = await deleteColumn(columnDetails.id);
      toast({
        title: "Deleted",
        description: "Column deleted",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Draggable
      draggableId={columnDetails.id}
      index={index}
      key={columnDetails.id}
    >
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          //@ts-ignore
          const offset = { x: 300, y: 0 };
          //@ts-ignore
          const x = provided.draggableProps.style?.left - offset.x;
          //@ts-ignore
          const y = provided.draggableProps.style?.top - offset.y;
          //@ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            top: y,
            left: x,
          };
        }
        return (
          <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            className='h-full'
          >
            <AlertDialog>
              <DropdownMenu>
                <div className='bg-slate-200/30 dark:bg-background/20  h-[700px] w-[300px] px-4 relative rounded-lg overflow-visible flex-shrink-0 '>
                  <div
                    {...provided.dragHandleProps}
                    className=' h-14 backdrop-blur-lg dark:bg-background/40 bg-slate-200/60  absolute top-0 left-0 right-0 z-10 '
                  >
                    <div className='h-full flex items-center p-4 justify-between cursor-grab border-b-[1px] '>
                      {/* {columnDetails.order} */}
                      <div className='flex items-center w-full gap-2'>
                        <div
                          className={cn("w-4 h-4 rounded-full")}
                          style={{ background: randomColor }}
                        />
                        <span className='font-bold text-sm'>
                          {columnDetails.name}
                        </span>
                      </div>
                      <div className='flex items-center flex-row'>
                        <Badge className='bg-white text-black'>
                          {amt.format(columnAmt)}
                        </Badge>
                        <DropdownMenuTrigger>
                          <MoreVertical className='text-muted-foreground cursor-pointer' />
                        </DropdownMenuTrigger>
                      </div>
                    </div>
                  </div>

                  <Droppable
                    droppableId={columnDetails.id.toString()}
                    key={columnDetails.id}
                    type='ticket'
                  >
                    {(provided) => (
                      <div className=' max-h-[700px] overflow-scroll pt-12 '>
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className='mt-2'
                        >
                          {tickets.map((ticket: any, index: number) => (
                            <PipelineTicket
                              allTickets={allTickets}
                              setAllTickets={setAllTickets}
                              subaccountId={subaccountId}
                              ticket={ticket}
                              key={ticket.id.toString()}
                              index={index}
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>

                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger>
                      <DropdownMenuItem className='flex items-center gap-2'>
                        <Trash size={15} />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <DropdownMenuItem
                      className='flex items-center gap-2'
                      onClick={handleEditColumn}
                    >
                      <Edit size={15} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='flex items-center gap-2'
                      onClick={handleCreateTicket}
                    >
                      <PlusCircleIcon size={15} />
                      Create Ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </div>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className='flex items-center'>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className='bg-destructive'
                      onClick={handleDeleteColumn}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </DropdownMenu>
            </AlertDialog>
          </div>
        );
      }}
    </Draggable>
  );
};

export default PipelineColumn;
