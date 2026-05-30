// component/ProtectedRoute.jsx
// ทำหน้าที่เป็น "ยาม" — เช็คว่า login แล้วหรือยัง ก่อนให้เข้าหน้าด้านใน
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // 1. ดึง token จาก localStorage (ที่ login เก็บไว้)
  const token = localStorage.getItem('token');

  // 2. ถ้าไม่มี token = ยังไม่ได้ login → เด้งไปหน้า login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. มี token แล้ว → ให้ผ่านเข้าหน้าที่ห่อไว้ได้
  return children;
}

export default ProtectedRoute;