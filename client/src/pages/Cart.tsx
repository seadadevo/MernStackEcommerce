import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Trash2, Plus, Minus, TicketPercent, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, cart } = useSelector((state: any) => state.cart);
  const { removeFromCart, updateQty, loading } = useCart();
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center p-10 font-bold text-2xl flex items-center gap-3 justify-center">
        Your cart is empty <ShoppingCart />
      </div>
    );
  }
 
  return (
    <div className="p-4 md:p-8">
      <h2 className="font-bold text-3xl text-gray-800 mb-8">Shopping Cart</h2>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* products */}
        <div className="flex-1 flex flex-col gap-4 ">
          {cartItems.map((item: any) => (
            
            <div
              key={item._id}
              className="flex flex-row items-center gap-4 bg-white p-4 rounded-xl border shadow-sm"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.productId?.productImag?.[0]?.url || "heroImage.avif"}
                  alt={item.productId?.productName}
                  className="w-full h-full object-contain p-2"
                />
              </div>    

              <div className="flex-1 flex flex-col gap-1">
                <h3 className="font-bold text-gray-800 line-clamp-1">
                  {item.productId?.productName}
                </h3>
                <p className="text-sm text-gray-500">{item.productId?.brand}</p>
                <p className="font-bold text-pink-600">${item.price}</p>
              </div>

              {/*  */}
              <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-white"
                  disabled={loading}
                  onClick={() => updateQty(item.productId?._id || item.productId, "decrease")}
                >
                  <Minus size={14} />
                </Button>
                <span className="font-bold text-sm w-4 text-center">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-white"
                  disabled={loading}
                  onClick={() => updateQty(item.productId?._id || item.productId, "increase")}
                >
                  <Plus size={14} />
                </Button>
              </div>

              <Button
                variant="ghost"
                className="text-gray-400 hover:text-red-500"
                disabled={loading}
                onClick={() => removeFromCart(item.productId?._id || item.productId)}
              >
                <Trash2 size={20} />
              </Button>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-[380px] flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <TicketPercent className="text-pink-500" size={20} />
              <span>Have a coupon?</span>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Enter code" className="bg-gray-50" />
              <Button className="bg-gray-900">Apply</Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xl mb-2">Order Summary</h3>

            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${cart?.totalPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-xl text-gray-900">
              <span>Total</span>
              <span>${cart?.totalPrice}</span>
            </div>

            <Link to={'/add-order'} className="w-fit bg-pink-600 text-white px-4 py-1.5 rounded-md flex items-center justify-center mx-auto hover:bg-pink-700 h-12 text-lg font-bold mt-4 shadow-lg shadow-pink-100">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
