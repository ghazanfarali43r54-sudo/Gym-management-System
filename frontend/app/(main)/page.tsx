import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Features from "@/components/Features";
import Membership from "@/components/Membership";
import Shorts from "@/components/Shorts";
import Calculator from "@/components/Calculator";
import Review from "@/components/Review";
import Pricing from "@/components/Pricing";
import Trainer from "@/components/Trainer";


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
