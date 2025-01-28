import React from 'react';
import { Shield, Building2, FileText, BarChart3, Users, Target, Calendar, Wallet } from 'lucide-react';

const featuredServices = [
  {
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80",
    title: "Income Tax Services",
    description: "Comprehensive income tax filing and planning services for individuals and businesses",
    features: [
      "Tax Return Filing",
      "Tax Planning",
      "Compliance Management",
      "Tax Saving Strategies"
    ]
  },
  {
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80",
    title: "GST Services",
    description: "Complete GST registration and filing services for businesses",
    features: [
      "GST Registration",
      "Return Filing",
      "Compliance",
      "Advisory Services"
    ]
  },
  {
    image: "https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?auto=format&fit=crop&q=80",
    title: "Business Loans",
    description: "Expert assistance in business loan application and processing",
    features: [
      "Unsecured Loans",
      "Working Capital",
      "Term Loans",
      "Project Finance"
    ]
  },
  {
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80",
    title: "Monthly Income Schemes",
    description: "Strategic planning for consistent monthly returns",
    features: [
      "Investment Planning",
      "Regular Income",
      "Portfolio Management",
      "Risk Assessment"
    ]
  }
];

const services = [
  {
    icon: Building2,
    title: 'Business Planning',
    description: 'Comprehensive business planning and startup services for entrepreneurs.'
  },
  {
    icon: BarChart3,
    title: 'Financial Analysis',
    description: 'Detailed financial analysis and reporting services for informed decision-making.'
  },
  {
    icon: FileText,
    title: 'Tax Services',
    description: 'Complete tax planning, filing, and compliance services for individuals and businesses.'
  },
  {
    icon: Shield,
    title: 'Insurance Services',
    description: 'Comprehensive insurance solutions for all your protection needs.'
  },
  {
    icon: Calendar,
    title: 'Monthly Income Schemes',
    description: 'Regular income generation through strategic investment planning.'
  },
  {
    icon: Wallet,
    title: 'Loan Services',
    description: 'Business and personal loan facilitation with expert guidance.'
  }
];

export default function Services() {
  return (
    <div id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
          <p className="mt-4 text-lg text-gray-600">
            Comprehensive financial solutions tailored to your needs
          </p>
        </div>

        {/* Featured Services with Images */}
        <div className="mt-20 space-y-12">
          {featuredServices.map((service, index) => (
            <div 
              key={index}
              className={`flex flex-col md:flex-row gap-8 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="w-full md:w-1/2">
                <img
                  src={service.image}
                  alt={service.title}
                  className="rounded-lg shadow-xl w-full h-[300px] object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mt-32">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">Additional Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition">
                    <Icon className="h-6 w-6 text-blue-600 group-hover:text-white transition" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">{service.title}</h3>
                  <p className="mt-2 text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}