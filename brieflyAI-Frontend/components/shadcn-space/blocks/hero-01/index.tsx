import HeroSection from "@/components/shadcn-space/blocks/hero-01/hero";
import type { NavigationSection } from "@/components/shadcn-space/blocks/hero-01/header";
import Header from "@/components/shadcn-space/blocks/hero-01/header";
import BrandSlider, { BrandList } from "@/components/shadcn-space/blocks/hero-01/brand-slider";
import { Toaster } from "sonner";

export default function MainSection() {


  const navigationData: NavigationSection[] = [
    {
      title: "Home",
      href: "#",
      isActive: true,
    },
    {
      title: "About us",
      href: "#",
    },
    {
      title: "Services",
      href: "#",
    },    
    {
      title: "Team",
      href: "#",
    },
    {
      title: "Pricing",
      href: "#",
    },
    {
      title: "Awards",
      href: "#",
    },
  ];

  const brandList: BrandList[] = [
      {
    image: "/google_meet.png",
    name: "Google Meet"
  },
  {
    image: "/zoom.png",
    name: "Zoom"
  },
  {
    image: "/microsoft.png",
    name: "Microsoft Teams"
  }
  ];

  return (
    <div className="relative">
      <Header navigationData={navigationData} />
      <main>
        <HeroSection/>
        <BrandSlider brandList={brandList} />
      </main>
    </div>
  );
}
