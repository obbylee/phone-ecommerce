import type { Route } from "./+types/index";
import { type Product, columns } from "./columns";
import { trpcClient } from "~/utils/trpc";
import { DataTable } from "./data-table";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Product - Aliphone" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({ request }: Route.LoaderArgs) {
  const response = await trpcClient.admin.product.list.query();
  return { data: response };
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData;

  const normalizedData: Product[] = data.map((item) => ({
    ...item,
    imageUrl: item.imageUrl ?? undefined,
    stockQuantity: item.stockQuantity?.toString() ?? undefined,
    minimumOrderQuantity: item.minimumOrderQuantity?.toString() ?? undefined,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    categoryId: item.categoryId ?? undefined,
  }));

  return (
    <div>
      <DataTable columns={columns} data={normalizedData} />
    </div>
  );
}
