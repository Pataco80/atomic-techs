-- CreateTable
CREATE TABLE "ProjectGalleryItem" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectGalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectGalleryItem_projectId_order_idx" ON "ProjectGalleryItem"("projectId", "order");

-- CreateIndex
CREATE INDEX "ProjectGalleryItem_deletedAt_idx" ON "ProjectGalleryItem"("deletedAt");

-- AddForeignKey
ALTER TABLE "ProjectGalleryItem" ADD CONSTRAINT "ProjectGalleryItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
