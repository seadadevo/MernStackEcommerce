import { Truck, ShieldCheck, Headphones, LayoutDashboard, ShoppingBasket, ClipboardList, Users, Settings } from 'lucide-react';
import { Facebook, Instagram, Twitter } from 'lucide-react'

export const SIGNUP_FIELDS = [
  {
    id: "firstName",
    name: "firstName",
    label: "First Name",
    placeholder: "ahmed",
    type: "text",
  },
  {
    id: "lastName",
    name: "lastName",
    label: "Last Name",
    placeholder: "magdy",
    type: "text",
  },
  
];


export const features = [
    {
      icon: <Truck className="h-6 w-6 text-blue-600" />,
      title: "Free Shipping",
      description: "On orders over $50",
      bgColor: "bg-blue-100",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
      title: "Secure Payment",
      description: "100% secure transactions",
      bgColor: "bg-green-100",
    },
    {
      icon: <Headphones className="h-6 w-6 text-purple-600" />,
      title: "24/7 Support",
      description: "Dedicated support team",
      bgColor: "bg-purple-100",
    }
  ];


export const CUSTOMER_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "FAQs", href: "/faqs" },
  { label: "Order Tracking", href: "/tracking" },
  { label: "Size Guide", href: "/size-guide" },
];

export const SOCIAL_LINKS = [
  { icon: <Facebook size={18} />, href: "https://facebook.com" },
  { icon: <Instagram size={18} />, href: "https://instagram.com" },
  { icon: <Twitter size={18} />, href: "https://twitter.com" },
];

export const SIDEBAR_TAPS = [
  {
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    path: "/dashboard"
  },
  {
    icon: <ShoppingBasket size={20} />,
    label: "Products",
    path: "/dashboard/products"
  },
  {
    icon: <ClipboardList size={20} />,
    label: "Orders",
    path: "/dashboard/orders"
  },
  {
    icon: <Users size={20} />,
    label: "Users",
    path: "/dashboard/users"
  },
  {
    icon: <Settings size={20} />,
    label: "Settings",
    path: "/dashboard/settings"
  }
];

export const PRODUCT_INPUTS = [
  { name: "productName", label: "Name", id: "name", placeholder: "Add name", type: "text" },
  { name: "productDesc", label: "Description", id: "description", placeholder: "Add description", type: "text" },
  { name: "productPrice", label: "Price", id: "price", placeholder: "Add price", type: "number" },
  { name: "brand", label: "Brand", id: "brand", placeholder: "Add brand", type: "text" },
  { name: "category", label: "Category", id: "category", placeholder: "Add category", type: "text" },
  { name: "stock", label: "Stock", id: "stock", placeholder: "Add stock", type: "number" },
];