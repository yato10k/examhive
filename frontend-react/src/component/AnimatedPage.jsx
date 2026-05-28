import React from 'react';
import { motion } from 'framer-motion';

// ตั้งค่าจุดเริ่มต้น, จุดที่แสดงผล, และตอนออก
const animations = {
  initial: { opacity: 0, y: 15 }, // ก่อนโชว์: โปร่งใส 0% และเลื่อนลงต่ำไป 15px
  animate: { opacity: 1, y: 0 },  // ตอนโชว์: ชัดเจน 100% และกลับมาจุดเดิม
  exit: { opacity: 0, y: -15 },   // ตอนออก: โปร่งใส และเลื่อนขึ้น
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.6, ease: "easeOut" }} // ความเร็วกำลังดีที่ 0.3 วินาที
    >
      {children}
    </motion.div>
  );
}

export default AnimatedPage;