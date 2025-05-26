import type { Route } from "./+types/product";
import { Form, Link } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { trpcClient } from "~/utils/trpc";
import { formatCurrency } from "~/utils/formatCurrency";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Products - Aliphone" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({ request }: Route.LoaderArgs) {
  const baseUrl = new URL(request.url);
  const searchQuery = baseUrl.searchParams.get("search");
  const minPrice = baseUrl.searchParams.get("minPrice");
  const maxPrice = baseUrl.searchParams.get("maxPrice");
  const minOrder = baseUrl.searchParams.get("minOrder");

  try {
    const payload = {
      key: searchQuery,
      minPrice: parseNumberParam(minPrice),
      maxPrice: parseNumberParam(maxPrice),
      minOrder: parseNumberParam(minOrder),
    };
    const response = await trpcClient.product.list.query(payload);
    return { data: response };
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error fetching products");
    } else {
      toast.error("An unknown error occurred while fetching products");
    }
    return { data: [] };
  }
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData;
  return (
    <div className="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 p-4">
      <aside className="bg-gray-100 dark:bg-black dark:border-gray-500 rounded-md p-6 border md:max-h-[350px] md:sticky md:top-22">
        <h3 className="text-lg font-semibold mb-4">Filter Options</h3>

        <Form action="/product">
          <div className="mb-4">
            <Label className="mb-2">Keywords</Label>
            <div className="flex items-center">
              <Input type="text" name="search" placeholder="keywords" />
            </div>
          </div>

          <div className="mb-4">
            <Label className="mb-2">Price Range:</Label>
            <div className="flex items-center">
              <Input type="number" name="minPrice" min={1} placeholder="min" />
              <span className="text-gray-500">-</span>
              <Input type="number" name="maxPrice" min={1} placeholder="max" />
            </div>
          </div>

          <div className="mb-4">
            <Label className="mb-2">Min. Order</Label>
            <div className="flex items-center">
              <Input
                type="number"
                name="minOrder"
                min={1}
                placeholder="min order"
              />
            </div>
          </div>

          <Button>Apply filters</Button>
        </Form>
      </aside>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data && data.length > 0 ? (
          data.map((product) => (
            <Link key={product.sku} to={`./${product.slug}`} viewTransition>
              <div className="bg-white dark:bg-black min-h-[490px] border border-gray-200 dark:border-gray-500 rounded-md p-4 shadow-sm">
                <div className="bg-gray-100 rounded-md h-64">
                  <img
                    src={product.imageUrl || ""}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-lg md:text-xl truncate my-4">
                  <span>{product.slug}</span>
                  <span className="block">{product.name}</span>
                </h3>
                <h1 className="text-xl">
                  {formatCurrency(parseFloat(product.price))}
                </h1>
                <h2 className="text-lg">
                  Min. order: {product.minimumOrderQuantity} pieces
                </h2>
                <span className="text-sm">
                  Stock Quantity: {product.stockQuantity}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <Button className="flex-1" variant="outline">
                    Check details
                  </Button>
                  <Button className="flex-1" variant="secondary">
                    Add to cart
                  </Button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <h3 className="text-lg"> No product available.</h3>
        )}
      </main>
    </div>
  );
}

const parseNumberParam = (paramName: string | null): number | null => {
  if (paramName === null || paramName.trim() === "") {
    return null; // Parameter not found or empty string, send null
  }
  const parsed = parseFloat(paramName);
  if (isNaN(parsed)) {
    return null; // Not a valid number, send null
  }
  return parsed; // Return the number if valid
};
