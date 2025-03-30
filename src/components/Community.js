import React from 'react';

const Community = () => {
  return (
    <section id="community" className="bg-neutral-900 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-12">
          <span className="text-secondary">Community</span>
        </h2>
        <p className="text-xl mb-8">Join 5,842 members from 42 countries!</p>
        <div className="flex justify-center gap-6">
          <div>
            <p className="text-3xl font-mono text-primary">5,842</p>
            <p>Members</p>
          </div>
          <div>
            <p className="text-3xl font-mono text-secondary">42</p>
            <p>Countries</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;