export default function ScatteredBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundColor: '#000000',
        backgroundImage: 'url(/bg-pattern.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: '600px 600px',
      }}
    />
  );
}
