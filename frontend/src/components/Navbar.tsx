import React from 'react';

const Navbar = () => {
  return (
    <div className="navbar bg-amber-900 shadow-sm text-white">
      {/* Logo */}
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href="/">TripNest</a>
      </div>
      <div className='flex-1'>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto p-4 border-4"
        />
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-4 px-2">
        <a className="btn btn-ghost" href="/">Home</a>
        <a className="btn btn-ghost" href="/about">About Us</a>
        <a className="btn btn-ghost" href="/contact">Contact Us</a>
      </div>
        {/* get statrted button */}
        <div className="flex-none">
        <a className="btn btn-primary" href="/get-started">Get Started</a>
      </div>

      {/* Right-side icons: Search & Avatar */}
      <div className="flex gap-2">
        {/* Search input */}
        

        {/* User avatar dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-amber-800 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
