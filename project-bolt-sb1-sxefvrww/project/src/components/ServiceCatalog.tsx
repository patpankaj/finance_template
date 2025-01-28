import React from 'react';
import { 
  FileText, Building2, Shield, Briefcase, 
  CreditCard, Scale, BookOpen, Award,
  Globe, Home, Landmark, Users
} from 'lucide-react';

const serviceCategories = [
  {
    title: "Tax & Compliance",
    services: [
      "Income Tax Return Filing",
      "GST Registration & Returns",
      "TDS Compliances",
      "Professional Tax",
      "Corporate Tax",
      "Tax Appeals & Assessments"
    ],
    icon: FileText
  },
  {
    title: "Business Services",
    services: [
      "Company Formation",
      "MSME Registration",
      "Business Startup",
      "Partnership Registration",
      "Business Expansion",
      "Digital Signature"
    ],
    icon: Building2
  },
  {
    title: "Insurance & Protection",
    services: [
      "Health Insurance",
      "Motor Insurance",
      "Life Insurance",
      "Property Insurance",
      "Business Insurance",
      "Risk Management"
    ],
    icon: Shield
  },
  {
    title: "Certifications",
    services: [
      "ISO 9001:2015",
      "ISO 22000",
      "Quality Management",
      "Food Safety",
      "Process Certification",
      "System Audits"
    ],
    icon: Award
  },
  {
    title: "Financial Services",
    services: [
      "Business Loans",
      "Home Loans",
      "Monthly Income Schemes",
      "Investment Planning",
      "Retirement Planning",
      "Wealth Management"
    ],
    icon: Landmark
  },
  {
    title: "Legal & Documentation",
    services: [
      "Trademark Registration",
      "Copyright Services",
      "Patent Registration",
      "Legal Documentation",
      "Contract Review",
      "Legal Compliance"
    ],
    icon: Scale
  }
];

export default function ServiceCatalog() {
  return (
    <div className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Complete Service Catalog</h2>
          <p className="mt-4 text-lg text-gray-600">
            Comprehensive financial and business solutions under one roof
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {category.services.map((service, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 w-full bg-gray-50 text-gray-900 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-4">
            {[
              { text: "15+ Years Experience", color: "bg-blue-100 text-blue-800" },
              { text: "100+ Products", color: "bg-green-100 text-green-800" },
              { text: "200+ Services", color: "bg-purple-100 text-purple-800" },
              { text: "5000+ Assignments", color: "bg-yellow-100 text-yellow-800" }
            ].map((badge, index) => (
              <span
                key={index}
                className={`${badge.color} px-4 py-2 rounded-full text-sm font-semibold`}
              >
                {badge.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}