"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { pricingCards, addOnProducts } from "@/constants";
import { useModal } from "@/providers/ModalProvider";
import { Plan } from "@prisma/client";
import { StripeElementsOptions } from "@stripe/stripe-js";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import LoadingComponent from "@/components/global/LoadingComponent";
import SubscriptionForm from "./SubscriptionForm";
import { getStripe } from "@/lib/stripe/stipe-client";
import { stripe } from "@/lib/stripe";

type Props = {
  customerId: string;
  planExists: boolean;
  addOn?: any;
};

const SubscriptionFormWrapper = ({ customerId, planExists, addOn }: Props) => {
  const { data, setClose } = useModal();
  const router = useRouter();
  const [selectedPriceId, setSelectedPriceId] = useState<Plan | "">(
    data?.plans?.defaultPriceId || ""
  );
  const [subscription, setSubscription] = useState<{
    subscriptionId: string;
    clientSecret: string;
  }>({ subscriptionId: "", clientSecret: "" });

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret: subscription?.clientSecret,
      appearance: {
        theme: "flat",
      },
    }),
    [subscription]
  );

  useEffect(() => {
    if (!selectedPriceId) return;
    const createSecret = async () => {
      const subscriptionResponse = await fetch(
        "/api/stripe/create-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId,
            priceId: selectedPriceId,
          }),
        }
      );
      const subscriptionResponseData = await subscriptionResponse.json();
      setSubscription({
        clientSecret: subscriptionResponseData.clientSecret,
        subscriptionId: subscriptionResponseData.subscriptionId,
      });
      if (planExists) {
        toast({
          title: "Success",
          description: "Your plan has been successfully upgraded!",
        });
        setClose();
        router.refresh();
      }
    };
    createSecret();
  }, [data, selectedPriceId, customerId]);

  return (
    <div className='border-none transition-all'>
      <div className='flex flex-col gap-4'>
        {!addOn ? (
          data.plans?.plans.map((price) => (
            <Card
              onClick={() => setSelectedPriceId(price.id as Plan)}
              key={price.id}
              className={clsx("relative cursor-pointer transition-all", {
                "border-primary": selectedPriceId === price.id,
              })}
            >
              <CardHeader>
                <CardTitle>
                  ${price.unit_amount ? price.unit_amount / 100 : "0"}
                  <p className='text-sm text-muted-foreground'>
                    {price.nickname}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {
                      pricingCards.find((p) => p.priceId === price.id)
                        ?.description
                    }
                  </p>
                </CardTitle>
              </CardHeader>
              {selectedPriceId === price.id && (
                <div className='w-2 h-2 bg-emerald-500 rounded-full absolute top-4 right-4' />
              )}
            </Card>
          ))
        ) : (
          <Card
            onClick={() => setSelectedPriceId(addOn.default_price.id as Plan)}
            key={addOn.id}
            className={clsx("relative cursor-pointer transition-all", {
              "border-primary": selectedPriceId === addOn.default_price.id,
            })}
          >
            <CardHeader>
              <CardTitle>
                $
                {addOn.default_price.unit_amount
                  ? addOn.default_price.unit_amount / 100
                  : "0"}
                <p className='text-sm text-muted-foreground'>
                  {addOn.nickname}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {addOn.description}
                </p>
              </CardTitle>
            </CardHeader>
            {selectedPriceId === addOn.default_price.id && (
              <div className='w-2 h-2 bg-emerald-500 rounded-full absolute top-4 right-4' />
            )}
          </Card>
        )}

        {options.clientSecret && !planExists && (
          <>
            <h1 className='text-xl'>Payment Method</h1>
            <Elements stripe={getStripe()} options={options}>
              <SubscriptionForm selectedPriceId={selectedPriceId} />
            </Elements>
          </>
        )}

        {!options.clientSecret && selectedPriceId && (
          <div className='flex items-center justify-center w-full h-40'>
            <LoadingComponent />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionFormWrapper;
