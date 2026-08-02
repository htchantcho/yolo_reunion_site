-- AlterTable
ALTER TABLE "AlumniRecord" ADD COLUMN     "matriculationNo" TEXT;

-- CreateIndex
CREATE INDEX "AlumniRecord_matriculationNo_idx" ON "AlumniRecord"("matriculationNo");
