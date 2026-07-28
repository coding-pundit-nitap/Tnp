"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const row1 = [
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749454143/WhatsApp_Image_2025-06-09_at_12.41.57_e9f6132c_y7sc6r.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749453285/IMG-20250609-WA0026_pd8lea.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749408887/WhatsApp_Image_2025-06-08_at_22.55.45_bc6132ae_irjka7.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749453630/IMG-20250609-WA0027_zlryr8.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749454062/WhatsApp_Image_2025-06-09_at_12.41.29_fe8073b1_wynhkg.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749453720/IMG-20250609-WA0021_msrcdq.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749454675/WhatsApp_Image_2025-06-09_at_13.07.33_b98a3ef7_axgwpe.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749325476/Screenshot_2025-06-08_011326_iejj4g.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749453957/WhatsApp_Image_2025-06-09_at_12.53.45_9be6b927_zskqa8.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749402526/WhatsApp_Image_2025-06-08_at_22.30.04_6f86bb08_jpxxd2.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749402577/IMG-20250608-WA0031_a1z4vu.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749402602/IMG-20250608-WA0029_p8msjg.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749402601/IMG-20250608-WA0032_aga1u7.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749402602/IMG-20250608-WA0023_pskjec.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749403291/WhatsApp_Image_2025-06-08_at_22.49.18_a8e02dd4_e3z7dx.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749402602/IMG-20250608-WA0024_x7ilhh.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749402602/IMG-20250608-WA0026_helu6c.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749402602/IMG-20250608-WA0025_burqhv.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749402603/IMG-20250608-WA0027_bnma89.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749402604/IMG-20250608-WA0028_ux8itm.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749403213/WhatsApp_Image_2025-06-08_at_22.38.27_b1058379_jtkspi.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749403336/WhatsApp_Image_2025-06-08_at_22.39.54_babe3a52_ytqeld.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749403392/WhatsApp_Image_2025-06-08_at_22.39.53_622c9622_kulqqh.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749403702/IMG-20250608-WA0036_qxcfyb.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749403703/IMG-20250608-WA0037_abn3jj.jpg",
];

const row2 = [
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749403704/IMG-20250608-WA0038_isno7z.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749403704/IMG-20250608-WA0039_v0kjuv.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749403706/IMG-20250608-WA0041_beodqc.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749403707/IMG-20250608-WA0042_sc3mbm.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749403844/WhatsApp_Image_2025-06-08_at_22.58.25_365e01a8_jxbmlu.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749412524/Screenshot_2025-06-09_012450_rjmdxj.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749412752/Screenshot_2025-06-09_012822_enzn8m.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749412814/Screenshot_2025-06-09_013004_fy2wqi.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749412859/Screenshot_2025-06-09_013050_wadwiy.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749412928/Screenshot_2025-06-09_013133_y8xygo.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749413095/Screenshot_2025-06-09_013342_zmkzyk.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749413137/Screenshot_2025-06-09_013527_zkslol.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749413175/Screenshot_2025-06-09_013606_fylsgz.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749413220/Screenshot_2025-06-09_013650_h8iewq.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749413346/Screenshot_2025-06-09_013859_snrqzy.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749413426/Screenshot_2025-06-09_014018_xcyf6a.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749413465/Screenshot_2025-06-09_014057_sxocpv.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749413535/Screenshot_2025-06-09_014207_xj9nu5.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749413569/Screenshot_2025-06-09_014240_zeaziu.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749452707/IMG-20250609-WA0017_j1bzbs.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749413612/Screenshot_2025-06-09_014320_odlksz.png",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749452788/IMG-20250609-WA0016_uzzaax.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749452819/IMG-20250609-WA0015_vhoge2.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749452871/IMG-20250609-WA0014_wkhbef.jpg",
  "https://res.cloudinary.com/dniihkck2/image/upload/v1749453351/IMG-20250609-WA0023_mmomeu.jpg",
];

function LogoItem({ src, index }: { src: string; index: number }) {
  return (
    <div className="mx-2.5 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white p-2.5 shadow-sm sm:h-24 sm:w-24 sm:mx-3 sm:p-3 md:h-28 md:w-28">
      <img
        src={src}
        alt={`Recruiting company ${index + 1}`}
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

function MarqueeRow({ logos, speed = "40s" }: { logos: string[]; speed?: string }) {
  const doubled = [...logos, ...logos];

  return (
    <div className="marquee-mask relative w-full overflow-hidden py-2">
      <div
        className="flex w-max items-center"
        style={{ animation: `marquee-x ${speed} linear infinite` }}
      >
        {doubled.map((logo, i) => (
          <LogoItem key={i} src={logo} index={i % logos.length} />
        ))}
      </div>
    </div>
  );
}

export default function RecruitersGrid() {
  return (
    <section className="scroll-mt-20 bg-canvas py-20 sm:py-28" id="top-companies">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Our Recruiters"
          title="Top Recruiting Companies 2024-25"
          subtitle="Leading organizations that have recruited our talented students this session."
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mt-14 space-y-4"
      >
        <MarqueeRow logos={row1} speed="45s" />
        <MarqueeRow logos={row2} speed="50s" />
      </motion.div>
    </section>
  );
}
