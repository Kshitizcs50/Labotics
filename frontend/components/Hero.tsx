import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 py-20 bg-gray-900">
      {/* Left Content */}
      <div className="max-w-xl space-y-6">
        <h1 className="text-green-400 text-4xl md:text-6xl font-extrabold leading-tight">
          The <span className="text-green-400">Easiest</span> way to Find Labs
        </h1>
        <p className="text-gray-300 text-lg">
          where you can <span className="text-blue-400">Filter by your choice</span> and book tests easily.
        </p>
        <Link
          href="/get-started"
          className="inline-block px-6 py-3 text-lg font-medium rounded-md bg-blue-600 hover:bg-blue-700"
        >
          Get Started →
        </Link>
      </div>

      {/* Right Image */}
      <div className="mt-10 md:mt-0 mr-7.5">
        <img
          src="../../hero-image.png"
          alt="Lab illustration"
          width={400}
          height={400}
        

        />
      </div>
    </section>
  );
}
