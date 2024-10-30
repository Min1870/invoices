import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Pagination from "../../components/Pagination";

interface DashboardProps {
  searchParams: Promise<{ page: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardProps) {
  const { userId, orgId } = await auth();
  if (!userId) return;
  const INVOICE_PER_PAGE = 10;
  const { page } = await searchParams;

  const currentPage = page ? parseInt(page) : 1;
  const offset = (currentPage - 1) * INVOICE_PER_PAGE;

  let results;
  if (orgId) {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.organizationId, orgId))
      .limit(INVOICE_PER_PAGE)
      .offset(offset);
  } else {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.userId, userId), isNull(Invoices.organizationId)))
      .limit(INVOICE_PER_PAGE)
      .offset(offset);
  }

  const invoices = results?.map(({ invoices, customers }) => {
    return {
      ...invoices,
      customer: customers,
    };
  });

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p>
            <Button variant="ghost" className="inline-flex gap-2" asChild>
              <Link href="/invoices/new">
                <CirclePlus className="w-4 h-4" /> Create Invoice
              </Link>
            </Button>
          </p>
        </div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] p-4">Date</TableHead>
              <TableHead className="p-4">Customer</TableHead>
              <TableHead className="p-4">Email</TableHead>
              <TableHead className="text-center p-4">Status</TableHead>
              <TableHead className="text-right p-4">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((result) => (
              <TableRow key={result.id}>
                <TableCell className="font-medium text-left p-0">
                  <Link
                    href={`/invoices/${result.id}`}
                    className="font-semibold p-4 block"
                  >
                    {new Date(result.createTs).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className="text-left p-0">
                  <Link
                    href={`/invoices/${result.id}`}
                    className="font-semibold p-4 block"
                  >
                    {result.customer.name}
                  </Link>
                </TableCell>
                <TableCell className="text-left p-0">
                  <Link className="p-4 block" href={`/invoices/${result.id}`}>
                    {result.customer.email}
                  </Link>
                </TableCell>
                <TableCell className="text-center p-0">
                  <Link className="p-4 block" href={`/invoices/${result.id}`}>
                    <Badge
                      className={cn(
                        "rounded-full capitalize",
                        result.status === "open" && "bg-blue-500",
                        result.status === "paid" && "bg-green-600",
                        result.status === "void" && "bg-zinc-700",
                        result.status === "uncollectible" && "bg-red-600"
                      )}
                    >
                      {result.status}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className="text-right p-0">
                  <Link
                    href={`/invoices/${result.id}`}
                    className="font-semibold p-4 block"
                  >
                    ${(result.value / 100).toFixed(2)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Suspense fallback={<>Loading...</>}>
          <Pagination currentPage={currentPage} INVOICE_PER_PAGE={INVOICE_PER_PAGE} />
        </Suspense>
      </Container>
    </main>
  );
}
