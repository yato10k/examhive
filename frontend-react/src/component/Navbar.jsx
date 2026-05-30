import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn = false }) {
  const navigate = useNavigate();   // ← เพิ่ม: ไว้สั่งเด้งหน้า

  // ✅ 1. ประกาศ State ให้ครบทั้ง 2 เมนู
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ← เพิ่ม: อ่านชื่อจริงจาก localStorage
  const displayName = localStorage.getItem('display_name') || 'ผู้ใช้';
  const userEmail = localStorage.getItem('email') || '';

  // ← เพิ่ม: ฟังก์ชัน logout ลบ token แล้วเด้งไป login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('display_name');
    setShowProfileMenu(false);
    navigate('/login');
  };

  // ฟังก์ชันสลับเปิด/ปิด Dropdown หมวดวิชา
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
    setShowProfileMenu(false); // ปิดเมนูโปรไฟล์เผื่อเปิดค้างไว้
  };

  // ฟังก์ชันสลับเปิด/ปิด เมนูโปรไฟล์
  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setShowProfileMenu(!showProfileMenu);
    setShowDropdown(false); // ปิดเมนูวิชาเผื่อเปิดค้างไว้
  };

  // ฟังก์ชันปิดทุกเมนูเมื่อกดพื้นที่ว่างอื่นๆ บนหน้าเว็บ
  useEffect(() => {
    const handleClose = () => {
      setShowDropdown(false);
      setShowProfileMenu(false);
    };
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  return (
    <nav className="navbar">
      {/* โลโก้ */}
      <div className="navbar-brand">
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.8rem' }}>🐝</span>
          <span style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--brown)', letterSpacing: '-0.5px' }}>
            EXAMHIVE
          </span>
        </Link>
      </div>

      {/* ✅ 2. แยกเงื่อนไขการล็อกอินให้ชัดเจน */}
      {isLoggedIn ? (
        <ul className="navbar-nav">
          <li><Link to="/history">ประวัติคะแนน</Link></li>
          <li><Link to="/favorite">ข้อสอบที่บันทึกไว้ </Link></li>

          {/* โปรไฟล์น้องเฌอ (แบบ Dropdown Menu) */}
          <li style={{ position: 'relative' }}>

            {/* ปุ่มแคปซูล */}
            <div
              className="user-chip hide-bg"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              onClick={toggleProfileMenu}
            >
              <div style={{ position: 'relative' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.2rem' }}>
                  ช
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '700', color: 'var(--brown)', fontSize: '1rem' }}>
                  {displayName}
                </span>
              </div>
            </div>

            {/* กล่อง Dropdown โปรไฟล์ */}
            {showProfileMenu && (
              <div
                onClick={(e) => e.stopPropagation()} // ป้องกันกดข้างในแล้วเมนูปิด
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: '0',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  width: '260px',
                  zIndex: 100,
                  border: '1px solid var(--border)',
                  overflow: 'hidden'
                }}>

                {/* ส่วนหัว: รูป ชื่อ อีเมล */}
                <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.5rem', flexShrink: 0 }}>
                    ช
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: '700', color: 'var(--brown)', fontSize: '1.1rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {displayName}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {userEmail}
                    </div>
                  </div>
                </div>

                {/* ส่วนเมนูตั้งค่าและออกจากระบบ */}
                <div style={{ padding: '8px 0' }}>
                  <Link to="/edit-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', color: 'var(--brown)', fontWeight: '600' }} onClick={() => setShowProfileMenu(false)}>
                    <span style={{ fontSize: '1.2rem' }}></span> <span>Settings</span>
                  </Link>

                  <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }}></div>

                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: '#ef4444', fontWeight: '600', fontSize: '1rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🚪</span> <span>Log out</span>
                  </button>
                </div>

              </div>
            )}

          </li>
        </ul>

      ) : (

        // ✅ 3. โค้ดสำหรับคนที่ยังไม่ได้ล็อกอิน (มี Dropdown หมวดวิชา)
        <ul className="navbar-nav" style={{ alignItems: 'center' }}>

          <li style={{ position: 'relative', marginRight: '16px' }}>
            <span
              onClick={toggleDropdown}
              style={{
                cursor: 'pointer',
                fontWeight: 600,
                color: 'var(--brown)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                userSelect: 'none'
              }}
            >
              หมวดวิชา
              <span style={{ fontSize: '0.8rem', display: 'inline-block', transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
            </span>

            {/* เมนูหมวดวิชาที่หล่นลงมา */}
            {showDropdown && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                  background: 'white', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)',
                  padding: '8px 0', minWidth: '160px', zIndex: 10
                }}
              >
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