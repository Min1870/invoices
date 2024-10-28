import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import Invoice from "./invoice";

interface Props {
  params: { id: string };
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) return;

  const { id } = await params;
  const invoiceId = parseInt(id);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }

  const [result] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  if (!result) {
    notFound();
  }

  return <Invoice invoice={result} />;
}
