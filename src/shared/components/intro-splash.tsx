"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./logo";

// IntroSplash chỉ mount lại khi tải lại toàn trang (F5, mở tab mới) — Next.js
// chuyển trang bằng Link không remount `app/providers.tsx` nên không cần
// sessionStorage để chặn hiện lại giữa các lần điều hướng nội bộ.
const DISPLAY_MS = 1800;

export function IntroSplash() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), DISPLAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-4 bg-background"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Logo size={96} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            className="font-heading text-xl font-bold tracking-wide text-foreground"
          >
            NDT Task
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
