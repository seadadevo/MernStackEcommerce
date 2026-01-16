import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import FilterSlider from "@/components/Home/Products/FilterSlider";

const Products = () => {
  return (
    <div className="flex justify-between">
      <FilterSlider />

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

      
      </div>
    </div>
  );
};

export default Products;
