import { Badge, ShoppingCart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import api from "@/api/axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const NavBar = () => {
  const { user } = useSelector((state: any) => state.user);

  const accessToken = localStorage.getItem("accessToken");
  const logoutHeader = async () => {
    try {
      const res = await api.post(
        `/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.sucess) {
        toast.success(res.data.message);
      }
    } catch (error) {}
  };
  return (
    <header className="w-full bg-pink-50 fixed z-20 border-b border-pink-200 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
        {/* logo */}
        <div className="">
          <Link to={"/"} className="flex gap-3 items-center">
            <img className="w-[30px]" src="./logooo.png" alt="imageLogo" />
            <p className="">Hamada</p>
          </Link>
        </div>
        {/* nav */}
        <nav className="flex gap-10 justify-between items-center">
          <ul className="flex gap-7 items-center text-xl font-medium">
            <Link to={"/"}>
              <li>Home</li>
            </Link>
            <Link to={"/products"}>
              <li>products</li>
            </Link>
            {user && (
              <Link
                to="/profile"
                className="flex items-center gap-3 group px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                  {user.firstName[0].toUpperCase()}
                </div>

                <div className="flex flex-col -space-y-1">
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                    Hello,
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              </Link>
            )}
          </ul>
          <Link to={"/cart"} className="relative ">
            <ShoppingCart />
            <span className="bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2 ">
              0
            </span>
          </Link>
          {user ? (
            <Button className="bg-gradient-to-tl from-blue-600 to-purple-600">
              Logout
            </Button>
          ) : (
            <Button className="bg-pink-600 hover:bg-pink-400">Login</Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
