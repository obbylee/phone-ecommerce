import { PrismaClient } from "./generated/prisma-client-js/client";
import { Products, type ProductType } from "./data/products";
import { Categories, type CategoryType } from "./data/category";

const prisma = new PrismaClient();

async function main() {
  console.log("--- Starting Database Seeding ---");

  console.log("Seeding Product Categories...");
  await prisma.$transaction(
    Categories.map((category: CategoryType) =>
      prisma.productCategory.upsert({
        where: { id: category.id },
        update: {
          name: category.name,
          slug: category.slug,
          description: category.description,
        },
        create: category,
      })
    )
  );
  console.log("Product Categories seeded successfully!");

  console.log("Seeding Products...");
  await prisma.$transaction(
    Products.map((product: ProductType) =>
      prisma.product.upsert({
        where: { sku: product.sku }, // Using SKU as the unique identifier for products
        update: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          stockQuantity: product.stockQuantity,
          minimumOrderQuantity: product.minimumOrderQuantity,
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          categoryId: product.categoryId, // Ensure categoryId is updated if product data changes
        },
        create: product,
      })
    )
  );
  console.log("Products seeded successfully!");

  console.log("--- Database Seeding Finished---");
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
