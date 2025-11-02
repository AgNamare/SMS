-- CreateTable
CREATE TABLE "Enquiry" (
    "id" SERIAL NOT NULL,
    "enquiry_no" TEXT NOT NULL,
    "student_first_name" TEXT NOT NULL,
    "student_middle_name" TEXT,
    "student_last_name" TEXT NOT NULL,
    "guardian_first_name" TEXT NOT NULL,
    "guardian_last_name" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "email" TEXT,
    "academic_year" INTEGER NOT NULL,
    "source_of_enquiry" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "remarks" TEXT,
    "next_follow_up_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "application_no" TEXT NOT NULL,
    "enquiry_id" INTEGER,
    "student_first_name" TEXT NOT NULL,
    "student_middle_name" TEXT,
    "student_last_name" TEXT NOT NULL,
    "guardian_first_name" TEXT NOT NULL,
    "guardian_last_name" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "religion" TEXT,
    "previous_school" TEXT,
    "previous_class" TEXT,
    "academic_year" INTEGER NOT NULL,
    "class_applied" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "document" TEXT,
    "application_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admission" (
    "id" SERIAL NOT NULL,
    "admission_no" TEXT NOT NULL,
    "application_id" INTEGER,
    "student_id" INTEGER,
    "admission_date" TIMESTAMP(3) NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "admitted_class" TEXT NOT NULL,
    "batch_id" INTEGER,
    "admission_status" TEXT NOT NULL,
    "fee_structure_id" INTEGER,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "admission_id" INTEGER NOT NULL,
    "subject_id" INTEGER,
    "batch_id" INTEGER,
    "term_id" INTEGER,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "enrollment_status" TEXT NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enquiry_enquiry_no_key" ON "Enquiry"("enquiry_no");

-- CreateIndex
CREATE UNIQUE INDEX "Application_application_no_key" ON "Application"("application_no");

-- CreateIndex
CREATE UNIQUE INDEX "Application_enquiry_id_key" ON "Application"("enquiry_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admission_admission_no_key" ON "Admission"("admission_no");

-- CreateIndex
CREATE UNIQUE INDEX "Admission_application_id_key" ON "Admission"("application_id");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_enquiry_id_fkey" FOREIGN KEY ("enquiry_id") REFERENCES "Enquiry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_admission_id_fkey" FOREIGN KEY ("admission_id") REFERENCES "Admission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
