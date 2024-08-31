"use server";

import { connectDB } from "@/lib/mongoDB";
import { invoice } from "@/models/InvoiceModel";
import { revalidatePath } from "next/cache";

function getErrorMessage(error: any) {
  let message;
  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Something Went Wrong";
  }

  return message;
}

export async function createInvoice(formData: {
  customer?: { id: number; name: string; image: string; email: string };
  id: string;
  amount: string;
  status: string;
}) {
  const { amount, status, customer } = formData;
  try {
    if (!customer || !amount || !status) {
      return {
        message: "Please fill all the fields",
      };
    }

    await connectDB();
    await invoice.create({ amount, status, customer });

    revalidatePath("/");

    return {
      message: "Invoice created successfully",
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}

export async function getInvoices(params: {
  search: string;
  page: number;
  limit?: number;
}) {
  const page = params.page;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;
  const query = {
    ...(params.search && {
      $or: [
        { amount: { $regex: params.search, $options: "i" } },
        { status: { $regex: params.search, $options: "i" } },
        { "customer.name": { $regex: params.search, $options: "i" } },
        { "customer.email": { $regex: params.search, $options: "i" } },
      ],
    }),
  };

  await connectDB();
  const invoices = await invoice
    .find(query)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  const total: number = await invoice.countDocuments(query);
  const pageCount = Math.ceil(total / limit);

  return JSON.stringify({ total, pageCount, data: invoices });
}

export async function deleteInvoice(id: string) {
  try {
    await connectDB();
    await invoice.findByIdAndDelete(id);

    revalidatePath("/");

    return {
      message: "Invoice deleted successfully",
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}

export async function getInvoice(id: string) {
  try {
    await connectDB();
    const res = await invoice.findById(id);

    return JSON.stringify(res);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}

export async function updateInvoice(formData: {
  id: string;
  amount: string;
  status: string;
  customer:
    | { id: number; name: string; image: string; email: string }
    | undefined;
}) {
  try {
    await connectDB();

    await invoice.findByIdAndUpdate(formData.id, formData);

    revalidatePath("/");

    return {
      message: "Invoice updated successfully",
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
}
