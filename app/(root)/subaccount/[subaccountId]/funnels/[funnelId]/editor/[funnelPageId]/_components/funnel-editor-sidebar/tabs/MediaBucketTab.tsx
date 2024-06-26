"use client";
import { getMedia } from "@/actions/media";
import Media from '@/components/media/Media';
import { GetMediaFiles } from "@/types";
import React, { useEffect, useState } from "react";

type Props = {
  subaccountId: string;
};

const MediaBucketTab = (props: Props) => {
  const [data, setdata] = useState<GetMediaFiles>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMedia(props.subaccountId);
      setdata(response);
    };
    fetchData();
  }, [props.subaccountId]);

  return (
    <div className='h-[900px] overflow-scroll p-4'>
      <Media data={data} subaccountId={props.subaccountId} />
    </div>
  );
};

export default MediaBucketTab;
