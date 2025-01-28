import React from 'react';

export default function About() {
  return (
    <div id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
              alt="About Us"
              className="rounded-lg shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">About Indian Money Master</h2>
            <p className="mt-4 text-lg text-gray-600">
              Founded in 2002, Indian Money Master has grown to become India's largest diversified
              financial service provider. Our mission is to make India the best economy in the world
              by providing accessible financial education and services.
            </p>
            <div className="mt-8 space-y-4">
              {[
                'Focus on Financial Education',
                'Business & Tax Management',
                'Investment Planning',
                'Risk Management',
                'One-stop Financial Solution'
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}