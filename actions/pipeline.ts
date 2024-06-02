"use server";

import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

export const createPipeline = async (
  pipeline: Prisma.PipelineUncheckedCreateWithoutColumnInput
) => {
  const response = await db.pipeline.upsert({
    where: { id: pipeline.id || v4() },
    update: pipeline,
    create: pipeline,
  });

  return response;
};

export const getPipelines = async (subaccountId: string) => {
  const response = await db.pipeline.findMany({
    where: { subAccountId: subaccountId },
    include: {
      Column: {
        include: { Tickets: true },
      },
    },
  });
  return response;
};

export const getPipelineDetails = async (pipelineId: string) => {
  const response = await db.pipeline.findUnique({
    where: {
      id: pipelineId,
    },
  });
  return response;
};

export const deletePipeline = async (pipelineId: string) => {
  const response = await db.pipeline.delete({
    where: { id: pipelineId },
  });
  return response;
};
