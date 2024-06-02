"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Funnel, Column, Pipeline } from "@prisma/client";
import { Input } from "../ui/input";

import { Button } from "../ui/button";
import LoadingComponent from "../global/LoadingComponent";
import { ColumnFormSchema } from "@/schemas";

import { v4 } from "uuid";
import { toast } from "../ui/use-toast";
import { useModal } from "@/providers/ModalProvider";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createColumn } from "@/actions/column";
import { getPipelineDetails } from "@/actions/pipeline";

interface CreateColumnFormProps {
  defaultData?: Column;
  pipelineId: string;
}

const ColumnForm: React.FC<CreateColumnFormProps> = ({
  defaultData,
  pipelineId,
}) => {
  const { setClose } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof ColumnFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ColumnFormSchema),
    defaultValues: {
      name: defaultData?.name || "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name || "",
      });
    }
  }, [defaultData]);

  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof ColumnFormSchema>) => {
    if (!pipelineId) return;
    try {
      const response = await createColumn({
        ...values,
        id: defaultData?.id,
        pipelineId: pipelineId,
        order: defaultData?.order,
      });

      const d = await getPipelineDetails(pipelineId);

      if (!d) return;
      if(!defaultData?.id) {
        toast({
          title: "Success",
          description: "Created pipeline",
        });
      } else {
        toast({
          title: "Success",
          description: "Updated pipeline",
        });
      }
    
      

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not save pipeline details",
      });
    }
    setClose();
  };
  return (
    <Card className='w-full '>
      <CardHeader>
        <CardTitle>Column Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Column Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Column Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className='w-20 mt-4' disabled={isLoading} type='submit'>
              {form.formState.isSubmitting ? <LoadingComponent /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ColumnForm;
