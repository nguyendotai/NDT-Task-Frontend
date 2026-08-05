"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./logo";

// Chỉ hiện đúng 1 lần cho mỗi tab (sessionStorage — mất khi đóng tab, không
// phải mỗi lần chuyển trang trong cùng phiên).
const SESSION_KEY = "ndt-task-intro-shown";
const DISPLAY_MS = 1800;

export function IntroSplash() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- chỉ ẩn ngay nếu tab này đã xem intro trước đó, không tránh được vì sessionStorage chỉ đọc được phía client
      setIsVisible(false);
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");
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
