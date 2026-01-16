import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function PersonalCard() {
  return (
    <Card className=" py-0 w-[340px] overflow-hidden rounded-2xl shadow-md">

      {/* HEADER */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* CURVA */}
        <div className="absolute bottom-0 left-0 w-full h-14 bg-white rounded-tl-[20px]" />

        {/* AVATAR */}
        <div className="absolute bottom-5 left-6 z-10">
          <Avatar className="h-12 w-12 border-4 border-white shadow-md">
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* BODY */}
      <CardContent className="pt-6">
        <p className="text-xs text-muted-foreground mb-2">
          12 Jan 2026
        </p>

        <h3 className="font-semibold text-sm leading-snug">
          The Rise of Remote Work: Benefits, Challenges, and Future...
        </h3>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="flex justify-between text-xs text-muted-foreground py-6">
        <div className="flex items-center gap-1">
          <span className="material-icons text-sm">chat_bubble_outline</span>
          8.49k
        </div>
        <div className="flex items-center gap-1">
          <span className="material-icons text-sm">visibility</span>
          6.98k
        </div>
        <div className="flex items-center gap-1">
          <span className="material-icons text-sm">favorite_border</span>
          2.03k
        </div>
      </CardFooter>

    </Card>
  );
}
