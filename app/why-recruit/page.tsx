import Image from "next/image";

export default function WhyRecruit() {
  const recruiters = [
    { name: "Infosys", logo: "/recruiters/infosys.png" },
    { name: "TCS", logo: "/recruiters/tcs.png" },
    { name: "Wipro", logo: "/recruiters/wipro.png" },
    { name: "Deloitte", logo: "/recruiters/deloitte.png" },
    { name: "Capgemini", logo: "/recruiters/capgemini.png" },
    { name: "Cognizant", logo: "/recruiters/cognizant.png" },
    { name: "Accenture", logo: "/recruiters/accenture.png" },
    { name: "Samsung", logo: "/recruiters/samsung.png" },
    { name: "Tech Mahindra", logo: "/recruiters/techmahindra.png" },
    { name: "Larsen & Toubro", logo: "/recruiters/lnt.png" },
    { name: "IBM", logo: "/recruiters/ibm.png" },
  ];

  return (
    <section className="relative bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-28 px-6 text-white">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative mx-auto max-w-6xl">
        {/* Title */}
        <h1 className="text-4xl font-bold sm:text-5xl">
          Why Recruit from NIT Arunachal Pradesh
        </h1>

        <div className="mt-6 h-1 w-20 rounded-full bg-indigo-500" />

        {/* Intro */}
        <p className="mt-8 text-lg leading-relaxed text-slate-200">
          National Institute of Technology, Arunachal Pradesh (NIT AP) is an
          Institute of National Importance under the Ministry of Education,
          Government of India. The institute is committed to producing graduates
          with strong technical foundations, professional discipline, and
          industry readiness.
        </p>

        {/* Main Content */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2">
          <InfoCard
            title="Industry-Aligned Curriculum"
            text="Strong engineering fundamentals integrated with modern tools, technologies, and application-oriented learning."
          />
          <InfoCard
            title="Hands-On Projects & Practical Exposure"
            text="Multiple mini-projects and a comprehensive capstone project addressing real-world problems."
          />
          <InfoCard
            title="Internships & Industrial Training"
            text="Encouragement and support for internships with industries, startups, research organizations, and PSUs."
          />
          <InfoCard
            title="Professional Skills & Workplace Readiness"
            text="Focused training in communication, teamwork, ethics, and professional conduct."
          />
          <InfoCard
            title="Structured Placement Support"
            text="Transparent, time-bound recruitment process coordinated by the Training & Placement Cell."
          />
        </div>

        {/* Past Recruiters */}
        <div className="mt-28">
          <h2 className="text-3xl font-bold sm:text-4xl">Past Recruiters</h2>

          <div className="mt-4 h-1 w-16 rounded-full bg-indigo-500" />

          <p className="mt-6 text-lg text-slate-200">
            Students of NIT Arunachal Pradesh have been recruited by leading
            organizations across technology, consulting, and core engineering
            sectors.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {recruiters.map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-center rounded-xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Image
                  src={r.logo}
                  alt={r.name}
                  width={140}
                  height={60}
                  className="object-contain grayscale opacity-80 transition hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-slate-400">
            *The above list is indicative and not exhaustive.
          </p>
        </div>
      </div>
    </section>
  );
}

/* Reusable Card */
function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl bg-white p-8 text-gray-900 shadow-lg">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-4 text-gray-700">{text}</p>
    </div>
  );
}
