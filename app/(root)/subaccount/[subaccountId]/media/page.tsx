import BlurPage from "@/components/global/BlurPage";
import Media from "@/components/media/Media";
import { getMedia } from "@/actions/media";
import React from "react";

type Props = {
  params: { subaccountId: string };
};

const MediaPage = async ({ params }: Props) => {
  const data = await getMedia(params.subaccountId);

  return (
    <BlurPage>
      <Media data={data} subaccountId={params.subaccountId} />
    </BlurPage>
  );
};

export default MediaPage;
