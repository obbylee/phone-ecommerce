import type { Route } from "./+types/product";
import { Form, Link } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { trpcClient } from "~/utils/trpc";
import { formatCurrency } from "~/utils/formatCurrency";
import { Checkbox } from "~/components/ui/checkbox";

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
  const category = baseUrl.searchParams.getAll("category");

  try {
    const payload = {
      key: searchQuery,
      minPrice: parseNumberParam(minPrice),
      maxPrice: parseNumberParam(maxPrice),
      minOrder: parseNumberParam(minOrder),
      categories: category,
    };
    const products = await trpcClient.product.list.query(payload);
    const categories = await trpcClient.product.categories.query();
    return { products: products, categories: categories };
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
  const { products, categories } = loaderData;
  return (
    <div className="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 p-4">
      <aside className="bg-gray-100 dark:bg-black dark:border-gray-500 rounded-md p-6 border md:max-h-[490px] md:sticky md:top-22">
        <h3 className="text-lg font-semibold mb-4">Filter Options</h3>

        <Form action="/product" autoComplete="off">
          <div className="mb-4">
            <Label className="mb-2">Keywords</Label>
            <div className="flex items-center">
              <Input type="text" name="search" placeholder="keywords" />
            </div>
          </div>

          <div className="mb-4">
            <Label className="mb-2">Categories</Label>
            <div className="flex flex-col items-start gap-3">
              {categories &&
                categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-3">
                    <Checkbox name="category" value={category.id} />
                    <Label className="font-light">{category.name}</Label>
                  </div>
                ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
            <Button type="submit">Apply filters</Button>

            <Button variant="outline" asChild>
              <Link to="/product">Reset filters</Link>
            </Button>
          </div>
        </Form>
      </aside>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products && products.length > 0 ? (
          products.map((product) => (
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
