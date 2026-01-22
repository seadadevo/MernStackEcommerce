import api from "@/api/axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  ChevronRight,
  Minus,
  Plus,
  PackageCheck,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";

const SingleProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [firstImage, setFirstImage] = useState<string>("");

  const { cartItems } = useSelector((state: any) => state.cart);
  const { addToCart, updateQty, loading: cartLoading } = useCart();

  const itemInCart = cartItems?.find(
    (item: any) => (item.productId?._id || item.productId) === productId,
  );

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`product/${productId}`);
        const data = res.data.product;
        setProduct(data);
        if (data?.productImag?.length > 0) {
          setFirstImage(data.productImag[0].url);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [productId]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center animate-pulse text-pink-600 font-medium text-lg">
        Loading Product...
      </div>
    );
  if (!product)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Product Not Found
      </div>
    );
   
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20">

      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-2 text-sm text-gray-400">
        <Link to="/" className="hover:text-pink-600 transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-pink-600 transition-colors">
          Products
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium truncate">
          {product.productName}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
    
          <div className="space-y-6">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-gray-50 shadow-sm group">
              <img
                src={firstImage}
                alt={product.productName}
                className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide">
              {product.productImag?.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setFirstImage(img.url)}
                  className={`relative w-20 h-20 rounded-2xl border-2 flex-shrink-0 overflow-hidden transition-all duration-300 ${firstImage === img.url ? "border-pink-500 scale-95" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={img.url}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-2">
              <Badge
                variant="outline"
                className="text-pink-600 border-pink-100 bg-pink-50/50 rounded-full px-4"
              >
                {product.brand}
              </Badge>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {product.productName}
            </h1>

            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-1 text-yellow-400 bg-yellow-50 px-3 py-1 rounded-full">
                <Star size={16} fill="currentColor" />
                <span className="text-sm font-bold text-yellow-700">4.8</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <PackageCheck size={16} />
                <span>
                  Sold by:{" "}
                  <span className="font-semibold text-gray-800">
                    {product.userId?.firstName}
                  </span>
                </span>
              </div>
            </div>


            <div className="mt-8 p-6 bg-gray-50/50 rounded-3xl border border-gray-50">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-gray-900">
                  ${product.productPrice}
                </span>
                <span className="text-gray-400 line-through text-xl">
                  ${product.productPrice + 100}
                </span>
              </div>

              {/* Stock Status Badge */}
              <div className="mt-4">
                {isOutOfStock ? (
                  <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-none gap-1.5 px-3 py-1">
                    <AlertTriangle size={14} /> Out of Stock
                  </Badge>
                ) : isLowStock ? (
                  <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 border-none gap-1.5 px-3 py-1">
                    Only {product.stock} units left!
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-600 hover:bg-green-100 border-none gap-1.5 px-3 py-1">
                    In Stock ({product.stock} available)
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-gray-900 mb-3 uppercase text-xs tracking-widest">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {product.productDesc}
              </p>
            </div>

            <div className="mt-12 space-y-6">
              {itemInCart ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-6 p-2 bg-white rounded-2xl w-fit border-2 border-pink-500 shadow-sm shadow-pink-100">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl hover:bg-pink-50 text-pink-600"
                        onClick={() => updateQty(product._id, "decrease")}
                      >
                        <Minus size={20} />
                      </Button>
                      <span className="text-2xl font-black w-10 text-center text-gray-900">
                        {itemInCart.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl hover:bg-pink-50 text-pink-600"
                        disabled={itemInCart.quantity >= product.stock}
                        onClick={() => updateQty(product._id, "increase")}
                      >
                        <Plus size={20} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-pink-600 text-sm font-semibold flex items-center gap-2">
                    <ShoppingCart size={16} /> Item is in your cart
                  </p>
                </div>
              ) : (
                <Button
                  disabled={isOutOfStock || cartLoading}
                  onClick={() => addToCart(product._id)}
                  className="w-full md:w-3/4 h-16 text-xl bg-gray-900 hover:bg-pink-600 rounded-2xl shadow-xl transition-all duration-300 gap-3 active:scale-95"
                >
                  <ShoppingCart size={24} />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
              )}

  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
