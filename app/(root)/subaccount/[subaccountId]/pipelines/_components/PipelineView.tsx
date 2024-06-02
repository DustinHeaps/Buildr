"use client";
import ColumnForm from "@/components/forms/ColumnForm";
import CustomModal from "@/components/global/CustomModal";
import { Button } from "@/components/ui/button";
import {
  ColumnDetail,
  PipelineDetailsWithColumnsCardsTagsTickets,
  TicketAndTags,
} from "@/types";
import { useModal } from "@/providers/ModalProvider";
import { Column, Ticket } from "@prisma/client";
import { Flag, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import PipelineColumn from "./PipelineColumn";

type Props = {
  columns: ColumnDetail[];
  pipelineId: string;
  subaccountId: string;
  pipelineDetails: PipelineDetailsWithColumnsCardsTagsTickets;
  updateColumnOrder: (columns: Column[]) => Promise<void>;
  updateTicketsOrder: (tickets: Ticket[]) => Promise<void>;
};

const PipelineView = ({
  columns,
  pipelineDetails,
  pipelineId,
  subaccountId,
  updateColumnOrder,
  updateTicketsOrder,
}: Props) => {
  const { setOpen } = useModal();
  const router = useRouter();
  const [allColumns, setAllColumns] = useState<ColumnDetail[]>([]);

  useEffect(() => {
    setAllColumns(columns);
  }, [columns]);

  const ticketsFromAllColumns: TicketAndTags[] = [];
  columns.forEach((item) => {
    item.Tickets.forEach((i) => {
      ticketsFromAllColumns.push(i);
    });
  });
  const [allTickets, setAllTickets] = useState(ticketsFromAllColumns);

  const handleAddColumn = () => {
    setOpen(
      <CustomModal
        title=' Create A Column'
        subheading='Columns allow you to group tickets'
      >
        <ColumnForm pipelineId={pipelineId} />
      </CustomModal>
    );
  };

  const onDragEnd = (dropResult: DropResult) => {
    console.log(dropResult);
    const { destination, source, type } = dropResult;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    switch (type) {
      case "column": {
        const newColumns = [...allColumns]
          .splice(source.index, 1)
          .splice(destination.index, 0, allColumns[source.index])
          .map((column, idx) => {
            return { ...column, order: idx };
          });

        setAllColumns(newColumns);
        updateColumnOrder(newColumns);
      }

      case "ticket": {
        let newColumns = [...allColumns];
        const originColumn = newColumns.find(
          (column) => column.id === source.droppableId
        );
        const destinationColumn = newColumns.find(
          (column) => column.id === destination.droppableId
        );

        if (!originColumn || !destinationColumn) {
          return;
        }

        if (source.droppableId === destination.droppableId) {
          const newOrderedTickets = [...originColumn.Tickets]
            .splice(source.index, 1)
            .splice(destination.index, 0, originColumn.Tickets[source.index])
            .map((item, idx) => {
              return { ...item, order: idx };
            });
          originColumn.Tickets = newOrderedTickets;
          setAllColumns(newColumns);
          updateTicketsOrder(newOrderedTickets);
          router.refresh();
        } else {
          const [currentTicket] = originColumn.Tickets.splice(source.index, 1);

          originColumn.Tickets.forEach((ticket, idx) => {
            ticket.order = idx;
          });

          destinationColumn.Tickets.splice(destination.index, 0, {
            ...currentTicket,
            columnId: destination.droppableId,
          });

          destinationColumn.Tickets.forEach((ticket, idx) => {
            ticket.order = idx;
          });
          setAllColumns(newColumns);
          updateTicketsOrder([
            ...destinationColumn.Tickets,
            ...originColumn.Tickets,
          ]);
          router.refresh();
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl'>{pipelineDetails?.name}</h1>
          <Button className='flex items-center gap-4' onClick={handleAddColumn}>
            <Plus size={15} />
            Create Column
          </Button>
        </div>
        <Droppable
          droppableId='columns'
          type='column'
          direction='horizontal'
          key='columns'
        >
          {(provided) => (
            <div
              className='flex item-center gap-x-2 overflow-scroll'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className='flex mt-4'>
                {allColumns.map((column, index) => (
                  <PipelineColumn
                    allTickets={allTickets}
                    setAllTickets={setAllTickets}
                    subaccountId={subaccountId}
                    pipelineId={pipelineId}
                    tickets={column.Tickets}
                    columnDetails={column}
                    index={index}
                    key={column.id}
                  />
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
        {allColumns.length == 0 && (
          <div className='flex items-center justify-center w-full flex-col'>
            <div className='opacity-100'>
              <Flag
                width='100%'
                height='100%'
                className='text-muted-foreground'
              />
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default PipelineView;
