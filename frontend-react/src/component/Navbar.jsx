import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn = false }) {
  const [showDropdown, setShowDropdown] = useState(false);

  // ฟังก์ชันสลับเปิด/ปิด Dropdown เมื่อกด
  const toggleDropdown = (e) => {
    e.stopPropagation(); // ป้องกันไม่ให้ Event ไหลไปที่ส่วนอื่นของเว็บ
    setShowDropdown(!showDropdown);
  };

  // แถมพิเศษ: กดพื้นที่ว่างอื่นๆ บนหน้าเว็บแล้วให้ Dropdown ปิดอัตโนมัติ
  useEffect(() => {
    const handleClose = () => setShowDropdown(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  return (
    <nav className="navbar">
      {/* โลโก้ */}
      <Link to="/" className="navbar-brand">
        <div className="logo-hex">🐝</div>
        <span className="logo-text">EXAM<span>HIVE</span></span>
      </Link>
      
      {isLoggedIn ? (
        <ul className="navbar-nav">
          <li><Link to="/dashboard" className="active">ข้อสอบของฉัน</Link></li>
          <li><Link to="/history">ประวัติคะแนน</Link></li>
          <li>
            <div className="user-chip">
              <div className="user-avatar">ส</div>
              สมชาย
            </div>
          </li>
          <li><Link to="/login" className="btn btn-ghost btn-sm">ออกจากระบบ</Link></li>
        </ul>
      ) : (
        <ul className="navbar-nav" style={{ alignItems: 'center' }}>
          
          {/* ส่วนของ Dropdown หมวดวิชา */}
          <li style={{ position: 'relative', marginRight: '16px' }}>
            <span 
              onClick={toggleDropdown} // ✅ เปลี่ยนเป็น onClick ตรงนี้แทน
              style={{ 
                cursor: 'pointer', 
                fontWeight: 600, 
                color: 'var(--brown)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                userSelect: 'none' // ป้องกันไม่ให้ขึ้นแถบไฮไลต์ข้อความเวลากดซ้ำๆ
              }}
            >
              หมวดวิชา 
              {/* ลูกศรหมุนได้: ถ้าเปิดอยู่จะหมุนชี้ขึ้น ถ้าปิดจะชี้ลง เพิ่มความเท่สไตล์ Quizlet */}
              <span style={{ 
                fontSize: '0.8rem', 
                display: 'inline-block',
                transform: showDropdown ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s'
              }}>▼</span>
            </span>

            {/* เมนูที่หล่นลงมา */}
            {showDropdown && (
              <div 
                onClick={(e) => e.stopPropagation()} // กดข้างใน Dropdown ไม่ให้เมนูปิด
                style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                  background: 'white', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)',
                  padding: '8px 0', minWidth: '160px', zIndex: 10
                }}
              >
                {/* พอคลิกเลือกวิชาแล้ว ให้สั่งปิดเมนูด้วยการใส่ onClick={() => setShowDropdown(false)} */}
                <Link to="#" onClick={() => setShowDropdown(false)} style={{ display: 'block', padding: '10px 20px', color: 'var(--brown)', textDecoration: 'none', fontWeight: 500 }}>📝 TGAT</Link>
                <Link to="#" onClick={() => setShowDropdown(false)} style={{ display: 'block', padding: '10px 20px', color: 'var(--brown)', textDecoration: 'none', fontWeight: 500 }}>🧠 TPAT</Link>
                <Link to="#" onClick={() => setShowDropdown(false)} style={{ display: 'block', padding: '10px 20px', color: 'var(--brown)', textDecoration: 'none', fontWeight: 500 }}>📚 A-Level</Link>
              </div>
            )}
          </li>

          <li><Link to="/login" style={{ fontWeight: 600, color: 'var(--brown)', padding: '8px 16px', textDecoration: 'none' }}>เข้าสู่ระบบ</Link></li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;