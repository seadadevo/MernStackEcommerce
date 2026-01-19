import { SIDEBAR_TAPS } from "@/constants";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { pathname } = useLocation(); 
    console.log(pathname)
  return (
    <aside
      className={`
        ${isSidebarOpen ? "w-72" : "w-[70px]"} 
        sticky top-16 h-[calc(100vh-64px)] 
        bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out 
        flex flex-col
      `}
    >
     
      <div className={`p-4 flex ${isSidebarOpen ? "justify-end" : "justify-center"}`}>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded-lg bg-gray-50 hover:bg-pink-50 hover:text-pink-600 transition-colors border border-gray-100"
        >
          <MenuIcon size={18} />
        </button>
      </div>

      <ul className="flex-1 px-3 space-y-1">
  {SIDEBAR_TAPS.map((item, index) => (
    <li key={index}>
      <NavLink end
        to={item.path}
        className={({ isActive }) => 
          `flex items-center p-3 rounded-lg transition-all group ${
            isActive ? "bg-pink-600 text-white" : "text-gray-600 hover:bg-pink-50"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span className={isActive ? "text-white" : "group-hover:text-pink-600"}>
              {item.icon}
            </span>
            {isSidebarOpen && <span className="ml-4">{item.label}</span>}
          </>
        )}
      </NavLink>
    </li>
  ))}
</ul>
    </aside>
  );
};


export default Sidebar;