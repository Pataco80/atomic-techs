-- CreateTable
CREATE TABLE "CareerEventStack" (
    "id" TEXT NOT NULL,
    "careerEventId" TEXT NOT NULL,
    "stackItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerEventStack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CareerEventStack_stackItemId_idx" ON "CareerEventStack"("stackItemId");

-- CreateIndex
CREATE UNIQUE INDEX "CareerEventStack_careerEventId_stackItemId_key" ON "CareerEventStack"("careerEventId", "stackItemId");

-- AddForeignKey
ALTER TABLE "CareerEventStack" ADD CONSTRAINT "CareerEventStack_careerEventId_fkey" FOREIGN KEY ("careerEventId") REFERENCES "CareerEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerEventStack" ADD CONSTRAINT "CareerEventStack_stackItemId_fkey" FOREIGN KEY ("stackItemId") REFERENCES "StackItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
