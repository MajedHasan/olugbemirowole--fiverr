/*
  Warnings:

  - A unique constraint covering the columns `[policyNo]` on the table `Enrollee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Enrollee_policyNo_key` ON `Enrollee`(`policyNo`);
