import { motion } from "framer-motion";

export function HieroglyphicBg({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F3AE1C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity,
      }}
    />
  );
}

export function GoldRadialGlow({ position = "center" }: { position?: string }) {
  const positions: Record<string, string> = {
    center: "50% 50%",
    top: "50% 0%",
    bottom: "50% 100%",
    "top-left": "20% 20%",
    "top-right": "80% 20%",
  };
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(ellipse 60% 40% at ${positions[position] || position}, rgba(243,174,28,0.07) 0%, transparent 70%)`,
      }}
    />
  );
}

export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { w: 300, h: 300, x: "10%", y: "20%", delay: 0 },
        { w: 200, h: 200, x: "80%", y: "60%", delay: 2 },
        { w: 150, h: 150, x: "50%", y: "80%", delay: 4 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.w,
            height: orb.h,
            left: orb.x,
            top: orb.y,
            background: "radial-gradient(circle, rgba(243,174,28,0.04) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{
            x: [-20, 20, -20],
            y: [-15, 15, -15],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function ScanlineOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }}
    />
  );
}
