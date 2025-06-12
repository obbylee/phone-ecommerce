import type { Route } from "./+types/shoppingCart";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { toast } from "sonner";
import { trpcClient } from "~/utils/trpc";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { Minus, Plus, X } from "lucide-react";
import { formatCurrency } from "~/utils/formatCurrency";
import { Link } from "react-router";

// Schema for a single item in the cart
const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive({ message: "Price must be positive." }),
  quantity: z
    .number()
    .int()
    .min(1, { message: "Quantity must be at least 1." }),
  imageUrl: z.string().url().optional().nullable(),
});

// Schema for the entire cart form (an array of cart items)
const CartFormSchema = z.object({
  cartItems: z.array(CartItemSchema),
});

type CartFormValues = z.infer<typeof CartFormSchema>;

interface CartLoaderData {
  cartItemsForForm: z.infer<typeof CartItemSchema>[];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shopping Cart - Aliphone" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader(): Promise<CartLoaderData> {
  try {
    const result = await trpcClient.cart.getCart.query();

    const cartItemsForForm = (result.items || []).reduce<
      z.infer<typeof CartItemSchema>[]
    >((res, curr) => {
      const parsedPrice = parseFloat(curr.product.price);
      const price = isNaN(parsedPrice) ? 0 : parsedPrice; // Default to 0 or handle error
      return [
        ...res,
        {
          id: curr.id,
          name: curr.product.name,
          price: price,
          quantity: curr.quantity,
          imageUrl: curr.product.imageUrl,
        },
      ];
    }, []);

    return { cartItemsForForm: cartItemsForForm };
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    }
    return { cartItemsForForm: [] };
  }
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { cartItemsForForm } = loaderData;

  const {
    watch: formWatch,
    control: formControl,
    register: formRegister,
    setValue: formSetValue,
    getValues: formGetValues,
    handleSubmit: formSubmit,
    formState: { errors: formErrors },
  } = useForm<CartFormValues>({
    resolver: zodResolver(CartFormSchema),
    defaultValues: {
      cartItems: cartItemsForForm,
    },
    mode: "onChange", // Validate on change for immediate feedback
  });

  const { fields, remove } = useFieldArray({
    control: formControl,
    name: "cartItems",
  });

  // Use watch to get the current values of cart items for calculations
  const currentCartItems = formWatch("cartItems");

  const updateItemQuantity = (index: number, delta: number) => {
    const currentItem = currentCartItems[index];
    if (!currentItem) return; // Guard against non-existent item

    const newQuantity = currentItem.quantity + delta;

    const clampedQuantity = Math.max(1, newQuantity);

    formSetValue(`cartItems.${index}.quantity`, clampedQuantity);
  };

  // --- Calculations for Order Summary ---
  const calculateSubtotal = () => {
    return currentCartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const shippingCost = 15.0; // fixed shipping cost
  const taxRate = 0.05; // 5% tax rate

  const subtotal = calculateSubtotal();
  const taxAmount = subtotal * taxRate;
  const total = subtotal + shippingCost + taxAmount;

  return (
    <section className="mx-auto max-w-[1200px] grid grid-cols-1 gap-4 p-4">
      <h3 className="text-lg">Shopping Cart</h3>

      {cartItemsForForm.length === 0 || fields.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground mb-6">
            Your cart is currently empty.
          </p>
          <Button size="lg" asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow flex flex-col gap-4 md:w-2/3">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
                <div className="flex items-center gap-4">
                  <img
                    src={field.imageUrl || ""}
                    alt={field.name}
                    className="w-20 h-20 object-contain rounded-md border border-border flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <CardTitle className="text-lg font-semibold mb-1">
                      {field.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-2">
                      Price: {formatCurrency(field.price)}/unit
                    </CardDescription>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateItemQuantity(index, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <Input
                          type="number"
                          className="w-14 text-center h-7"
                          readOnly
                          {...formRegister(`cartItems.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                        />

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateItemQuantity(index, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(
                          currentCartItems[index].price *
                            currentCartItems[index].quantity
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="md:w-1/3">
            <Card className="p-6 md:sticky md:top-4">
              <CardTitle className="mb-4">Order Summary</CardTitle>
              <div className="space-y-3 text-muted-foreground text-base">
                <div className="flex justify-between">
                  <span>Products Subtotal:</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes ({taxRate * 100}%):</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-xl text-foreground pt-4 border-t border-border mt-4">
                  <span>Order Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-8">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => toast.info("Proceed to Checkout!")}
                >
                  Proceed to Checkout
                </Button>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}
