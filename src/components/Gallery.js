import React from 'react';

const Gallery = () => {
  const items = [
    { title: '16-Bit Hero', author: 'PixelMaster', src: 'https://placehold.co/400x400?text=16-Bit+Hero' },
    { title: 'Retro Setup', author: 'RetroCollector', src: 'https://placehold.co/400x400?text=Retro+Setup' },
  ];

  return (
    <section id="gallery" className="bg-neutral-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="text-primary">Gallery</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.title} className="bg-black p-4 border-2 border-secondary">
              <img src={item.src} alt={item.title} className="w-full h-64 object-cover" />
              <h3 className="text-xl font-bold mt-4">{item.title}</h3>
              <p className="text-gray-400">By {item.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;