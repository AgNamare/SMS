// src/app/lib/seeds/assign-superAdmin.ts
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedSuperAdmin() {
  // Lazy-load everything that could cause a cycle
  const dotenv = await import("dotenv");
  const crypto = await import("crypto");
  const bcrypt = await import("bcryptjs");
  const { PrismaClient } = await import("@prisma/client");
  const { nowTimestamp } = await import("../../../lib/utils/time.ts");

  // Load environment variables
  const ENV_PATH = path.resolve(__dirname, "../../../../.env");
  dotenv.config({ path: ENV_PATH });

  const SUPER_ADMIN_EMAIL = "super@system.com";
  const SUPER_ADMIN_FIRSTNAME = "System";
  const SUPER_ADMIN_LASTNAME = "Super Admin";
  const SALT_ROUNDS = 10;
  const PEPPER = process.env.PASSWORD_PEPPER || "";
  const prisma = new PrismaClient();

  function generateStrongPassword(length = 16) {
    return crypto.randomBytes(length).toString("base64").slice(0, length);
  }

  try {
    // 1️⃣ Ensure SUPER_ADMIN role exists
    const superAdminRole = await prisma.role.upsert({
      where: { name: "SUPER_ADMIN" },
      update: {},
      create: { name: "SUPER_ADMIN", isSystemRole: true },
    });

    console.log("✅ SUPER_ADMIN role initialized");

    // 2️⃣ Generate password and hash
    const password =
      process.env.SUPER_ADMIN_PASSWORD || generateStrongPassword();
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
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: { userId: superAdminUser.id, roleId: superAdminRole.id },
    });

    console.log(`✅ ${SUPER_ADMIN_EMAIL} assigned as SUPER_ADMIN`);
    console.log("🛡️ Temporary password (development only):", password);
  } catch (err) {
    console.error("❌ Failed to seed Super Admin:", err);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedSuperAdmin();
}
