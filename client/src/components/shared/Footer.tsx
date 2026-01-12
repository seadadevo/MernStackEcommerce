import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { CUSTOMER_LINKS, SOCIAL_LINKS } from "@/constants";

const Footer = () => {
  return (
    <footer className="bg-[#0b0e14] text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="text-pink-600">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.1-5.38H5.83" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white tracking-wider">
                Hamada
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Powering Your World with the Best in Electronics.
            </p>
            <div className="text-sm space-y-2">
              <p>123 Electronics St, Style City, NY 10001</p>
              <p>
                Email:{" "}
                <span className="hover:text-pink-500 cursor-pointer">
                  support@Zaptro.com
                </span>
              </p>
              <p>Phone: (123) 456-7890</p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">
              Customer Service
            </h3>
            <ul className="space-y-4 text-sm">
              {CUSTOMER_LINKS.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="hover:text-pink-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Follow Us</h3>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition-all text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg">Stay in the Loop</h3>
            <p className="text-sm">
              Subscribe to get special offers, free giveaways, and more.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border-none rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 text-center text-sm">
          <p>
            © 2026 <span className="text-pink-500 font-bold">Hamada</span>. All
            rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
