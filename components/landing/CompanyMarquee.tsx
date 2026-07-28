"use client";

interface Company {
  name: string;
  logo: string;
}

const companies: Company[] = [
  { name: "Microsoft", logo: "microsoft.svg" },
  { name: "TCS", logo: "tcs.svg" },
  { name: "Infosys", logo: "infosys.svg" },
  { name: "Wipro", logo: "wipro.svg" },
  { name: "Accenture", logo: "accenture.svg" },
  { name: "HP", logo: "hp.svg" },
  { name: "HCL", logo: "hcl.svg" },
  { name: "Cognizant", logo: "cognizant.svg" },
  { name: "UKG", logo: "ukg.svg" },
  { name: "Vedanta", logo: "vedanta.svg" },
  { name: "L&T", logo: "lt.svg" },
  { name: "Nexturn", logo: "nexturn.svg" },
];

function LogoItem({ c }: { c: Company }) {
  return (
    <div className="mx-10 flex shrink-0 items-center gap-3">
      <img
        src={`/logos/${c.logo}`}
        alt={`${c.name} logo`}
        loading="lazy"
        className="h-9 w-9 object-contain"
      />
      <span className="font-display text-[24px] font-bold tracking-tight whitespace-nowrap text-ink">
        {c.name}
      </span>
    </div>
  );
}

export default function CompanyMarquee() {
  const loop = [...companies, ...companies];

  return (
    <div className="marquee-mask relative w-full overflow-hidden py-4">
      <div className="marquee-track items-center">
        {loop.map((c, i) => (
          <LogoItem key={`${c.name}-${i}`} c={c} />
        ))}
      </div>
    </div>
  );
}
