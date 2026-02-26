/*
  Warnings:

  - You are about to drop the column `slud` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_slud_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "slud",
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
