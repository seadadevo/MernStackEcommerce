import api from "@/api/axios";
import { setCart, setCartItems } from "@/redux/cartSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useCart = () => {
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(false);

  const cartReq = async (url, method = "post", data = {}) => {
    try {
      setLoading(true);
      const res = await api({
        url,
        method,
        data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        dispatch(setCartItems(res.data.cart.items));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cart operation failed");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (productId: string) =>
    cartReq("/cart/add", "post", { productId }).then(() => {
      toast.success("product is Added to cart");
    });
  const updateQty = (productId: string, type: "increase" | "decrease") =>
    cartReq("/cart/update", "post", { productId, type });
  const getCart = () => cartReq("/cart/", "get");
  const removeFromCart = (productId: string) =>
    cartReq("/cart/remove", "delete", { productId }).then(() =>
      toast.success("Item removed from cart")
    );
  return { addToCart, updateQty, getCart,removeFromCart , loading };
};
