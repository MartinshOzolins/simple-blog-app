import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <LoaderCircle className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  );
}
