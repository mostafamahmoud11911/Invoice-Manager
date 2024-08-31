"use client";
import { useEffect, useState } from "react";
import ActionModal from "../ActionModal";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { LoadingBtn } from "../Loading";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  createInvoice,
  getInvoice,
  updateInvoice,
} from "@/action/InvoiceAction";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required",
  }),
  status: z.string().min(2, {
    message: "Status is required",
  }),
  amount: z.string().min(2, {
    message: "Amount is required",
  }),
});

const customers = [
  {
    id: 1,
    name: "Dana",
    image:
      "https://img.freepik.com/free-photo/surprised-happy-girl-pointing-left-recommend-product-advertisement-make-okay-gesture_176420-20191.jpg?t=st=1725131881~exp=1725135481~hmac=b6c65d7bd20b2d56436597612c17b9ee85ad845b726ba0208eec9de71cda0d78&w=740",
    email: "dana@me.com",
  },
  {
    id: 2,
    name: "Sarah",
    image: "https://img.freepik.com/free-photo/emotional-happy-young-caucasian-female-with-fair-hair-dressed-blue-clothes-giving-her-thumbs-up-showing-how-good-product-is-pretty-girl-smiling-brodly-with-teeth-gestures-body-language_176420-13493.jpg?t=st=1725132330~exp=1725135930~hmac=da2c65f626ddeb854daf9a01483fb482475e0d05a195b9e098d9cede68ba2a14&w=740",
    email: "sarah@me.com",
  },
  {
    id: 3,
    name: "john",
    image:
      "https://img.freepik.com/free-photo/happy-smiling-handsome-man-looking-pointing-upper-left-corner-banner_176420-18944.jpg?t=st=1725132472~exp=1725136072~hmac=872e2292208a56d89b3cda921281206d3cbb56d1a1bac6a04e99ff283f3318b0&w=740",
    email: "john@me.com",
  },
];

export default function CreateInvoice() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "unpaid",
      amount: "",
    },
  });
  const { formState } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const customer = customers.find((item) => item.name === values.name);
    const formData = {
      amount: values.amount,
      status: values.status,
      customer,
      id: id ? id : "",
    };

    if (id) {
      // Update

      const res = await updateInvoice(formData);
      if (res.message) {
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
      setOpen(false);
      form.reset();
    } else {
      // Create

      const res: { message?: string; error?: string } = await createInvoice(
        formData
      );

      if (res.message) {
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
    }
    setOpen(false)
    form.reset();
  }

  useEffect(() => {
    const fetchInvoice = async () => {
      const res:any = await getInvoice(id!);
      const invoice = JSON.parse(res);
      form.setValue("name", invoice?.customer?.name);
      form.setValue("status", invoice?.status);
      form.setValue("amount", invoice?.amount);
    };
    if (id) {
      setOpen(true);
      fetchInvoice();
    }
  }, [id]);

  useEffect(() => {
    if (!open) {
      router.replace("/");
    }
  }, [open, router]);

  return (
    <div>
      <ActionModal
        title="Create Invoice"
        desc="Create a new invoice"
        trigger={
          <Button className="text-white space-x-1">Create Invoice</Button>
        }
        open={open}
        setOpen={setOpen}
        onClick={() => setOpen(false)}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Customer</SelectLabel>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Amount" {...field} value={field.value}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="unpaid" />
                        </FormControl>
                        <FormLabel className="font-normal">Unpaid</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="paid" />
                        </FormControl>
                        <FormLabel className="font-normal">Paid</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {formState.isSubmitting ? (
              <LoadingBtn btnLoading="Loading..." />
            ) : (
              <Button className="w-full" type="submit">
                Submit
              </Button>
            )}
          </form>
        </Form>
      </ActionModal>
    </div>
  );
}
