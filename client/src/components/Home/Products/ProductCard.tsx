import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import ProductSkeleton from "./ProductSkeleton";

const ProductCard = ({ product, loading }: {product?: any , loading: boolean}) => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state: any) => state.cart);
  const { addToCart, updateQty, loading: cartLoading } = useCart();

  if (loading) {
    return (
      <ProductSkeleton/>
    );
  }

  const itemInCart = cartItems?.find((item: any) => {
    const cartProductId = item?.productId?._id || item?.productId;
    return cartProductId === product._id ;
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
          <Link
            to={`/product/${product._id}`}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-pink-500 hover:text-white transition-colors"
          >
            <Eye size={18} />
          </Link>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-1">
          <Badge className="text-[10px] font-bold uppercase tracking-widest text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">
            {product.brand}
          </Badge>
        </div>

        <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1 truncate" title={product.productName}>
          {product.productName}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2 mb-3 h-8">
          {product.productDesc}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">${product.productPrice}</span>
          </div>
          
          {!itemInCart ? (
            <Button
              size="sm"
              disabled={cartLoading || product.stock < 1}
              className="bg-gray-900 hover:bg-pink-600 text-white rounded-lg px-3 flex gap-2 transition-colors"
              onClick={() => addToCart(product._id)}
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">{product.stock < 1 ? "Out of Stock" : "Add"}</span>
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Button 
                disabled={cartLoading || itemInCart.quantity >= product.stock}
                onClick={() => updateQty(product._id, "increase")}
                className="h-8 w-8 p-0 bg-gray-900 hover:bg-pink-600 text-white"
              >
                +
              </Button>
              <span className="font-bold min-w-[20px] text-center">
                {itemInCart.quantity}
              </span>
              <Button 
                disabled={cartLoading}
                onClick={() => updateQty(product._id, "decrease")}
                className="h-8 w-8 p-0 bg-gray-900 hover:bg-pink-600 text-white"
              >
                -
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;