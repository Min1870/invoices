"use client";
import { createInvoice } from "@/app/actions";
import Container from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Form from "next/form";
import { SyntheticEvent, useState } from "react";

export default function CreateInvoicePage() {
  const [state, setState] = useState("ready");

  const handleOnSubmit = async (event: SyntheticEvent) => {
    if (state === "pending") {
      event.preventDefault();
      return;
    }
    setState("pending");
  };

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-6 ">
          <h1 className="text-3xl font-bold">Create Invoice</h1>
        </div>
        <Form
          action={createInvoice}
          onSubmit={handleOnSubmit}
          className="grid gap-4 max-w-xs"
        >
          <div>
            <Label className="block font-semibold text-sm mb-2" htmlFor="name">
              Billing Name
            </Label>
            <Input id="name" name="name" type="text" />
          </div>
          <div>
            <Label className="block font-semibold text-sm mb-2" htmlFor="email">
              Billing Email
            </Label>
            <Input id="email" name="email" type="email" />
          </div>
          <div>
            <Label className="block font-semibold text-sm mb-2" htmlFor="value">
              Value
            </Label>
            <Input id="value" name="value" type="text" />
          </div>
          <div>
            <Label
              className="block font-semibold text-sm mb-2"
              htmlFor="description"
            >
              Description
            </Label>
            <Textarea id="description" name="description"></Textarea>
          </div>
          <div>
            <SubmitButton />
          </div>
        </Form>
      </Container>
    </main>
  );
}
