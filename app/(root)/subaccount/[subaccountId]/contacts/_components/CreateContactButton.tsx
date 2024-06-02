"use client";
import ContactUserForm from "@/components/forms/ContactUserForm";
import CustomModal from "@/components/global/CustomModal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";
import React from "react";

type Props = {
  subaccountId: string;
};

const CreateContactButton = ({ subaccountId }: Props) => {
  const { setOpen } = useModal();

  const handleCreateContact = async () => {
    setOpen(
      <CustomModal
        title='Create Or Update Contact information'
        subheading='Contacts are like customers.'
      >
        <ContactUserForm subaccountId={subaccountId} />
      </CustomModal>
    );
  };

  return <Button onClick={handleCreateContact}>Create Contact</Button>;
};

export default CreateContactButton;
