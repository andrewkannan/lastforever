"use client";

import { motion, useMotionValue } from "framer-motion";
import { Key } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminKey({ position = { x: 100, y: 250 } }) {
  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);
  const router = useRouter();

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x, y, touchAction: "none" }}
      whileHover={{ scale: 1.15, rotate: 15, zIndex: 100 }}
      whileTap={{ scale: 0.95, zIndex: 100 }}
      className="absolute cursor-grab active:cursor-grabbing z-50 text-[#9ca3af] hover:text-[#e5e7eb] transition-colors"
      onClick={() => router.push("/admin")}
      title="Admin Access"
    >
      <Key size={36} className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" strokeWidth={2.5} />
    </motion.div>
  );
}
