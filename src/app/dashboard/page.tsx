import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { Invoices } from "@/db/schema";

export default async function DashboardPage() {
  const results = await db.select().from(Invoices);
  console.log(results);
  return (
    <main className="flex flex-col justify-center h-full text-center gap-6 max-w-5xl mx-auto my-12">
      <div className="flex justify-between">
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
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell className="font-medium text-left p-4">
                <span className="font-semibold">
                  {new Date(result.createTs).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell className="text-left p-4">
                <span className="font-semibold">Philips J. Frey</span>
              </TableCell>
              <TableCell className="text-left p-4">
                <span>frey@gmail.com</span>
              </TableCell>
              <TableCell className="text-center p-4">
                <Badge className="rounded-full">{result.status}</Badge>
              </TableCell>
              <TableCell className="text-right p-4">
                <span className="font-semibold">${(result.value / 100).toFixed(2)}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}