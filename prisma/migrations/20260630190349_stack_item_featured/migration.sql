-- DropIndex
DROP INDEX "StackItem_order_idx";

-- AlterTable
ALTER TABLE "StackItem" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "StackItem_featured_order_idx" ON "StackItem"("featured", "order");
