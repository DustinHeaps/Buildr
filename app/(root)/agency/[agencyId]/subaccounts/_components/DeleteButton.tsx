"use client";
import { deleteSubAccount, getSubaccountDetails } from "@/actions/subaccount";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  subaccountId: string;
};

const DeleteButton = ({ subaccountId }: Props) => {
  const router = useRouter();

  return (
    <div
      className='text-white'
      onClick={async () => {
        await deleteSubAccount(subaccountId);
        toast({
          title: "Deleted Subaccount",
          description: "Successfully deleted the subaccount",
        });
        router.refresh();
      }}
    >
      Delete Sub Account
    </div>
  );
};

export default DeleteButton;
