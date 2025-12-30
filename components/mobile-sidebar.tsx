// "use client";

// import { useEffect, useState } from "react";
// import { Menu } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Sidebar } from "@/components/sidebar";

// export const MobileSidebar = ({
//   apiLimitCount = 0,
//   isPro = false
// }: {
//   apiLimitCount: number;
//   isPro: boolean;
// }) => {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) {
//     return null;
//   }

//   return (
//     <Sheet>
//       <SheetTrigger>
//         <Button variant="ghost" size="icon" className="md:hidden">
//           <Menu />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="p-0">
//         <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
//       </SheetContent>
//     </Sheet>
//   );
// };


"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";

interface MobileSidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const MobileSidebar = ({
  apiLimitCount = 0,
  isPro = false
}: MobileSidebarProps) => {
  const [isMount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);
  if (!isMount) {
    return null;
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
