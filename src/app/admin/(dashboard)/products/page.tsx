import { getAllProducts, getAllCategories } from "@/actions/adminData";
import ProductsTableClient from "@/components/admin/ProductsTableClient";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  return (
    <ProductsTableClient products={products} categories={categories} />
  );
}
