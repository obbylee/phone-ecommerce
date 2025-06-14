import type { Route } from "./+types/index";
import { type Product, columns } from "./columns";
import { trpcClient } from "~/utils/trpc";
import { DataTable } from "./data-table";
import { type CreateProductFormValues, ManageProduct } from "./manage-product";

import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Product - Aliphone" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader() {
  const products = await trpcClient.admin.product.list.query();
  const categories = await trpcClient.product.categories.query();
  return { data: products, categoryJSON: categories };
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { data, categoryJSON } = loaderData;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<CreateProductFormValues | null>(null);

  const normalizedData: Product[] = data.map((item) => ({
    ...item,
    imageUrl: item.imageUrl ?? undefined,
    stockQuantity: item.stockQuantity?.toString() ?? undefined,
    minimumOrderQuantity: item.minimumOrderQuantity?.toString() ?? undefined,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    categoryId: item.categoryId ?? undefined,
  }));

  const handleEditProduct = (product: CreateProductFormValues) => {
    // Map the fetched Product data to the form's expected input type
    const formData: CreateProductFormValues = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      slug: product.slug,
      description: product.description ?? "",
      price: product.price,
      imageUrl: product.imageUrl ?? "",
      stockQuantity: product.stockQuantity ?? 0,
      minimumOrderQuantity: product.minimumOrderQuantity ?? 1,
      categoryId: product.categoryId ?? undefined,
    };
    setSelectedProduct(formData);
    setIsDialogOpen(true);
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleFormCancel = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="py-6">
      <div className="mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateProduct}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>

          <ManageProduct
            initialData={selectedProduct}
            categories={categoryJSON}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={normalizedData}
        tableOptions={{
          meta: {
            onEdit: handleEditProduct, // This is the function called by the Action button
          },
        }}
      />
    </div>
  );
}
