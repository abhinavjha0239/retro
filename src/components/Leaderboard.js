import React from 'react';

const Leaderboard = () => {
  const leaders = [
    { name: 'PixelMaster', points: 1250 },
    { name: 'RetroQueen', points: 980 },
    { name: '8BitWizard', points: 750 },
  ];

  return (
    <section id="leaderboard" className="bg-black py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="text-accent">Leaderboard</span>
        </h2>
        <div className="max-w-2xl mx-auto">
          {leaders.map((leader, index) => (
            <div key={leader.name} className="flex justify-between items-center p-4 border-b-2 border-secondary">
              <span className="text-xl">{index + 1}. {leader.name}</span>
              <span className="text-xl font-mono text-primary">{leader.points} PTS</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;