/*
  Warnings:

  - You are about to drop the column `resume` on the `Student` table. All the data in the column will be lost.
  - Added the required column `contactName` to the `Recruiter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Recruiter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recruiter" ADD COLUMN     "contactName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "resume",
ADD COLUMN     "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resumeUrl" TEXT;
