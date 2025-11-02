// src/lib/permissions/syncPermissions.ts
import "reflect-metadata";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { prisma } from "../app/lib/prisma";

const modulesDir = path.join(process.cwd(), "src/modules");
console.log("🔍 Scanning modules in:", modulesDir);

export async function syncPermissions() {
  console.log("🔍 Starting permission sync...");

  if (!fs.existsSync(modulesDir)) {
    console.error("❌ Modules directory not found:", modulesDir);
    return;
  }

  const modules = fs.readdirSync(modulesDir);
  console.log("📦 Found modules:", modules);
  for (const moduleName of modules) {
    const servicesDir = path.join(modulesDir, moduleName, "services");
    console.log(servicesDir);
    if (!fs.existsSync(servicesDir)) continue;
    console.log("🔍 Scanning modules in:", modulesDir);
    console.log("📂 Found modules:", modules);

    const serviceFiles = fs
      .readdirSync(servicesDir)
      .filter((f) => f.endsWith(".ts"));

    for (const file of serviceFiles) {
      const servicePath = path.join(servicesDir, file);
      const serviceModule = await import(servicePath);

      // Loop over all exported classes
      for (const exportedItem of Object.values(serviceModule)) {
        if (typeof exportedItem !== "function") continue;

        const prototype = exportedItem.prototype;
        const methodNames = Object.getOwnPropertyNames(prototype).filter(
          (m) => m !== "constructor"
        );

        for (const methodName of methodNames) {
          const metadata = Reflect.getMetadata(
            "permission",
            prototype,
            methodName
          );

          console.log(metadata);

          if (metadata) {
            console.log("🎯 Found permission metadata:", metadata);
            const { module, action } = metadata;

            const name = `${module}:${action}`;
            const description = `${action} action in ${module}`;

            await prisma.permission.upsert({
              where: { name },
              update: { module, description },
              create: { name, module, description },
            });

            console.log(`✅ Synced permission: ${name}`);
          }
        }
      }
    }
  }

  console.log("🎯 Permission sync complete");
}
// Run the function when script is executed directly
syncPermissions()
  .then(() => {
    console.log("✅ Done syncing permissions.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error syncing permissions:", err);
    process.exit(1);
  });
