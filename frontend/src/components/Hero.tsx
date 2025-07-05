import React from 'react';
import { Search } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-[90vh] bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb')] bg-cover bg-center text-white">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Stay</h1>
        <p className="text-lg md:text-2xl mb-6 max-w-xl">
          Discover and book top-rated hotels near your destination with TripNest.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-xl flex bg-white rounded-full overflow-hidden shadow-md">
          <input
            type="text"
            placeholder="Search by location..."
            className="flex-grow px-4 py-3 text-black outline-none"
          />
          <button className="bg-amber-900 text-white px-5 flex items-center gap-2">
            <Search size={20} />
            Search
          </button>
        </div>

        {/* CTA Button */}
        <a href="/explore" className="mt-6 btn btn-primary btn-wide">Explore Hotels</a>
      </div>
    </div>
  );
};

export default Hero;
