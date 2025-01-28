import React from 'react';

const stats = [
  { number: '15+', label: 'Years Experience' },
  { number: '100+', label: 'Products' },
  { number: '200+', label: 'Services' },
  { number: '5000+', label: 'Successful Assignments' },
  { number: '2000+', label: 'Satisfied Clients' },
  { number: '100+', label: 'Business Associates' }
];

export default function Stats() {
  return (
    <div className="bg-blue-600 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition">
                {stat.number}
              </div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}