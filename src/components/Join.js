import React from 'react';

const Join = () => {
  return (
    <section id="join" className="bg-black py-16 relative">
      <div className="container mx-auto px-8">
        <div className="bg-neutral-900 border-4 border-accent p-8 max-w-lg mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">
            <span className="text-accent">Join RetroVerse</span>
          </h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-secondary font-bold mb-2">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Your retro handle"
                className="w-full bg-black border-2 border-primary text-white p-3"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-secondary font-bold mb-2">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Your email"
                className="w-full bg-black border-2 border-primary text-white p-3"
              />
            </div>
            <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-3">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Join;