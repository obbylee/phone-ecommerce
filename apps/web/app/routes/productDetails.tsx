import type { Route } from "./+types/productDetails";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { CheckCircle, Heart, MessageCircle, Recycle } from "lucide-react";
import { trpcClient } from "~/utils/trpc";
import { toast } from "sonner";
import { formatCurrency } from "~/utils/formatCurrency";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";

type CartFormValues = {
  minOrder: number;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Product details - Aliphone" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  try {
    const response = await trpcClient.product.bySlug.query(params.slug);
    return { product: response };
  } catch (error) {
    if (error instanceof Error) {
      toast.error("Error fetching products");
    } else {
      toast.error("An unknown error occurred while fetching products");
    }
    return {};
  }
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;

  const form = useForm<CartFormValues>({
    defaultValues: {
      minOrder: product?.minimumOrderQuantity ?? 1,
    },
    mode: "onChange", // Or "onBlur", helps revalidate
  });

  async function onSubmit(values: CartFormValues) {
    if (!product || !product.id) {
      toast.error("Product data is not available. Please try again.");
      return; // Exit the function early
    }

    try {
      const result = await trpcClient.cart.addToCart.mutate({
        productId: product.id,
        quantity: values.minOrder,
      });

      toast.success(result.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Internal server error");
      return;
    }
  }

  if (!product || !Object.keys(product).length)
    return <h3 className="text-lg"> No product available.</h3>;

  return (
    <main className="w-full">
      <section className="mx-auto max-w-[1200px] p-4 grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="flel flex-col md:grid md:grid-cols-12 border p-2 gap-2 rounded-md h-[300px] md:h-[400px]">
          <div className="hidden md:flex md:flex-col gap-4 md:col-span-2 items-center">
            <div className="bg-gray-100 dark:bg-gray-500 rounded-md h-20 w-20 overflow-hidden">
              <img
                alt={product?.name}
                src={product?.imageUrl || ""}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="bg-gray-100 dark:bg-gray-500 rounded-md h-20 w-20" />

            <div className="bg-gray-100 dark:bg-gray-500 rounded-md h-20 w-20" />
          </div>

          <div className="bg-gray-100 dark:bg-gray-500 rounded-md h-[280px] md:h-[380px] md:col-span-10 overflow-hidden">
            <img
              alt={product?.name}
              src={product?.imageUrl || ""}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-h-[400px]"
          >
            <h1 className="text-lg md:text-2xl">{product?.slug}</h1>
            <h2 className="text-sm md:text-lg my-4 bg-gray-100 dark:bg-gray-500 px-2.5 py-2 rounded-sm">
              {product?.name}
            </h2>

            <h1 className="text-lg md:text-3xl mb-4">
              {formatCurrency(parseFloat(product.price))}
            </h1>
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-4">
              <div className="flex gap-4">
                <Label className="text-sm md:text-md">
                  Stock quantity: {product.stockQuantity}
                </Label>
                <Label className="text-sm md:text-md">
                  Min Order. {product.minimumOrderQuantity} Pieces
                </Label>
              </div>

              <FormField
                control={form.control}
                name="minOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={`Minimum ${
                          product.minimumOrderQuantity ?? 1
                        } orders`}
                        {...form.register("minOrder", {
                          required: "Order quantity is required.",
                          min: {
                            value: product.minimumOrderQuantity ?? 1,
                            message: `Order must be at least ${
                              product.minimumOrderQuantity ?? 1
                            } orders.`,
                          },

                          max: {
                            value: product.stockQuantity ?? 9999,
                            message: `Order cannot exceed available stock of ${
                              product.stockQuantity ?? 9999
                            } orders.`,
                          },
                          valueAsNumber: true, // <--- IMPORTANT: Converts input string to number
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Button
                className="w-full py-5 text-md md:text-lg"
                size="lg"
                disabled={true}
              >
                Buy this item
              </Button>
              <Button
                type="submit"
                className="w-full py-5 text-md md:text-lg"
                variant="outline"
                size="lg"
              >
                Add to cart
              </Button>
            </div>

            <div className="flex justify-around items-center p-2">
              <h4 className="flex gap-2 justify-center items-center text-sm">
                <MessageCircle size={15} />
                <span>Chat</span>
              </h4>
              <h4 className="flex gap-2 justify-center items-center text-sm">
                <Heart size={15} />
                <span>Whislist</span>
              </h4>
              <h4 className="flex gap-2 justify-center items-center text-sm">
                <Recycle size={15} />
                <span> Share</span>
              </h4>
            </div>
          </form>
        </Form>
      </section>

      <section className="mx-auto max-w-[1200px] px-4">
        <div className="border rounded-md p-4 flex flex-col">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="bg-gray-100 rounded-full h-15 w-15">
                <Avatar className="w-full h-full">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>IM</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col justify-center items-start">
                <div className="self-start flex gap-2 justify-center items-center">
                  <Label>Super Chad Mall</Label>
                  <CheckCircle size={15} />
                </div>
                <div className="flex flex-col md:flex-row md:gap-4 mt-2">
                  <span className="text-xs">Jakarta, Indonesia</span>
                  <span className="text-xs">Transaction success: 98%</span>
                </div>
              </div>
            </div>

            <Button className="outline hidden md:block">Visit store</Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] p-4">
        <Tabs defaultValue="description" className="w-full">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="min-h-[200px] p-4 border">
            {product.description}
          </TabsContent>
          <TabsContent value="reviews" className="min-h-[400px] p-4 border">
            Change your password here.
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
