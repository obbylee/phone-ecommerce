import { type ColumnDef } from "@tanstack/react-table";

export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  stockQuantity?: string;
  minimumOrderQuantity?: string;
  createdAt: Date;
  updatedAt: Date;
  isFeatured: boolean;
  isActive: boolean;
  categoryId?: string;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "imageUrl",
    header: "Img Url",
  },
  {
    accessorKey: "stockQuantity",
    header: "Stock",
    cell: (info) => info.getValue<number | undefined>() ?? "Out of Stock",
  },
  {
    accessorKey: "minimumOrderQuantity",
    header: "Min Order Qty",
    cell: (info) => info.getValue<number | undefined>() ?? "-",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (info) => {
      const date = info.getValue<Date>();
      const formatted = new Date(date);
      return formatted.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: (info) => {
      const date = info.getValue<Date>();
      const formatted = new Date(date);
      return formatted.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: (info) => (info.getValue<boolean>() ? "Yes" : "No"),
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: (info) => (info.getValue<boolean>() ? "Yes" : "No"),
  },
  {
    accessorKey: "categoryId",
    header: "Category",
    // 'cell' receives info object where 'info.getValue()' is the value of 'category'
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (info) => <span>-</span>,
  },
];
