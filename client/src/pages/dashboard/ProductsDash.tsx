import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProduct } from "@/hooks/useProducts";
import { Search, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setSearchKeyword } from "@/redux/productSlice";

const ProductsDash = () => {
  const dispatch = useDispatch();
  // سحب البيانات من Redux
  const { products, searchKeyword, selectedCategory, selectedBrand, sort, priceRange } = useSelector((state: any) => state.products);
  
  const [localSearch, setLocalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState("-createdAt");

  const { getAllProducts, loading } = useProduct();

  // 1. جلب البيانات عند تغير الفلاتر (استخدمنا limit أكبر للداشبورد)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAllProducts(currentPage, 10, currentSort);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchKeyword, selectedCategory, selectedBrand, currentSort, priceRange, getAllProducts]);

  // 2. هندلة البحث مع Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchKeyword(localSearch));
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  return (
    <div className="flex flex-col gap-6 p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
        
        <Link
          to={"/dashboard/products/add"}
          className="bg-pink-600 hover:bg-pink-700 transition-all px-4 py-2 rounded-lg flex items-center gap-2 text-white shadow-md shadow-pink-100"
        >
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-1 items-center border border-gray-200 rounded-lg px-3 focus-within:border-pink-500 transition-all">
          <Input
            className="border-none shadow-none focus-visible:ring-0"
            placeholder="Search by name..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <Search size={20} className="text-gray-400" />
        </div>

        <Select onValueChange={(v) => setCurrentSort(v)}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="-createdAt">Newest First</SelectItem>
              <SelectItem value="productPrice">Price: Low to High</SelectItem>
              <SelectItem value="-productPrice">Price: High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading Skeleton (يمكنك عمل واحدة مخصصة لاحقاً)
              <TableRow><TableCell colSpan={6} className="text-center py-10">Loading products...</TableCell></TableRow>
            ) : products?.length > 0 ? (
              products.map((item: any) => (
                <TableRow key={item._id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                      <img 
                        src={item.productImag?.[0]?.url || "/placeholder.png"} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                        <span>{item.productName}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{item._id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold">
                        {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-600">{item.brand}</TableCell>
                  <TableCell className="font-bold text-gray-900">${item.productPrice}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/product/${item._id}`} className="p-2 hover:bg-gray-100 rounded-md text-gray-500" title="View Product">
                        <ExternalLink size={18} />
                      </Link>
                      <button className="p-2 hover:bg-blue-50 rounded-md text-blue-600" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-md text-red-600" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-gray-500">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductsDash;