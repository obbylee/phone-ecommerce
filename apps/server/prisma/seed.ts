import { PrismaClient } from "./generated/prisma-client-js/client";
import { Products } from "./data/products";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: Products,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding error :", e);
    await prisma.$disconnect();
    process.exit(1);
  });
