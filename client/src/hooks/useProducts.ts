import api from "@/api/axios";
import { setProductCount, setProducts } from "@/redux/productSlice";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export const useProduct = () => {
  const [loading, setLoading] = useState(false);
  const {
    products,
    selectedCategory,
    productsCount,
    searchKeyword,
    selectedBrand,
    priceRange,
  } = useSelector((state: any) => state.products);
  const dispatch = useDispatch();
  const getAllProducts = useCallback(async (page = 1, limit = 1, sort = "") => {
    try {
      // keyword=searchKeyword&category=Accessories&brand=Samsung,hawawy
      setLoading(true);
      const params = new URLSearchParams();
      if (searchKeyword) params.append("keyword", searchKeyword);
      if (selectedCategory && selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (selectedBrand && selectedBrand !== "all") {
        params.append("brand", selectedBrand);
      }
      if (sort) params.append("sort", sort);
      // Only apply price filter if it's been modified from default
      if (priceRange && (priceRange[0] > 0 || priceRange[1] < 100000)) {
        params.append("productPrice[gte]", priceRange[0].toString());
        params.append("productPrice[lte]", priceRange[1].toString());
      }
      params.append("page", page.toString());
      params.append("limit", "1");

      const res = await api.get(`/product/all?${params.toString()}`);
      if (res.data.success) {
        const fetchedProducts = res.data.products;
        dispatch(setProducts(fetchedProducts));
        dispatch(setProductCount(res.data.totalProductsCount));
        console.log(res.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }   
  }, [searchKeyword, selectedCategory, selectedBrand, priceRange, dispatch])
  return {getAllProducts, loading, products, productsCount };
};
