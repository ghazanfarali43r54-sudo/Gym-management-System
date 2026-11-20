import Navbar from "@/components/public page/Navbar";
import Hero from "@/components/public page/Hero";
import Marquee from "@/components/public page/Marquee";
import Features from "@/components/public page/Features";
import Membership from "@/components/public page/Membership";
import Shorts from "@/components/public page/Shorts";
import Calculator from "@/components/public page/Calculator";
import Review from "@/components/public page/Review";
import Pricing from "@/components/public page/Pricing";
import Trainer from "@/components/public page/Trainer";


export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Features />
         <Pricing />
        <Membership />
        <Trainer />
        <Shorts />
        <Calculator />
        <Review />
      </main>
    </>
  );
}
