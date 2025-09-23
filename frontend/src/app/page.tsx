import Image from "next/image";
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import Testimonials from "../../components/Testimonials";

export default function Home() {
  return (
    <div >
    <Hero/>
    <Features/>
    <Testimonials/>
    </div>
  );
}
