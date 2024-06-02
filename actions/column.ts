"use server";

import { db } from "@/lib/prisma";
import { Column, Prisma } from "@prisma/client";
import { v4 } from "uuid";

export const createColumn = async (
  column: Prisma.ColumnUncheckedCreateInput
) => {
  let order: number;

  if (!column.order) {
    const columns = await db.column.findMany({
      where: {
        pipelineId: column.pipelineId,
      },
    });

    order = columns.length;
  } else {
    order = column.order;
  }

  const response = await db.column.upsert({
    where: { id: column.id || v4() },
    update: column,
    create: { ...column, order },
  });

  return response;
};

export const updateColumnOrder = async (columns: Column[]) => {
  try {
    const updateTrans = columns.map((column) =>
      db.column.update({
        where: {
          id: column.id,
        },
        data: {
          order: column.order,
        },
      })
    );

    await db.$transaction(updateTrans);
    console.log("🟢 Done reordered 🟢");
  } catch (error) {
    console.log(error, "ERROR UPDATE LANES ORDER");
  }
};

export const getColumnsWithTicketAndTags = async (pipelineId: string) => {
  const response = await db.column.findMany({
    where: {
      pipelineId,
    },
    orderBy: { order: "asc" },
    include: {
      Tickets: {
        orderBy: {
          order: "asc",
        },
        include: {
          Tags: true,
          Assigned: true,
          Customer: true,
        },
      },
    },
  });
  return response;
};

export const deleteColumn = async (columnId: string) => {
  const resposne = await db.column.delete({ where: { id: columnId } });
  return resposne;
};
