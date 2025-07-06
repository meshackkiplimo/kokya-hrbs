import React from 'react';
import { Search } from 'lucide-react';
import bgImg from '../assets/img/bg.jpg';

const Hero = () => {
  return (
    <div className="relative h-auto md:h-[90vh] bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb')] bg-cover bg-center text-white">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full px-6 md:px-16 gap-12 py-10">
        {/* Text Section */}
        <div className="flex flex-col gap-4 text-center md:text-left max-w-xl">
          <h1 className="text-4xl md:text-6xl font-bold">Find Your Perfect Stay</h1>
          <p className="text-lg md:text-2xl">
            Discover and book top-rated hotels near your destination with TripNest.
          </p>

          {/* Search Bar */}
          <div className="w-full flex bg-white rounded-full overflow-hidden shadow-md mt-4">
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
          <a href="/explore" className="mt-6 btn btn-primary btn-wide">
            Explore Hotels
          </a>
        </div>

        {/* Image Section */}
        <div className="flex justify-center md:justify-end">
          <img
            src={bgImg}
            alt="Hero Background"
            className="w-130 h-130 rounded border-4 border-white object-cover shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
