import React from 'react';
import { FileText, Briefcase, Calculator, Building } from 'lucide-react';

const additionalServices = [
  {
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80",
    icon: Briefcase,
    title: "Startup Services",
    description: "Complete startup guidance from ideation to execution",
    features: ["Business Planning", "Company Registration", "Compliance Setup", "Growth Strategy"]
  },
  {
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80",
    icon: FileText,
    title: "Tax Returns",
    description: "Professional tax return filing services",
    features: ["Income Tax Returns", "GST Returns", "TDS Filing", "Tax Assessment"]
  },
  {
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80",
    icon: Calculator,
    title: "Audit Services",
    description: "Comprehensive audit and assurance services",
    features: ["Statutory Audit", "Internal Audit", "Tax Audit", "Compliance Audit"]
  },
  {
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80",
    icon: Building,
    title: "MCA Services",
    description: "Complete Ministry of Corporate Affairs compliance solutions",
    features: ["Company Registration", "Annual Filings", "Corporate Compliance", "Legal Documentation"]
  }
];

export default function AdditionalServices() {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Specialized Services</h2>
          <p className="mt-4 text-lg text-gray-600">
            Expert solutions for your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {additionalServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 p-2 rounded-full">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}