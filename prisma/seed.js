import { prisma } from "../src/config/database.js";

import generateUser from "../src/static/json/User_Seed.js";

async function Migrate() {
  const admin = await generateUser();
  await prisma.user.create({ data: admin[0] });
}

Migrate()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
  });
