import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function Profile() {
  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '700px', marginTop: '40px' }}>
          <a class="back-link" href="/dashboard" data-discover="true">← กลับไปหน้า Dashboard</a>
          {/* ส่วนหัวโปรไฟล์ */}
          <div className="card" style={{ padding: '40px', textAlign: 'center', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
            {/* แถบสีตกแต่งด้านบน */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'var(--honey)', opacity: '0.2' }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--amber)', color: '#fff', fontSize: '3rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                ช
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--brown)', marginBottom: '4px' }}>
                น้องเฌอ
              </h1>
              <div className="badge badge-honey" style={{ marginBottom: '16px' }}>นักศึกษา / ผู้ใช้งานทั่วไป</div>

            </div>
          </div>


          {/* ส่วนสถิติและการตั้งค่า */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>

            {/* กล่องข้อมูลส่วนตัว */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--brown)', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                ข้อมูลส่วนตัว
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>อีเมล</div>
                  <div style={{ fontWeight: '600', color: 'var(--brown)' }}>cher.dsi@student.kmutt.ac.th</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>เข้าร่วมเมื่อ</div>
                  <div style={{ fontWeight: '600', color: 'var(--brown)' }}>มกราคม 2026</div>
                </div>
              </div>
              <Link
                to="/edit-profile"
                className="btn btn-outline btn-sm"
                style={{ marginTop: '20px', width: '100%', justifyContent: 'center', textDecoration: 'none' }}
              >
                ✏️ แก้ไขข้อมูลส่วนตัว
              </Link>
            </div>

            {/* กล่องสถิติภาพรวม */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--brown)', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                ภาพรวมกิจกรรม
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--muted)' }}>ชุดข้อสอบที่สร้าง</span>
                  <span style={{ fontWeight: '800', color: 'var(--brown)' }}>0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--muted)' }}>ข้อสอบที่ทำไปแล้ว</span>
                  <span style={{ fontWeight: '800', color: 'var(--brown)' }}>12</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--muted)' }}>ข้อสอบที่บันทึกไว้</span>
                  <span style={{ fontWeight: '800', color: 'var(--brown)' }}>4</span>
                </div>
              </div>
            </div>

          </div>

          {/* ปุ่มออกจากระบบ */}
          <div style={{ textAlign: 'center' }}>
            <Link to="/login" className="btn btn-danger btn-lg" style={{ width: '100%', justifyContent: 'center', padding: '16px' }} onClick={() => alert('ออกจากระบบเรียบร้อยแล้ว ไว้เจอกันใหม่นะ! 🐝')}>
              🚪 ออกจากระบบ (Logout)
            </Link>
          </div>

        </div>
      </AnimatedPage>
    </>
  );
}

export default Profile;