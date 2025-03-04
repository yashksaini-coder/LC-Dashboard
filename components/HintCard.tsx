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
      <AlertDialogTrigger asChild>
        <Button className="w-full py-2 text-black hover:bg-purple-700 bg-white hover:text-white" variant="outline">Hints</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[95%] max-w-[90vw] sm:max-w-[85vw] md:max-w-[600px] backdrop-blur bg-opacity-100 border border-gray-100 text-white overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle className="w-16 px-2 bg-purple-500">Hints</AlertDialogTitle>
        </AlertDialogHeader>
        
        {/* Instead of putting elements inside AlertDialogDescription that becomes a <p>, 
            move the container outside and use simple text inside the description */}
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          <AlertDialogDescription className="text-sm text-white mb-2">
            Hints for this problem:
          </AlertDialogDescription>
          
          <ul className="list-outside list-disc pl-5">
            {hints.slice(0, 3).map((hint, index) => (
              <li key={index} className="mb-3 text-wrap break-words text-xs sm:text-sm whitespace-normal text-white">{String(hint)}</li>
            ))}
          </ul>
        </div>
        
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white">Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}