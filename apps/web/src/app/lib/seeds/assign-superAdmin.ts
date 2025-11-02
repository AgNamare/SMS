import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in an ES module context for reliable path calculation.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file variables into process.env before Prisma is initialized
// We explicitly resolve the path to the project root (4 levels up from the seed directory)
const ENV_PATH = path.resolve(__dirname, "../../../../.env");
dotenv.config({ path: ENV_PATH });

import { nowTimestamp } from "../../../lib/utils/time.ts";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const SUPER_ADMIN_EMAIL = "super@system.com";
const SUPER_ADMIN_FIRSTNAME = "System";
const SUPER_ADMIN_LASTNAME = "Super Admin";
const SALT_ROUNDS = 10;
const PEPPER = process.env.PASSWORD_PEPPER || "";
const prisma = new PrismaClient();

function generateStrongPassword(length = 16) {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
}

// FIX: Removed top-level await for superAdminRole and moved it into the function
// to prevent the ERR_REQUIRE_CYCLE_MODULE during module initialization.

export async function seedSuperAdmin() {
  try {
    // 1️⃣ Ensure SUPER_ADMIN role exists (Moved role creation here)
    const superAdminRole = await prisma.role.upsert({
      where: { name: "SUPER_ADMIN" },
      update: {},
      create: {
        name: "SUPER_ADMIN",
        isSystemRole: true,
      },
    });

    console.log("✅ SUPER_ADMIN role initialized");

    // 2️⃣ Generate strong random password + hash
    const password = process.env.SUPER_ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(password + PEPPER, SALT_ROUNDS);

    // 3️⃣ Ensure Super Admin user exists
    const superAdminUser = await prisma.user.upsert({
      where: { email: SUPER_ADMIN_EMAIL },
      update: { password: hashedPassword },
      create: {
        first_name: SUPER_ADMIN_FIRSTNAME,
        last_name: SUPER_ADMIN_LASTNAME,
        profile_photo:
          "https://img.favpng.com/10/14/2/avatar-computer-icons-user-profile-business-png-favpng-uVq05zLDgFqFDHD2EF87qrVMA.jpg",
        email: SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        createdAt: nowTimestamp(),
        updatedAt: nowTimestamp(),
      },
    });

    console.log("✅ Super Admin user initialized");

    // 4️⃣ Assign SUPER_ADMIN role to the user
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: superAdminUser.id,
          roleId: superAdminRole.id, // Use the role ID created within the function
        },
      },
      update: {},
      create: { userId: superAdminUser.id, roleId: superAdminRole.id },
    });

    console.log(`✅ ${SUPER_ADMIN_EMAIL} assigned as SUPER_ADMIN`);

    // 5️⃣ Console log the temporary password for dev/testing
    console.log(
      "🛡️ Super Admin temporary password (development only):",
      password
    );
    console.log("⚠️ Make sure to change it immediately after first login!");

    console.log("🎉 Seeding complete!");
  } catch (err) {
    console.error("❌ Failed to seed Super Admin:", err);
  } finally {
    await prisma.$disconnect();
  }
}

// FIX: Only run seedSuperAdmin() when this file is executed directly (not when imported)
// This uses a reliable check for ES Modules being run as the main script.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedSuperAdmin();
}
