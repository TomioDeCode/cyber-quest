/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Soal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Soal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Soal" ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Soal_url_key" ON "Soal"("url");
