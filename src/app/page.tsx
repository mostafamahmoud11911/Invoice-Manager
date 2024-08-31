import { getInvoices } from "@/action/InvoiceAction";
import CreateInvoice from "@/components/invoice/CreateInvoice";
import ListInvoice from "@/components/invoice/ListInvoice";
import { Separator } from "@/components/ui/separator";

export default async function Home({
  searchParams: { search, page },
}: {
  searchParams: { search: string; page: number };
}) {
  const searchParam = search || "";
  const pageParam = page || 1;

  const invoiceList = await getInvoices({
    search: searchParam,
    page: pageParam,
    limit: 5,
  })

const invoice = JSON.parse(invoiceList)


  return (
    <div className="flex justify-center min-h-[90vh] py-12">
      <section className="w-full px-2 max-w-[1000px]">
        <div className="flex justify-between ">
          <h3 className="text-2xl font-semibold">Invoice Manager</h3>
          <CreateInvoice />
        </div>
        <Separator className="my-2 border-b-[2px] border-blue-300" />

        <ListInvoice total={invoice.total} pageNumber={invoice.pageCount} invoices={invoice.data}/>
      </section>
    </div>
  );
}
