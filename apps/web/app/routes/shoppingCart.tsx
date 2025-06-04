import { toast } from "sonner";
import type { Route } from "./+types/shoppingCart";
import { trpcClient } from "~/utils/trpc";

interface CartProduct {
  id: string;
  name: string;
  sku: string;
  price: string;
  imageUrl?: string | null;
  stockQuantity: number;
  minimumOrderQuantity: number;
}

interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  product: CartProduct;
}

interface UserCartData {
  id: string | null;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

interface CartLoaderData {
  cart: UserCartData | { items: [] }; // Explicitly state the type of `cart`
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shopping Cart - Aliphone" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({
  params,
}: Route.LoaderArgs): Promise<CartLoaderData> {
  try {
    const result = await trpcClient.cart.getCart.query();
    return { cart: result };
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    }
    return { cart: { items: [] } };
  }
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { cart } = loaderData;
  return (
    <section className="mx-auto max-w-[1200px] grid grid-cols-1 gap-4 p-4">
      <h3 className="text-lg">My Cart</h3>

      {cart.items.length > 0 &&
        cart.items.map((data, i) => (
          <div key={i} className="border rounded-md p-4 flex gap-4">
            <div className="h-20 w-20 bg-gray-100">
              <img
                alt={data.product.name}
                src={data.product.imageUrl || ""}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1>{data.product.name}</h1>
              <p>price: {data.product.price}</p>
              <p>Qty: {data.quantity}</p>
            </div>
          </div>
        ))}
    </section>
  );
}
