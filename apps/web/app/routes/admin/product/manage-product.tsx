import { useEffect, useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { trpcClient } from "~/utils/trpc";

const ProductSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters.")
    .max(100, "Product name cannot exceed 100 characters."),
  sku: z
    .string()
    .min(3, "SKU must be at least 3 characters.")
    .max(50, "SKU cannot exceed 50 characters.")
    .toUpperCase(),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .max(150, "Slug cannot exceed 150 characters."), // Add this
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(1000, "Description cannot exceed 1000 characters.")
    .or(z.literal("")),
  price: z.number().positive("Price must be a positive number."),
  imageUrl: z.string().url("Must be a valid URL."),
  stockQuantity: z.number().int().min(0, "Stock quantity cannot be negative."),
  minimumOrderQuantity: z
    .number()
    .int()
    .min(1, "Minimum order quantity must be at least 1."),
  categoryId: z.string().min(1, "Category cannot be empty."),
});

export type CreateProductFormValues = z.infer<typeof ProductSchema>;

interface ManageProductFormProps {
  initialData?: CreateProductFormValues | null; // Product data for editing, or null for creation
  categories: {
    name: string;
    slug: string;
    description: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
  }[]; // Array of categories for the dropdown
  onSuccess: () => void; // Callback after successful form submission
  onCancel: () => void; // Callback for dialog close via cancel button
}

export function ManageProduct({
  initialData,
  categories,
  onSuccess,
  onCancel,
}: ManageProductFormProps) {
  const isEditing = !!initialData?.id;
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: initialData || {
      name: "",
      sku: "",
      slug: "",
      description: "",
      price: 0,
      imageUrl: "",
      stockQuantity: 0,
      minimumOrderQuantity: 1,
      categoryId: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id,
        name: initialData.name,
        sku: initialData.sku,
        slug: initialData.slug,
        description: initialData.description ?? "",
        price: Number(initialData.price),
        imageUrl: initialData.imageUrl ?? "",
        stockQuantity: Number(initialData.stockQuantity) ?? 0,
        minimumOrderQuantity: Number(initialData.minimumOrderQuantity) ?? 1,
        categoryId: initialData.categoryId ?? "",
      });
    } else {
      // Reset to empty values for a new product
      form.reset({
        name: "",
        sku: "",
        slug: "",
        description: "",
        price: 0,
        imageUrl: "",
        stockQuantity: 0,
        minimumOrderQuantity: 1,
        categoryId: "",
      });
    }
  }, [initialData, form.reset]);

  const onSubmit = async (data: CreateProductFormValues) => {
    try {
      setIsCreatingProduct(true);

      await trpcClient.product.create.mutate({ ...data });

      onSuccess();

      toast.info(`product updated!`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`An error eccured: ${error.message}`);
        return;
      }
      toast.error("Internal server error");
    } finally {
      setIsCreatingProduct(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Product" : "Create New Product"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Make changes to this product's details."
            : "Fill in the details below to add a new product to your inventory."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sku</FormLabel>
                <FormControl>
                  <Input placeholder="Enter sku" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Enter slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories &&
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the product"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01" // Allow decimal for price
                      placeholder="Enter price"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      } // Ensure number type
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter stock quantity"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))} // Ensure integer type
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumOrderQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min. Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter minimum order quantity"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))} // Ensure integer type
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="Enter image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                disabled={isCreatingProduct}
                onClick={() => onCancel()}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isCreatingProduct}>
              {isCreatingProduct ? "Updating..." : "Save product"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
