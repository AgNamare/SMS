-- CreateTable
CREATE TABLE "school" (
    "id" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "school_logo_url" TEXT,
    "school_motto" TEXT,
    "contact_email" TEXT,
    "contact_phone_number" TEXT,
    "created_at" INTEGER NOT NULL DEFAULT 0,
    "updated_at" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "school_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "branch_name" TEXT NOT NULL,
    "branch_address" TEXT,
    "branch_email" TEXT,
    "branch_phone_number" TEXT,
    "opening_time" INTEGER,
    "closing_time" INTEGER,
    "created_at" INTEGER NOT NULL DEFAULT 0,
    "updated_at" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "branch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "branch" ADD CONSTRAINT "branch_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
