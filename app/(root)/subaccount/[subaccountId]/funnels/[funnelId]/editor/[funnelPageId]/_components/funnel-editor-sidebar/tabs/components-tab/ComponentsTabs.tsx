import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditorBtns } from "@/constants";
import React from "react";
import CheckoutPlaceholder from "./CheckoutPlaceholder";
import ContactFormComponentPlaceholder from "./ContactFormPlaceholder";
import ContainerPlaceholder from "./ContainerPlaceholder";
import LinkPlaceholder from "./LinkPlaceholder";
import TextPlaceholder from "./TextPlaceholder";
import TwoColumnsPlaceholder from "./TwoColumnsPlacehlder";
import VideoPlaceholder from "./VideoPlaceholderr";

type Props = {};

const ComponentsTab = (props: Props) => {
  const elements: {
    Component: React.ReactNode;
    label: string;
    id: EditorBtns;
    group: "layout" | "elements";
  }[] = [
    {
      Component: <TextPlaceholder />,
      label: "Text",
      id: "text",
      group: "elements",
    },
    {
      Component: <ContainerPlaceholder />,
      label: "Container",
      id: "container",
      group: "layout",
    },
    {
      Component: <TwoColumnsPlaceholder />,
      label: "2 Columns",
      id: "2Col",
      group: "layout",
    },
    {
      Component: <VideoPlaceholder />,
      label: "Video",
      id: "video",
      group: "elements",
    },
    {
      Component: <ContactFormComponentPlaceholder />,
      label: "Contact",
      id: "contactForm",
      group: "elements",
    },
    {
      Component: <CheckoutPlaceholder />,
      label: "Checkout",
      id: "paymentForm",
      group: "elements",
    },
    {
      Component: <LinkPlaceholder />,
      label: "Link",
      id: "link",
      group: "elements",
    },
  ];

  return (
    <Accordion
      type='multiple'
      className='w-full'
      defaultValue={["Layout", "Elements"]}
    >
      <AccordionItem value='Layout' className='px-6 py-0 border-y-[1px]'>
        <AccordionTrigger className='!no-underline'>Layout</AccordionTrigger>
        <AccordionContent className='flex flex-wrap gap-2 '>
          {elements
            .filter((element) => element.group === "layout")
            .map((element) => (
              <div
                key={element.id}
                className='flex-col items-center justify-center flex'
              >
                {element.Component}
                <span className='text-muted-foreground'>{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='Elements' className='px-6 py-0 '>
        <AccordionTrigger className='!no-underline'>Elements</AccordionTrigger>
        <AccordionContent className='flex flex-wrap gap-2 '>
          {elements
            .filter((element) => element.group === "elements")
            .map((element) => (
              <div
                key={element.id}
                className='flex-col items-center justify-center flex'
              >
                {element.Component}
                <span className='text-muted-foreground'>{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ComponentsTab;