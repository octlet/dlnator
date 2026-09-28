-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "canonical_url" TEXT,
    "source_key" TEXT,
    "title" TEXT,
    "extractor" TEXT,
    "uploader" TEXT,
    "duration" INTEGER,
    "thumbnail" TEXT,
    "webpage_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'metadata',
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "mode" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "media_kind" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "job_id" INTEGER NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "default_format" TEXT NOT NULL DEFAULT 'video-mp4',

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jobs_source_key_key" ON "jobs"("source_key");

-- CreateIndex
CREATE UNIQUE INDEX "files_job_id_mode_key" ON "files"("job_id", "mode");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
