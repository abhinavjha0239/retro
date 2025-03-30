import React from 'react';

const Footer = () => {
  const socialLinks = {
    Discord: 'https://discord.gg/retrorealm',
    Twitter: 'https://twitter.com/retrorealm',
    YouTube: 'https://youtube.com/retrorealm',
    Instagram: 'https://instagram.com/retrorealm'
  };

  const resourceLinks = {
    'Pixel Art Tutorials': '/tutorials/pixel-art',
    'Retro Game Guides': '/guides/retro-games',
    'Hardware Mods': '/guides/hardware-mods',
    'Chiptune Music': '/music/chiptune',
    'Emulation Help': '/guides/emulation',
    'Community Rules': '/community/rules'
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Newsletter submission logic would go here
    console.log('Newsletter form submitted');
  };

  return (
    <footer id="footer" className="bg-black text-white py-12 relative">
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#00FF00]"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="w-4 h-4 bg-[#FF0000] mr-2"></div>
              ABOUT US
            </h3>
            <p className="text-gray-400 mb-4">RetroRealm is a community platform for enthusiasts of 1980s and 1990s computing, gaming, and pixel art.</p>
            <div className="flex space-x-3">
              {Object.entries(socialLinks).map(([platform, url]) => (
                <a 
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${platform} page`}
                  className="w-10 h-10 bg-neutral-800 flex items-center justify-center hover:bg-[#00FFFF] transition-colors"
                >
                  <i className={`fab fa-${platform.toLowerCase()}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="w-4 h-4 bg-[#00FFFF] mr-2"></div>
              QUICK LINKS
            </h3>
            <ul className="space-y-2">
              {['Home', 'Features', 'Collectibles', 'Community', 'Leaderboard', 'Gallery', 'Join Us'].map(link => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-[#00FFFF]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="w-4 h-4 bg-[#00FF00] mr-2"></div>
              RESOURCES
            </h3>
            <ul className="space-y-2">
              {Object.entries(resourceLinks).map(([name, url]) => (
                <li key={name}>
                  <a href={url} className="text-gray-400 hover:text-[#00FF00]">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="w-4 h-4 bg-[#FFFF00] mr-2"></div>
              NEWSLETTER
            </h3>
            <p className="text-gray-400 mb-4">Subscribe to get updates on events, collectibles and retro news!</p>
            <form onSubmit={handleNewsletterSubmit} className="flex mb-4">
              <input
                type="email"
                placeholder="Your email"
                className="bg-neutral-800 text-white px-4 py-2 w-full focus:outline-none"
                required
                aria-label="Email for newsletter"
              />
              <button 
                type="submit" 
                className="bg-[#FFFF00] text-black px-4 py-2 font-bold hover:bg-[#FFFF00]/80"
              >
                SIGN UP
              </button>
            </form>
            <p className="text-xs text-gray-500">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>

        {/* Support Badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-block bg-neutral-900 border-2 border-[#FF0000] p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-6 h-6 bg-[#FF0000] mr-2"></div>
              <span className="text-white font-bold">NEED SUPPORT?</span>
            </div>
            <p className="text-gray-400 mb-3">Our retro community support team is ready to help!</p>
            <a 
              href="/support"
              className="inline-block bg-[#FF0000] text-white px-6 py-2 font-bold hover:bg-[#FF0000]/80"
            >
              CONTACT SUPPORT
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-neutral-800 pt-6 text-sm text-gray-500">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>© 2023 RetroRealm. All pixels reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="/privacy" className="hover:text-white">Privacy Policy</a>
              <a href="/terms" className="hover:text-white">Terms of Service</a>
              <a href="/contact" className="hover:text-white">Contact Us</a>
              <a href="/faq" className="hover:text-white">FAQ</a>
            </div>
          </div>
        </div>

        {/* Easter Egg */}
        <div className="text-center mt-6 text-xs text-neutral-700">
          <span className="font-mono">PRESS ↑ ↑ ↓ ↓ ← → ← → B A FOR A SURPRISE</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#00FF00]"></div>
    </footer>
  );
};

export default Footer;