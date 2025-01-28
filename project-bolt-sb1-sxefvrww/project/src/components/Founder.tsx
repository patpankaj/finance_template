import React from 'react';

export default function Founder() {
  return (
    <div className="py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Our Founder</h2>
          <p className="mt-4 text-lg text-gray-600">
            Leading the way in financial excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Mr. Manoj N. Kastiya Jain</h3>
            <div className="space-y-2 text-gray-600">
              <p>B.Com., Certified Govt Auditor, Sales Tax Practitioner</p>
              <p>ISO Lead Auditor, BSE NSE AP-Associates Person</p>
              <p>IRDA Approved Insurance Advisor</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Areas of Expertise:</h4>
              <ul className="grid grid-cols-2 gap-3">
                {[
                  'Financial Planning',
                  'Tax Management',
                  'Business Strategy',
                  'Investment Advisory',
                  'Risk Management',
                  'Corporate Training'
                ].map((skill, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"
              alt="Founder Speaking"
              className="rounded-lg shadow-lg w-full h-48 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80"
              alt="Training Session"
              className="rounded-lg shadow-lg w-full h-48 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}