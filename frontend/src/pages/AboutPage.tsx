import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-white text-gray-800 px-6 md:px-16 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">About TripNest</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Your trusted companion for discovering the best hotel experiences tailored to your destination and style.
        </p>
      </div>

      {/* Our Mission */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            alt="Hotel experience"
            className="rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4 text-amber-900">Our Story</h2>
          <p className="mb-4">
            TripNest was founded with a simple idea: to make hotel booking as seamless and personal as possible. We help travelers find the best places to stay based on location, price, and experience.
          </p>
          <p>
            Whether you're planning a weekend getaway or a business trip, TripNest connects you with the perfect accommodations — all at your fingertips.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-amber-900">Why Choose TripNest?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-amber-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-bold mb-2">Curated Listings</h3>
            <p>We carefully vet and list only top-rated hotels based on verified reviews and amenities.</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-bold mb-2">Location-based Search</h3>
            <p>Easily find hotels closest to your destination using our smart location search engine.</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-bold mb-2">User-Focused Experience</h3>
            <p>Our platform is built with you in mind — fast, reliable, and mobile-friendly for travel on the go.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <a
          href="/explore"
          className="btn btn-primary btn-wide text-white bg-amber-900 hover:bg-amber-800 transition"
        >
          Explore Hotels
        </a>
      </div>
    </div>
  );
};

export default AboutPage;
