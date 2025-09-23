import Image from "next/image";

export default function Features() {
  return (
    <section className="px-8 py-16 bg-gray-900 text-center">
      {/* Section Title */}
      <h2 className="text-3xl font-bold mb-6">Features</h2>
      <div className="w-16 h-1 bg-blue-500 mx-auto mb-12 rounded"></div>

      {/* Feature Card */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-10 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-12">
        {/* Text */}
        <div className="flex-1 text-left">
          <h3 className="text-2xl font-semibold mb-4">
            Advanced search and filtering
          </h3>
          <p className="text-gray-300 leading-relaxed">
            Effortlessly find labs that meet your specific needs using our
            powerful search and filter options. Search by location, price, and
            available tests to save time and money.
          </p>
        </div>

        {/* Illustration */}
        <div className="flex-shrink-0">
          <img
            src="../../feature.png" // place your illustration in /public
            alt="Search illustration"
            width={250}
            height={250}
          />
        </div>
      </div>
    </section>
  );
}
