import { features } from "@/constants";

const Features = () => {
  
  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto  px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`h-12 w-12 ${feature.bgColor} rounded-full flex items-center justify-center shrink-0`}>
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;