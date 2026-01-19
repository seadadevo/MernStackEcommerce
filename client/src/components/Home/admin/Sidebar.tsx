import { SIDEBAR_TAPS } from "@/constants";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
        {SIDEBAR_TAPS.map((tap, index) => {
          const isActive = pathname === tap.path;
          return (
            <li key={index}>
              <Link
                to={tap.path}
                className={`
                  flex items-center p-3 rounded-lg transition-all group
                  ${isActive 
                    ? "bg-pink-600 text-white shadow-md shadow-pink-200" 
                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"}
                `}
              >
                <div className={`${isActive ? "text-white" : "text-gray-500 group-hover:text-pink-600"}`}>
                  {tap.icon}
                </div>
                
                <span
                  className={`
                    ml-4 font-medium whitespace-nowrap overflow-hidden transition-all duration-300
                    ${isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}
                  `}
                >
                  {tap.label}
                </span>

            
                {!isSidebarOpen && (
                   <div className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      {tap.label}
                   </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};


export default Sidebar;