import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define passwords as constants
const ADMIN_PASSWORD = "admin@123";
const STUDENT_PASSWORD = "student@123";
const RECRUITER_PASSWORD = "recruiter@123";

async function main() {
  console.log("🌱 Seeding database...");

  // Create Admin User
  const adminPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nitap.ac.in" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@nitap.ac.in",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create Test Student
  const studentPassword = await bcrypt.hash(STUDENT_PASSWORD, 10);
  const student = await prisma.user.upsert({
    where: { email: "student@nitap.ac.in" },
    update: {},
    create: {
      name: "John Doe",
      email: "student@nitap.ac.in",
      password: studentPassword,
      role: "STUDENT",
      student: {
        create: {
          branch: "CSE",
          year: 3,
          cgpa: 8.5,
        },
      },
    },
  });
  console.log("✅ Student user created:", student.email);

  // Create Test Recruiter (Approved)
  const recruiterPassword = await bcrypt.hash(RECRUITER_PASSWORD, 10);
  const recruiter = await prisma.user.upsert({
    where: { email: "recruiter@nitap.ac.in" },
    update: {},
    create: {
      name: "Jane Smith",
      email: "recruiter@nitap.ac.in",
      password: recruiterPassword,
      role: "RECRUITER",
      recruiter: {
        create: {
          company: "TCS",
          contactName: "Jane Smith",
          phone: "9876543210",
          approved: true,
        },
      },
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
