import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({ titleComponent, children }: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const scaleDimensions = () => isMobile ? [0.7, 0.9] : [1.05, 1];
  // Remap scroll progress so the 3D unfold completes by ~55% of the track,
  // leaving the iframe flat & interactive for the rest of the scroll span.
  const { scrollYProgress } = useScroll({ target: containerRef });
  const rotate = useTransform(scrollYProgress, [0, 0.55, 1], [20, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.55, 1], [...scaleDimensions(), scaleDimensions()[1]]);
  const translate = useTransform(scrollYProgress, [0, 0.55, 1], [0, -100, -100]);
  // Mobile: drop the heavy multi-layer box-shadow that's recalculated every
  // scroll frame — keeps the 3D unfold smooth on low-end GPUs.
  // Desktop keeps the full shadow stack unchanged.
  const cardShadow = isMobile
    ? "0 9px 20px #0000004a"
    : "0 0 80px rgba(243,174,28,0.08), 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026";
  return (
    <div className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20" ref={containerRef}>
      <div className="py-10 md:py-40 w-full relative" style={{ perspective: "1000px" }}>
        <motion.div style={{ translateY: translate }} className="max-w-5xl mx-auto text-center mb-8">
          {titleComponent}
        </motion.div>
        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow: cardShadow,
          }}
          className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border border-[#F3AE1C]/20 p-2 md:p-4 bg-[#0C0905] rounded-[24px] shadow-2xl will-change-transform"
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-[#080604]">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
