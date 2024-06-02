import { getColumnsWithTicketAndTags, updateColumnOrder } from '@/actions/column';
import { getPipelineDetails } from '@/actions/pipeline';
import { updateTicketsOrder } from '@/actions/ticket';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/prisma";
import { ColumnDetail } from "@/types";
import { redirect } from "next/navigation";
import React from "react";
import PipelineInfoBar from "../_components/PipelineInfobar";
import PipelineSettings from "../_components/PipelineSettings";
import PipelineView from "../_components/PipelineView";

type Props = {
  params: { subaccountId: string; pipelineId: string };
};

const PipelinePage = async ({ params }: Props) => {
  const pipelineDetails = await getPipelineDetails(params.pipelineId);
  if (!pipelineDetails)
    return redirect(`/subaccount/${params.subaccountId}/pipelines`);

  const pipelines = await db.pipeline.findMany({
    where: { subAccountId: params.subaccountId },
  });

  const columns = (await getColumnsWithTicketAndTags(
    params.pipelineId
  )) as ColumnDetail[];

  return (
    <Tabs defaultValue='view' className='w-full'>
      <TabsList className='bg-transparent border-b-2 h-16 w-full justify-between mb-4'>
        <PipelineInfoBar
          pipelineId={params.pipelineId}
          subAccountId={params.subaccountId}
          pipelines={pipelines}
        />
        <div>
          <TabsTrigger value='view'>Pipeline View</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value='view'>
        <PipelineView
          columns={columns}
          pipelineDetails={pipelineDetails}
          pipelineId={params.pipelineId}
          subaccountId={params.subaccountId}
          updateColumnOrder={updateColumnOrder}
          updateTicketsOrder={updateTicketsOrder}
        />
      </TabsContent>
      <TabsContent value='settings'>
        <PipelineSettings
          pipelineId={params.pipelineId}
          pipelines={pipelines}
          subaccountId={params.subaccountId}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PipelinePage;
