import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";
import fs from "fs";
import path from "path";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

test("POST to /api/v1/migrations should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();

  const folderPath = path.join(process.cwd(), "infra/migrations");
  const files = fs.readdirSync(folderPath).sort();
  const sortedResponse1 = response1Body.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();

  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);

  for (let i = 0; i < Math.min(sortedResponse1.length, files.length); i++) {
    const baseName = files[i].split(".")[0];
    expect(sortedResponse1[i].name).toBe(baseName);
    expect(response1Body.length).toBeGreaterThan(0);
  }
});
