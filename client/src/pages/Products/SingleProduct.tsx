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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";

const SingleProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fisrtImage, setFisrtImage] = useState<string>("");

  const { cartItems } = useSelector((state: any) => state.cart);
  const itemInCart = cartItems?.find(
    (item: any) => item.productId === productId,
  );

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`product/${productId}`);
        const data = res.data.product;
        setProduct(data);
        if (data?.productImag?.length > 0) {
          setFisrtImage(data.productImag[0].url);
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
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!product)
    return (
      <div className="h-screen flex items-center justify-center">
        Product Not Found
      </div>
    );

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-pink-600">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-pink-600">
          Products
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 truncate">{product.productName}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
              <img
                src={fisrtImage}
                alt={product.productName}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.productImag?.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setFisrtImage(img.url)}
                  className={`relative w-24 h-24 rounded-xl border-2 flex-shrink-0 overflow-hidden transition-all ${fisrtImage === img.url ? "border-pink-500" : "border-transparent bg-gray-50"}`}
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
            <div className="mb-6">
              <span className="text-pink-600 font-semibold text-sm uppercase tracking-wider">
                {product.brand}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                {product.productName}
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">|</span>
                <span className="text-gray-600 text-sm italic">
                  Sold by: {product.userId?.firstName}{" "}
                  {product.userId?.lastName}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.productPrice}
                </span>
                <span className="text-gray-500 line-through text-lg">
                  ${product.productPrice + 100}
                </span>
              </div>
              <p className="mt-4 text-gray-600 leading-relaxed text-lg">
                {product.productDesc}
              </p>
            </div>

            <div className="mt-auto space-y-6">
              {itemInCart ? (
                <div className="flex items-center gap-6 p-4 bg-pink-50 rounded-2xl w-fit border border-pink-100">
                  <div className="flex items-center gap-4">
                    <button className="p-2 bg-white rounded-full shadow-sm hover:text-pink-600">
                      <Minus size={20} />
                    </button>
                    <span className="text-xl font-bold w-8 text-center">
                      {itemInCart.quantity}
                    </span>
                    <button className="p-2 bg-white rounded-full shadow-sm hover:text-pink-600">
                      <Plus size={20} />
                    </button>
                  </div>
                  <span className="text-pink-600 font-medium">
                    In your cart
                  </span>
                </div>
              ) : (
                <Button className="w-full md:w-2/3 h-14 text-lg bg-pink-600 hover:bg-pink-700 rounded-2xl shadow-lg shadow-pink-200 gap-3">
                  <ShoppingCart size={22} />
                  Add to Cart
                </Button>
              )}

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <Truck size={20} />
                  </div>
                  <span className="text-sm font-medium">Express Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-sm font-medium">Original Product</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
