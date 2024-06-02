"use server";

import { db } from "@/lib/prisma";
import { Prisma, Tag, Ticket } from "@prisma/client";
import { v4 } from "uuid";

export const createTicket = async (
  ticket: Prisma.TicketUncheckedCreateInput,
  tags: Tag[]
) => {
  let order: number;
  if (!ticket.order) {
    const tickets = await db.ticket.findMany({
      where: { columnId: ticket.columnId },
    });
    order = tickets.length;
  } else {
    order = ticket.order;
  }
  console.log(ticket);
  const response = await db.ticket.upsert({
    where: {
      id: ticket.id || v4(),
    },
    update: { ...ticket, Tags: { set: tags } },
    create: { ...ticket, Tags: { connect: tags }, order },
    include: {
      Assigned: true,
      Customer: true,
      Tags: true,
      Column: true,
    },
  });

  return response;
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  try {
    const updateTrans = tickets.map((ticket) =>
      db.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          order: ticket.order,
          columnId: ticket.columnId,
        },
      })
    );

    await db.$transaction(updateTrans);
    console.log("🟢 Done reordered 🟢");
  } catch (error) {
    console.log(error, "🔴 ERROR UPDATE TICKET ORDER");
  }
};

export const deleteTicket = async (ticketId: string) => {
  const response = await db.ticket.delete({
    where: {
      id: ticketId,
    },
  });

  return response;
};

export const getTicketsWithTags = async (pipelineId: string) => {
  const response = await db.ticket.findMany({
    where: {
      Column: {
        pipelineId,
      },
    },
    include: { Tags: true, Assigned: true, Customer: true },
  });
  return response;
};

export const _getTicketsWithAllRelations = async (columnId: string) => {
  const response = await db.ticket.findMany({
    where: { columnId: columnId },
    include: {
      Assigned: true,
      Customer: true,
      Column: true,
      Tags: true,
    },
  });
  return response;
};
