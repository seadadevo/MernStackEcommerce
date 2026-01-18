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
import {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  setProductCount, setProducts, setSearchKeyword } from "@/redux/productSlice";
import { Input } from "@/components/ui/input";
import Pagination from "../../components/Home/Products/Pagination";


const Products = () => {
  const {products, selectedCategory,productsCount ,searchKeyword ,selectedBrand, priceRange } = useSelector((state:any) => state.products)
  const [localSearch, setLocalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("")
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const getAllProducts = async () => {
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
      if(sort) params.append("sort", sort)
        // Only apply price filter if it's been modified from default
      if (priceRange && (priceRange[0] > 0 || priceRange[1] < 100000)) {
        params.append("productPrice[gte]", priceRange[0].toString());
        params.append("productPrice[lte]", priceRange[1].toString());
      }
      params.append("page", currentPage.toString());
      params.append("limit", "1");

      const res = await api.get(`/product/all?${params.toString()}`);
      if (res.data.success) {
        const fetchedProducts = res.data.products;
        dispatch(setProducts(fetchedProducts));
        dispatch(setProductCount(res.data.totalProductsCount))
        console.log(res.data.totalProductsCount)
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAllProducts();
    }, 500); 
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchKeyword, selectedCategory, selectedBrand, sort, priceRange[0], priceRange[1]]);

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchKeyword(localSearch)); 
    }, 500); 

    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);
  return (
    <div className="flex flex-col md:flex-row justify-between gap-8">
      <FilterSlider />

      <div className="flex flex-col flex-1">
        <div className="flex  justify-between gap-4">
        <Input placeholder="search.." value={localSearch} onChange={handleSearchChange}/>
        <div className="flex justify-end mb-4">
          <Select onValueChange={(value) => setSort(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="productPrice">Price: Low to Hight</SelectItem>
                <SelectItem value="-productPrice">Price: High to Low</SelectItem>
                <SelectItem value="-createdAt">Newest</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <ProductCard  key={index} loading={true} />
            ))
          ) : (
            products.map((product: any) => (
              <ProductCard product={product} key={product._id} loading={false} />
            ))
          )}
        </div>
        <div className="ml-auto mt-8">
          <Pagination 
          totalItems ={productsCount}
          itemsPerPage={1}
          currentPage={currentPage}
          onPageChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
