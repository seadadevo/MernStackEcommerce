import { Truck, ShieldCheck, Headphones } from 'lucide-react';


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
