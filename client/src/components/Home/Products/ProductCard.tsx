import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/api/axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart, setCartItems } from "@/redux/cartSlice";
import { useEffect, useState } from "react";

const ProductCard = ({ product, loading }) => {
  const accessToken = localStorage.getItem('accessToken');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {cart, cartItems} = useSelector((state: any) => state.cart)
  
  const addToCart = async (productId: string) => {
    try {
      const res = await api.post('/cart/add' , {productId}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if(res.data.success) {
        toast.success('Product added to cart');
        dispatch(setCart(res.data.cart))
        dispatch(setCartItems(res.data.cart.items));
      }
    } catch (error) {
      console.error(error)
    }
  }

  const updateQty = async(productId: string , type: "increase" | "decrease") => {
    try {
      const res = await api.post(`/cart/update`, { productId,type}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (res.data.success) {
       dispatch(setCart(res.data.cart));
      dispatch(setCartItems(res.data.cart.items));
    }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  useEffect(() => {
  console.log("items: ", cartItems);
}, [cartItems]);

  if (loading) {
    return (
      <div className="flex flex-col space-y-4 bg-white rounded-2xl p-4 border border-gray-100">
       
        <Skeleton className="aspect-square w-full rounded-xl" /> 
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/3" /> 
          <Skeleton className="h-5 w-full" /> 
          <Skeleton className="h-4 w-full" /> 
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-6 w-16" /> 
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    );
  }
  
const itemInCart = cartItems?.find((item: any) => {
  const cartProductId = item?.productId?._id || item?.productId;  
  return cartProductId === product._id;
});
  
  const mainImage = product.productImag[0]?.url || "./heroImage.avif";
  
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={mainImage}
          alt={product.productName}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full shadow-lg hover:bg-pink-500 hover:text-white transition-colors"
          >
            <Eye size={18} />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-1">
          <Badge className="text-[10px] font-bold uppercase tracking-widest text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">
            {product.brand}
          </Badge>
        </div>

        <h3
          className="font-semibold text-gray-800 text-sm md:text-base mb-1 truncate"
          title={product.productName}
        >
          {product.productName}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2 mb-3 h-8">
          {product.productDesc}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              ${product.productPrice}
            </span>
          </div>
        {
          !itemInCart ? 
          <Button
            size="sm"
            className="bg-gray-900 hover:bg-pink-600 text-white rounded-lg px-3 flex gap-2 transition-colors"
            onClick={() => addToCart(product._id)}
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Add</span>
          </Button>
  :       <div className="flex items-center justify-center gap-2">
            <Button onClick={() => updateQty(product._id , "increase")}
             className="p-2 bg-red-600 rounded-md shadow-2xl">
              +
            </Button>
            <span className="-p-1 font-bold">
              {itemInCart.quantity}
            </span>
            <Button onClick={() => updateQty(product._id , "decrease")} className="p-2 bg-red-600 rounded-md shadow-2xl">
              -
            </Button>
          </div>
        }
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
