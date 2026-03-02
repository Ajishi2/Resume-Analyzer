'use client'

export default function GlowingText() {
  return (
    <div className="relative inline-block">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

        .nexus-text {
          font-family: 'Playfair Display', serif;
          font-size: clamp(60px, 15vw, 180px);
          font-weight: 900;
          color: #000;
          letter-spacing: -0.02em;
          position: relative;
          background: linear-gradient(
            90deg,
            #000 0%,
            #2a2a2a 25%,
            #9e9b9b 50%,
            #2a2a2a 75%,
            #000 100%
          );
          background-size: 200% 100%;
          animation: textShift 6s ease-in-out infinite;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 20px rgba(244, 247, 197, 0.8));
        }

        @keyframes textShift {
          0% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
          100% {
            background-position: 0% center;
          }
        }

        .light-sweep {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(244, 247, 197, 0.6) 20%,
            rgb(204, 201, 201) 50%,
            rgba(244, 247, 197, 0.6) 75%,
            transparent 100%
          );
          animation: lightSweep 3s ease-in-out infinite;
          -webkit-background-clip: text;
          background-clip: text;
          pointer-events: none;
          filter: blur(3px);
          mix-blend-mode: screen;
        }

        @keyframes lightSweep {
          0% {
            left: -100%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: -100%;
          }
        }
      `}</style>
      
      <h1 className="nexus-text text-balance">NEXUS</h1>
      <div className="light-sweep" />
    </div>
  )
}
