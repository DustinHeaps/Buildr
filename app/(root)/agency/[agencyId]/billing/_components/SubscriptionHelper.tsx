"use client";
import CustomModal from "@/components/global/CustomModal";
import { PricesList } from "@/types";
import { useModal } from "@/providers/ModalProvider";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import SubscriptionFormWrapper from "@/components/forms/SubscriptionForm/SubscriptionFormWrapper";

type Props = {
  prices: PricesList["data"];
  customerId: string;
  planExists: boolean;
};

const SubscriptionHelper = ({ customerId, planExists, prices }: Props) => {

  const { setOpen } = useModal();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  useEffect(() => {
    
    if (plan)
      setOpen(
        <CustomModal
          title='Upgrade Plan!'
          subheading='Get started today to get access to premium features'
        >
          <SubscriptionFormWrapper
            planExists={planExists}
            customerId={customerId}
          />
        </CustomModal>,
        async () => ({
          plans: {
            defaultPriceId: plan ? plan : "",
            plans: prices,
          },
        })
      );
  }, [plan]);

};

export default SubscriptionHelper;
