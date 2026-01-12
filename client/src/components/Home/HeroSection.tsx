import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // لو مش عندك سيبها span
import { ShoppingBag, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 text-white overflow-hidden">
    

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* left side */}
          <div className="flex flex-col items-start space-y-6">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none px-4 py-1 text-sm backdrop-blur-md">
              New Season Arrival 🔥
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Latest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-pink-200">
                Electronics
              </span>{" "}
              <br />
              at Best Prices
            </h1>

            <p className="text-lg lg:text-xl text-blue-100/90 max-w-[500px] leading-relaxed">
              Experience the future of technology with our exclusive collection
              of premium gadgets. Quality meets affordability.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-6 text-lg rounded-full shadow-lg"
              >
                Shop Now <ShoppingBag className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                className="border-white/40 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
              >
                View Deals <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex gap-8 pt-8 border-t border-white/40 w-full">
              <div>
                <p className="text-2xl font-bold">50k+</p>
                <p className="text-blue-200 text-sm">Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">120+</p>
                <p className="text-blue-200 text-sm">Brands</p>
              </div>
            </div>
          </div>

          {/* right side */}
          <div className="relative hidden md:block group">
            <div className="relative bg-white/5  border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="./heroImage.avif"
                alt="Latest Electronics"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
