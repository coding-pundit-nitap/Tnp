export default function RecruiterLogos() {
  const recruiters = [
    { name: "Infosys", src: "/recruiters/infosys.png" },
    { name: "TCS", src: "/recruiters/tcs.png" },
    { name: "Wipro", src: "/recruiters/wipro.png" },
    { name: "Deloitte", src: "/recruiters/deloitte.png" },
    { name: "Capgemini", src: "/recruiters/capgemini.png" },
    { name: "Cognizant", src: "/recruiters/cognizant.png" },
    { name: "Accenture", src: "/recruiters/accenture.png" },
    { name: "Samsung", src: "/recruiters/samsung.png" },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Our Recruiters
        </h2>

        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-indigo-600" />

        <p className="mt-6 text-lg text-gray-600">
          Leading organizations across technology, consulting, and core
          engineering sectors have recruited our students.
        </p>

        <div className="mt-12 grid grid-cols-2 items-center gap-10 sm:grid-cols-3 md:grid-cols-4">
          {recruiters.map((r) => (
            <div key={r.name} className="flex justify-center">
              <img
                src={r.src}
                alt={r.name}
                className="h-14 object-contain grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
