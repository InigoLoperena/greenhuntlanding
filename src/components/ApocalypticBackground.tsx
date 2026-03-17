import apocalypticBg from "@/assets/apocalyptic-city-bg.jpg";

export const ApocalypticBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/* Background image - blurred and dark */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${apocalypticBg})`,
          filter: 'brightness(0.45)',
        }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Animated floating particles - debris/dust */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating green spores */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`spore-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${3 + (i % 4) * 2}px`,
              height: `${3 + (i % 4) * 2}px`,
              background: `radial-gradient(circle, rgba(180, 250, 116, ${0.4 + (i % 3) * 0.15}) 0%, transparent 70%)`,
              left: `${5 + (i * 8.3) % 95}%`,
              top: `${10 + (i * 13.7) % 80}%`,
              animation: `float-spore-${i % 3} ${8 + (i % 5) * 3}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}

        {/* Drifting fog layers */}
        <div
          className="absolute w-[200%] h-32 opacity-[0.06]"
          style={{
            top: '30%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(180,250,116,0.3) 30%, transparent 50%, rgba(180,250,116,0.2) 70%, transparent 100%)',
            animation: 'drift-fog 25s linear infinite',
          }}
        />
        <div
          className="absolute w-[200%] h-24 opacity-[0.04]"
          style={{
            top: '65%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(180,250,116,0.2) 40%, transparent 60%, rgba(180,250,116,0.3) 80%, transparent 100%)',
            animation: 'drift-fog 35s linear infinite reverse',
          }}
        />

        {/* Flickering distant lights */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`light-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${4 + i * 2}px`,
              height: `${4 + i * 2}px`,
              background: `radial-gradient(circle, rgba(255,200,100,0.6) 0%, transparent 70%)`,
              left: `${15 + i * 18}%`,
              top: `${20 + (i * 17) % 50}%`,
              animation: `flicker ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float-spore-0 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          25% { transform: translateY(-40px) translateX(15px); opacity: 0.7; }
          50% { transform: translateY(-20px) translateX(-20px); opacity: 0.3; }
          75% { transform: translateY(-50px) translateX(10px); opacity: 0.6; }
        }
        @keyframes float-spore-1 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          33% { transform: translateY(-30px) translateX(-25px); opacity: 0.6; }
          66% { transform: translateY(-60px) translateX(15px); opacity: 0.4; }
        }
        @keyframes float-spore-2 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.5; }
          40% { transform: translateY(-45px) translateX(20px); opacity: 0.3; }
          80% { transform: translateY(-15px) translateX(-15px); opacity: 0.7; }
        }
        @keyframes drift-fog {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          20% { opacity: 0.8; transform: scale(1.2); }
          40% { opacity: 0.2; transform: scale(0.9); }
          60% { opacity: 0.6; transform: scale(1.1); }
          80% { opacity: 0.1; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};
