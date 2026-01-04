export default function ScatteredBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundColor: '#000000',
        backgroundImage: 'url(/bg-pattern.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: '800px 800px',
        zIndex: -1,
      }}
    />
  );
}
