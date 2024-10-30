import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, count, eq, isNull } from "drizzle-orm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface PaginationProps {
  currentPage: number;
  INVOICE_PER_PAGE: number;
}

const Pagination = async ({
  currentPage,
  INVOICE_PER_PAGE,
}: PaginationProps) => {
  const { userId, orgId } = await auth();

  if (!userId) return;

  let invoicesCount;
  if (orgId) {
    [invoicesCount] = await db
      .select({
        count: count(),
      })
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.organizationId, orgId));
  } else {
    [invoicesCount] = await db
      .select({
        count: count(),
      })
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(eq(Invoices.userId, userId!), isNull(Invoices.organizationId))
      );
  }

  return (
    <ul className="flex justify-between items-center text-sm mt-8">
      <li>
        {currentPage > 1 && (
          <Link
            href={{
              pathname: "/dashboard",
              query: {
                page: currentPage - 1,
              },
            }}
          >
            <span className="flex items-center gap-1">
              <ChevronLeft className="w-5 h-5" /> Previous
            </span>
          </Link>
        )}
        {currentPage <= 1 && (
          <span className="text-zinc-400 flex items-center gap-1">
            <ChevronLeft className="w-5 h-5" /> Previous
          </span>
        )}
      </li>

      {typeof invoicesCount.count === "number" && (
        <li className="flex-grow flex justify-center">
          <ul className="flex items-center gap-3">
            {[
              ...new Array(Math.ceil(invoicesCount?.count / INVOICE_PER_PAGE)),
            ].map((_, index) => {
              const page = index + 1;
              return (
                <li key={page}>
                  <Button
                    variant={page === currentPage ? "default" : "outline"}
                    className="h-auto px-2.5 py-1"
                    size="sm"
                    asChild
                  >
                    <Link
                      href={{
                        pathname: "/dashboard",
                        query: {
                          page,
                        },
                      }}
                    >
                      {page}
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </li>
      )}

      <li>
        {currentPage < Math.ceil(invoicesCount.count / INVOICE_PER_PAGE) && (
          <Link
            href={{
              pathname: "/dashboard",
              query: {
                page: currentPage + 1,
              },
            }}
          >
            <span className="flex items-center gap-1">
              Next <ChevronRight className="w-5 h-5" />
            </span>
          </Link>
        )}
        {currentPage >= Math.ceil(invoicesCount.count / INVOICE_PER_PAGE) && (
          <span className="text-zinc-400 flex items-center gap-1">
            Next <ChevronRight className="w-5 h-5" />
          </span>
        )}
      </li>
    </ul>
  );
};

export default Pagination;
