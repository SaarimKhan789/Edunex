import { motion } from "framer-motion";
export const FloatingCircle = ({
  size,
  delay,
}: {
  size: number;
  delay: number;
}) => (
  <motion.div
    className="absolute rounded-full bg-indigo-500"
    style={{ width: size, height: size }}
    animate={{
      y: [0, -30, 0],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 1.5,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);
