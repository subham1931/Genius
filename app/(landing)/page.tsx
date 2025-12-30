import { LandingNavbar } from "@/components/landing-navbar";
import { LandingHero } from "@/components/landing-hero";
import { LandingContent } from "@/components/landing-content";

const LandingPage = () => {
  return ( 
    <div className="h-full ">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
      Landing Page
    </div>
   );
}
 
export default LandingPage;

// import Link from "next/link"
// import { Button } from '@/components/ui/button'

// const LandingPage = () =>{
//     return(
//         <div>
//             <h1>Landing Page (Unprotected)</h1>
//             <div>
//                 <Link href="/sign-in">
//                     <Button>
//                         Login
//                     </Button>
//                 </Link>
//                 <Link href="/sign-up">
//                     <Button>
//                         Register
//                     </Button>
//                 </Link>
//             </div>
//         </div>
//     )
// }

// export default LandingPage
