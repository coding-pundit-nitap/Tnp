export default function PlacementsPage() {
  return (
    <section className="relative bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-28 px-6 text-white">
      {/* subtle overlay */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative mx-auto max-w-6xl">
        {/* Page Title */}
        <h1 className="text-4xl font-bold sm:text-5xl">Placements</h1>
        <div className="mt-6 h-1 w-20 rounded-full bg-indigo-500" />

        {/* Intro */}
        <p className="mt-8 text-lg leading-relaxed text-slate-200">
          The Training & Placement Cell of National Institute of Technology,
          Arunachal Pradesh facilitates campus recruitment by providing a
          structured platform for interaction between graduating students and
          recruiting organizations. The institute ensures a fair, transparent,
          and efficient recruitment process for all stakeholders.
        </p>

        <p className="mt-4 text-lg leading-relaxed text-slate-200">
          Students pursue career opportunities across information technology,
          core engineering, public sector undertakings, consulting, research,
          higher education, and emerging startups.
        </p>

        {/* Placement Highlights */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Diverse Career Paths",
              desc: "IT, core engineering, analytics, PSUs, research, startups.",
            },
            {
              title: "Strong Participation",
              desc: "High student participation across eligible programs.",
            },
            {
              title: "Industry Engagement",
              desc: "Collaboration for placements, internships & projects.",
            },
            {
              title: "Transparent Process",
              desc: "Clear rules ensuring fairness and equal opportunity.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-white p-8 text-gray-900 shadow-lg"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Placement Process */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold sm:text-4xl">Placement Process</h2>
          <div className="mt-4 h-1 w-16 rounded-full bg-indigo-500" />

          <p className="mt-6 text-lg text-slate-200">
            The campus recruitment process at NIT Arunachal Pradesh is
            systematic, time-bound, and recruiter-friendly.
          </p>

          <div className="mt-14 space-y-8">
            {[
              {
                step: "Step 1: Invitation to Recruiters",
                desc: "Formal invitation and sharing of institutional and student information.",
              },
              {
                step: "Step 2: Job Description & Eligibility",
                desc: "Recruiters share job roles, eligibility, CTC and timelines.",
              },
              {
                step: "Step 3: Student Registration",
                desc: "Eligible students register via the placement portal.",
              },
              {
                step: "Step 4: Pre-Placement Interaction",
                desc: "Organizations introduce roles, culture and growth paths.",
              },
              {
                step: "Step 5: Assessment & Selection",
                desc: "Written tests, interviews and selection rounds.",
              },
              {
                step: "Step 6: Offer Declaration",
                desc: "Final offers communicated and coordinated with T&P Cell.",
              },
              {
                step: "Step 7: Joining & Follow-Up",
                desc: "Support for onboarding and transition to industry.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-8 text-gray-900 shadow-lg"
              >
                <h3 className="text-xl font-semibold">{item.step}</h3>
                <p className="mt-3 text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="mt-24 rounded-xl bg-white p-10 text-gray-900 shadow-lg">
          <h3 className="text-2xl font-semibold">Commitment to Recruiters</h3>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            The Training & Placement Cell is committed to long-term partnerships
            with recruiting organizations, ensuring smooth coordination,
            professional conduct, and a positive recruitment experience.
          </p>
        </div>
      </div>
    </section>
  );
}
