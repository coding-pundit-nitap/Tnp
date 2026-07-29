import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_PASSWORD = "admin@123";
const STUDENT_PASSWORD = "student@123";
const RECRUITER_PASSWORD = "recruiter@123";

async function main() {
  console.log("🌱 Seeding database...");

  // Admin
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nitap.ac.in" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@nitap.ac.in",
      emailVerified: true,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  await prisma.account.upsert({
    where: { id: `${admin.id}-credential` },
    update: { password: adminHash },
    create: {
      id: `${admin.id}-credential`,
      userId: admin.id,
      accountId: admin.id,
      providerId: "credential",
      password: adminHash,
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Student
  const studentHash = await bcrypt.hash(STUDENT_PASSWORD, 10);
  const student = await prisma.user.upsert({
    where: { email: "student@nitap.ac.in" },
    update: {},
    create: {
      name: "John Doe",
      email: "student@nitap.ac.in",
      emailVerified: true,
      role: "STUDENT",
      status: "ACTIVE",
    },
  });
  await prisma.account.upsert({
    where: { id: `${student.id}-credential` },
    update: { password: studentHash },
    create: {
      id: `${student.id}-credential`,
      userId: student.id,
      accountId: student.id,
      providerId: "credential",
      password: studentHash,
    },
  });
  // Create student profile
  await prisma.student.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      branch: "CSE",
      year: 3,
      cgpa: 8.5,
    },
  });
  console.log("✅ Student user created:", student.email);

  // Recruiter
  const recruiterHash = await bcrypt.hash(RECRUITER_PASSWORD, 10);
  const recruiter = await prisma.user.upsert({
    where: { email: "recruiter@nitap.ac.in" },
    update: {},
    create: {
      name: "Jane Smith",
      email: "recruiter@nitap.ac.in",
      emailVerified: true,
      role: "RECRUITER",
      status: "ACTIVE",
    },
  });
  await prisma.account.upsert({
    where: { id: `${recruiter.id}-credential` },
    update: { password: recruiterHash },
    create: {
      id: `${recruiter.id}-credential`,
      userId: recruiter.id,
      accountId: recruiter.id,
      providerId: "credential",
      password: recruiterHash,
    },
  });
  await prisma.recruiter.upsert({
    where: { userId: recruiter.id },
    update: {},
    create: {
      userId: recruiter.id,
      company: "TCS",
      contactName: "Jane Smith",
      phone: "9876543210",
      approved: true,
    },
  });
  console.log("✅ Recruiter user created:", recruiter.email);

  console.log("\n📝 Test Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin:     admin@nitap.ac.in / admin@123");
  console.log("Student:   student@nitap.ac.in / student@123");
  console.log("Recruiter: recruiter@nitap.ac.in / recruiter@123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
