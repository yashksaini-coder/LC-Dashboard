"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function HintCard({ hints }: { hints: string[] }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="w-36rem">
        <Button className="py-2 text-black hover:bg-purple-700 bg-white hover:text-white" variant="outline">Hints</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-36rem backdrop-blur bg-opacity-100 border border-gray-100 border text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="w-16 px-2 bg-purple-500">Hints</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <div>
            <ul className="list-outside list-disc">
            {hints.slice(0, 3).map((hint, index) => (
              <li key={index} className="mb-2 text-wrap text-sm">{String(hint)}</li>
            ))}
            </ul>
          </div>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}