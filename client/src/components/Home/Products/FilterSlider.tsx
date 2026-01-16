import { Filter, X } from "lucide-react";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCategory, setSelectedBrand, setPriceRange } from "@/redux/productSlice"; 
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const FilterSlider = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const categories= ["all", "Accessories" , "Electronics", "Fashion", "Home & Kitchen", "Beauty", "Sports", "Books"]
  const brands= ["all", "Samsung" , "Dell", "Hawawy", "Elaraby"]
  
  const {  priceRange, selectedCategory, selectedBrand } = useSelector((state:any) => state.products);

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Categories</h3>
        <div className="flex flex-wrap gap-2 md:flex-col">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch(setSelectedCategory(cat))}
              className={`px-4 py-2 rounded-xl text-sm transition-all text-left ${
                selectedCategory === cat 
                ? "bg-red-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

  
      <div>
        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Brands</h3>
        <div className="flex flex-wrap gap-2 md:flex-col">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => dispatch(setSelectedBrand(brand))}
              className={`px-4 py-2 rounded-xl text-sm transition-all text-left ${
                selectedBrand === brand 
                ? "bg-gray-900 text-white" 
                : "border border-gray-200 text-gray-600 hover:border-red-500"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Price Range</h3>
        <div className="flex items-center gap-3">
    {/* Min Price */}
    <div className="flex-1">
      <label className="text-[10px] text-gray-400 uppercase font-bold">Min</label>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
        <Input
          type="number"
          placeholder="0"
          value={priceRange[0]}
          onChange={(e) => dispatch(setPriceRange([Number(e.target.value), priceRange[1]]))}
          className="pl-5 h-9 rounded-lg focus-visible:ring-red-500"
        />
      </div>
    </div>

    <div className="mt-4 text-gray-300">—</div>

    {/* Max Price */}
    <div className="flex-1">
      <label className="text-[10px] text-gray-400 uppercase font-bold">Max</label>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
        <Input
          type="number"
          placeholder="100000"
          value={priceRange[1]}
          onChange={(e) => dispatch(setPriceRange([priceRange[0], Number(e.target.value)]))}
          className="pl-5 h-9 rounded-lg focus-visible:ring-red-500"
        />
      </div>
    </div>
  </div>

  <div className="flex flex-wrap gap-2 mt-4">
    {[500, 1000, 5000].map(val => (
      <button 
        key={val}
        onClick={() => dispatch(setPriceRange([0, val]))}
        className="text-[11px] px-2 py-1 bg-gray-100 hover:bg-red-100 rounded-md transition-colors"
      >
        Under ${val}
      </button>
    ))}
  </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-red-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <Filter size={24} />
        </button>
      </div>

      <div className={`fixed inset-0 bg-white z-[100] transition-transform duration-500 md:hidden ${open ? "translate-y-0" : "translate-y-full"}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold italic text-red-500 underline ">Filters</h2>
            <button onClick={() => setOpen(false)} className="p-2 bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>
          <FilterContent />
          <button 
            onClick={() => setOpen(false)}
            className="w-full bg-red-500 text-white py-4 rounded-2xl mt-8 font-bold shadow-lg"
          >
            Show Results
          </button>
        </div>
      </div>

  
      <div className="hidden md:block w-72 h-fit sticky top-24 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <Filter size={20} className="text-red-500" /> Filters
        </h2>
        <FilterContent />
      </div>
    </>
  );
};

export default FilterSlider;