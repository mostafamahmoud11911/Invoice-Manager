"use client";
import React, { useEffect, useRef, useState } from "react";
import Search from "../Search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import ReactPaginate from "react-paginate";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import { Mail, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import DeleteModal from "../DeleteModal";
import { Button } from "../ui/button";
import { deleteInvoice } from "@/action/InvoiceAction";
import { toast } from "react-toastify";

interface InvoiceProps {
  _id: string;
  customer: {
    id: string;
    name: string;
    image: string;
    email: string;
  };
  amount: string;
  status: string;
  sent: number;
  createdAt: string;
}

interface InvoiceListProps {
  total: number;
  pageNumber: number;
  invoices: InvoiceProps[];
}

export default function ListInvoice({
  total,
  pageNumber,
  invoices,
}: {
  total: number;
  pageNumber: number;
  invoices: InvoiceProps[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef(1);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (total > 0) {
      setPageCount(pageNumber);
    }
  }, [pageNumber, total]);

  function handlePageChange(e: { selected: number }) {
    const params = new URLSearchParams(searchParams.toString());

    if (currentPage.current) {
      params.set("page", e.selected + 1 + "");
    }
    currentPage.current = e.selected + 1;
    router.replace(`${pathname}?${params.toString()}`);
  }

  const debounced = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 1500);

  useEffect(() => {
    debounced();
  }, [search]);

  async function onDelete(id: string) {
    const data = await deleteInvoice(id);
    if (data.message) {
      toast.success(data.message);
    }
    if (data.error) {
      toast.error(data.error);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>total: {total}</div>
        <div className="my-3">
          <Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            defaultValue=""
          />
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">s/n</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice, index) => (
              <TableRow key={invoice._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <span>
                      <Avatar>
                        <AvatarImage
                          src={invoice.customer.image}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {invoice.customer.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </span>
                    <span>{invoice.customer.name}</span>
                  </div>
                </TableCell>
                <TableCell>{invoice.customer.email}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  {format(new Date(invoice.createdAt), "yyyy-MM-dd")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.status === "paid" ? "default" : "destructive"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex space-x-3 items-center">
                  <span>
                    <Link href={`/?id=${invoice._id}`}>
                      <Tooltip
                        placement="top"
                        trigger={["hover"]}
                        overlay={<span>Update</span>}
                      >
                        <Pencil size={18} color="green" />
                      </Tooltip>
                    </Link>
                  </span>
                  <span>
                    <Tooltip
                      placement="top"
                      trigger={["hover"]}
                      overlay={<span>Delete</span>}
                    >
                      <DeleteModal
                        pass="Delete"
                        desc="Are you sure you want to delete this invoice?"
                        trigger={<Trash2 size={18} color="red" />}
                        onClick={() => onDelete(invoice._id)}
                        btnText=""
                        title={""}
                      />
                    </Tooltip>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {invoices.length > 0 && (
          <ReactPaginate
            breakLabel="..."
            className="flex w-[300px] justify-between py-3"
            nextLabel="next >"
            onPageChange={handlePageChange}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
          />
        )}
      </div>
    </div>
  );
}
