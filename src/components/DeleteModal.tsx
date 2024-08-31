"use client";
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
import React, {
  Dispatch,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  SetStateAction,
  useState,
} from "react";
import { Input } from "./ui/input";

export interface DeleteInvoiceProps {
  desc: string;
  title: string;
  pass: string;
  onClick: () => void;
  btnText?: string;
  // open: boolean;
  // setOpen: Dispatch<SetStateAction<boolean>>;
  trigger: ReactElement;
}

export default function DeleteModal({
  desc,
  title,
  pass,
  onClick,
  btnText,
  trigger,

}: DeleteInvoiceProps) {
  const [keyword, setKeyword] = useState("");

  
  return (
    <div>
      <AlertDialog >
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{desc}</AlertDialogDescription>
            <p>
              To delete: Type <b>{pass}</b> in the input field
            </p>
            <Input
              type="text"
              className="border-red-600"
              value={keyword}
              placeholder="Search"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setKeyword(e.target.value)
              }
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={keyword !== pass ? true : false}
              onClick={onClick}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
