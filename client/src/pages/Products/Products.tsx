import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FilterSlider from "@/components/Home/Products/FilterSlider";
import ProductCard from "@/components/Home/Products/ProductCard";
import { toast } from "sonner";
import api from "@/api/axios";
import { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [brands, setBrands] = useState<string[]>(['all']);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/product/all`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    const defaultCategories = ["Electronics", "Fashion", "Home & Kitchen", "Beauty", "Sports", "Books"];
    const productCategories = products.map((p: any) => p.category).filter(Boolean);
    const uniqueCategories = Array.from(new Set([...defaultCategories, ...productCategories]));
    
    const productsBrands = products.map((p: any) => p.brand).filter(Boolean);
    const uniqueBrands = Array.from(new Set([...productsBrands]));


    setCategories(["all", ...uniqueCategories]);
    setBrands(["all", ...uniqueBrands]);
    console.log(categories)
    console.log(brands)
  }, [products]);

  return (
    <div className="flex justify-between gap-8">
      <FilterSlider categories={categories} />

      <div className="flex flex-col flex-1">
        <div className="flex justify-end mb-4">
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="lowToHight">Price: Low to Hight</SelectItem>
                <SelectItem value="highToLow">Price: High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <ProductCard key={index} loading={true} />
            ))
          ) : (
            products.map((product) => (
              <ProductCard product={product} key={product._id} loading={false} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
