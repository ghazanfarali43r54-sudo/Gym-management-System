import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Features from "@/components/Features";
import Membership from "@/components/Membership";
import Shorts from "@/components/Shorts";
import Calculator from "@/components/Calculator";
import Review from "@/components/Review";
import Link from "next/link";


export default function Home() {
  return (
    <>
    <Link href="/admin/login">Admin</Link>
    <Link href="/admin/dashboard">Dashboard</Link>
    <Link href="/trainer/login">Trainer</Link>
     <TopBar />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Features />
        <Membership />
        <Shorts />
        <Calculator />
        <Review />
      </main>
    </>
  );
}