import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
const router = createRouter();
import controller from "infra/controller";
router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function runMigrations(dryRun) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  const pendingMigrations = await migrationRunner(defaultMigrationOptions);
  await dbClient.end();
  return pendingMigrations;
}

async function getHandler(request, response) {
  const pendingMigrations = await runMigrations(true);
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await runMigrations(false);

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  return response.status(200).json(migratedMigrations);
}
