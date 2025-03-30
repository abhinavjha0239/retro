import React from 'react';

const Hero = () => {
  return (
    <section id="hero" className="bg-black py-12 md:py-20 relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Pixelated Border Elements */}
      <div className="absolute top-0 left-0 right-0 h-4 flex">
        <div className="w-4 h-4 bg-[#FF0000]"></div>
        <div className="w-4 h-4 bg-[#00FFFF]"></div>
        <div className="w-4 h-4 bg-[#00FF00]"></div>
        <div className="w-4 h-4 bg-[#FFFF00]"></div>
        <div className="flex-1 flex">
          <div className="w-4 h-4 bg-[#FF0000]"></div>
          <div className="w-4 h-4 bg-[#00FFFF]"></div>
          <div className="w-4 h-4 bg-[#00FF00]"></div>
          <div className="w-4 h-4 bg-[#FFFF00]"></div>
          <div className="flex-1"></div>
          <div className="w-4 h-4 bg-[#00FF00]"></div>
          <div className="w-4 h-4 bg-[#00FFFF]"></div>
          <div className="w-4 h-4 bg-[#FF0000]"></div>
        </div>
      </div>

      {/* Side Pixelated Borders */}
      <div className="absolute top-4 bottom-4 left-0 w-4 bg-[#00FF00] flex flex-col">
        <div className="w-4 h-4 bg-[#FF0000]"></div>
        <div className="w-4 h-4 bg-[#00FFFF]"></div>
        <div className="flex-1"></div>
        <div className="w-4 h-4 bg-[#FFFF00]"></div>
        <div className="w-4 h-4 bg-[#FF0000]"></div>
      </div>

      <div className="absolute top-4 bottom-4 right-0 w-4 bg-[#00FF00] flex flex-col">
        <div className="w-4 h-4 bg-[#FF0000]"></div>
        <div className="w-4 h-4 bg-[#00FFFF]"></div>
        <div className="flex-1"></div>
        <div className="w-4 h-4 bg-[#FFFF00]"></div>
        <div className="w-4 h-4 bg-[#FF0000]"></div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#00FFFF] flex">
        <div className="w-4 h-4 bg-[#FF0000]"></div>
        <div className="w-4 h-4 bg-[#00FFFF]"></div>
        <div className="w-4 h-4 bg-[#00FF00]"></div>
        <div className="w-4 h-4 bg-[#FFFF00]"></div>
        <div className="flex-1 flex">
          <div className="w-4 h-4 bg-[#FF0000]"></div>
          <div className="w-4 h-4 bg-[#00FFFF]"></div>
          <div className="w-4 h-4 bg-[#00FF00]"></div>
          <div className="w-4 h-4 bg-[#FFFF00]"></div>
          <div className="flex-1"></div>
          <div className="w-4 h-4 bg-[#00FF00]"></div>
          <div className="w-4 h-4 bg-[#00FFFF]"></div>
          <div className="w-4 h-4 bg-[#FF0000]"></div>
        </div>
      </div>

      {/* CRT Scan Line Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-black to-transparent opacity-5"></div>
        <div className="w-full h-[2px] bg-white opacity-10 animate-scan">
          <div className="w-full h-[1px] bg-white blur-[1px]"></div>
        </div>
      </div>

      <div className="container mx-auto px-8 z-10 relative">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-white mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-[#00FFFF]">RETRO</span>
              <span className="text-[#FF0000]">VERSE</span>
            </h1>
            <p className="text-xl mb-6 font-mono">Your portal to the golden era of gaming and computing</p>
            <div className="bg-[#00FF00] h-1 w-24 mb-6"></div>
            <p className="mb-8">Join our community of enthusiasts, collect badges, share your retro experiences, and relive the excitement of the 80s and 90s computing era!</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#join" className="bg-[#FF0000] hover:bg-[#FF0000]/80 text-white font-bold py-3 px-8 inline-flex items-center justify-center">
                JOIN NOW
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#features" className="border-2 border-[#00FFFF] hover:bg-[#00FFFF]/20 text-white font-bold py-3 px-8 inline-flex items-center justify-center">
                EXPLORE
              </a>
            </div>

            <div className="flex gap-6 mt-10">
              <div className="text-center">
                <div className="text-[#00FFFF] font-mono text-xl font-bold">5,842</div>
                <div className="text-sm">Members</div>
              </div>
              <div className="text-center">
                <div className="text-[#FF0000] font-mono text-xl font-bold">12,390</div>
                <div className="text-sm">Collectibles</div>
              </div>
              <div className="text-center">
                <div className="text-[#00FF00] font-mono text-xl font-bold">3,754</div>
                <div className="text-sm">Posts</div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <img 
                src="https://placehold.co/400x400?text=Pixel+Art+Character"
                alt="Retro pixel art character mascot"
                className="z-10 relative"
              />
              <div className="absolute -top-4 -left-4 w-6 h-6 bg-[#FF0000] animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-[#00FFFF] animate-pulse"></div>
              <div className="absolute top-1/2 -right-6 w-4 h-4 bg-[#00FF00] animate-bounce"></div>
              <div className="absolute bottom-1/2 -left-6 w-4 h-4 bg-[#FFFF00] animate-bounce"></div>
              <div className="absolute -top-2 right-1/4 w-8 h-8 rounded-full bg-[#FFFF00] animate-bounce">
                <div className="absolute inset-1 rounded-full bg-[#FF0000]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;