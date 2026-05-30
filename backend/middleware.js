const jwt = require("jsonwebtoken");

// ตรวจสอบว่าล็อกอินหรือยัง + Token ถูกต้องไหม (ฟังก์ชัน #18 บางส่วน)
function authToken(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) return res.status(401).json({ message: "ไม่มี token (กรุณาเข้าสู่ระบบ)" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // ส่ง payload (user_id, role) ไปให้ Route ถัดไปใช้งาน
    next();
  } catch (err) {
    return res.status(403).json({ message: "token หมดอายุหรือไม่ถูกต้อง" });
  }
}

// ตรวจสอบระดับสิทธิ์ของผู้ใช้งาน เช่น ตรวจสอบความเป็น Admin (ฟังก์ชัน #18 เต็มรูปแบบ)
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึง (สำหรับผู้ดูแลระบบเท่านั้น)" });
    }
    next();
  };
}

module.exports = { authToken, requireRole };