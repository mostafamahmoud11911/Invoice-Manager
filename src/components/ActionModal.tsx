import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { Dispatch, SetStateAction } from "react";

export interface CreateInvoiceProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  trigger:  React.ReactNode;
  desc: string;
  title: string;
  children: React.ReactNode;
  btnText?: string;
  onClick: () => void;
}

export default function ActionModal({
  open,
  setOpen,
  trigger,
  desc,
  title,
  btnText,
  onClick,
  children,
}: CreateInvoiceProps) {
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{desc}</AlertDialogDescription>
          </AlertDialogHeader>
          {children}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {btnText && (
              <AlertDialogAction onClick={onClick}>{btnText}</AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
