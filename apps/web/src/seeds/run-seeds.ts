// src/seeds/run-seeds.ts
import path from "path";

async function main() {
  const { seedSuperAdmin } = await import(path.resolve("./src/seeds/assign-superAdmin.ts"));
  await seedSuperAdmin();

  const { syncPermissions } = await import(path.resolve("./src/seeds/sync-permissions.ts"));
  await syncPermissions();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
