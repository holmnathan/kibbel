/*
  Warnings:

  - The primary key for the `Pet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `dietTypeId` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mealPlanId` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_pkey",
ADD COLUMN     "dietTypeId" INTEGER NOT NULL,
ADD COLUMN     "mealPlanId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Pet_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Pet_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "Weight" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valueInKilograms" DOUBLE PRECISION NOT NULL,
    "petId" TEXT NOT NULL,

    CONSTRAINT "Weight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DietType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietRestriction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DietRestriction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "kilogramCalories" INTEGER NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Serving" (
    "id" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "sizeInGrams" INTEGER NOT NULL,
    "mealId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,

    CONSTRAINT "Serving_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "mealPlanId" TEXT NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FoodToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DietRestrictionToPet" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DietRestrictionToFood" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FoodToUser_AB_unique" ON "_FoodToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FoodToUser_B_index" ON "_FoodToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DietRestrictionToPet_AB_unique" ON "_DietRestrictionToPet"("A", "B");

-- CreateIndex
CREATE INDEX "_DietRestrictionToPet_B_index" ON "_DietRestrictionToPet"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DietRestrictionToFood_AB_unique" ON "_DietRestrictionToFood"("A", "B");

-- CreateIndex
CREATE INDEX "_DietRestrictionToFood_B_index" ON "_DietRestrictionToFood"("B");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_dietTypeId_fkey" FOREIGN KEY ("dietTypeId") REFERENCES "DietType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weight" ADD CONSTRAINT "Weight_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Serving" ADD CONSTRAINT "Serving_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Serving" ADD CONSTRAINT "Serving_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToUser" ADD FOREIGN KEY ("A") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DietRestrictionToPet" ADD FOREIGN KEY ("A") REFERENCES "DietRestriction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DietRestrictionToPet" ADD FOREIGN KEY ("B") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DietRestrictionToFood" ADD FOREIGN KEY ("A") REFERENCES "DietRestriction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DietRestrictionToFood" ADD FOREIGN KEY ("B") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;
