import React from 'react';

const Features = () => {
  const features = [
    { title: 'Collectible Badges', desc: 'Earn pixel art badges for your achievements.', color: 'primary' },
    { title: 'Community Hub', desc: 'Connect with retro enthusiasts worldwide.', color: 'secondary' },
    { title: 'Pixel Gallery', desc: 'Showcase your retro creations.', color: 'accent' },
  ];

  return (
    <section id="features" className="bg-neutral-900 py-16 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="text-accent">&lt;</span>Retro Features<span className="text-primary">&gt;</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`bg-black p-6 border-2 border-${feature.color} hover:scale-105 transition-transform relative`}
            >
              <div className={`absolute -top-3 -right-3 w-6 h-6 bg-${feature.color}`}></div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;