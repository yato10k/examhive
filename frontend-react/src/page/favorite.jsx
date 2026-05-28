import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function Favorite() {
  // จำลอง State สำหรับจัดการการกดหัวใจ (เอาออกจากการบันทึก)
  const [favorites, setFavorites] = useState([1, 2]); // สมมติว่ามีข้อสอบ id 1 กับ 2 ที่กดไลก์ไว้

  const toggleFavorite = (e, id) => {
    e.preventDefault(); // ป้องกันไม่ให้คลิกหัวใจแล้วเด้งไปหน้า Exam Detail
    
    // ถ้ามีอยู่แล้วให้เอาออก ถ้าไม่มีให้ใส่เพิ่ม
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper">
          
          <div className="page-header" style={{ marginBottom: '32px' }}>
            <div>
              <h1 className="page-title">ข้อสอบที่บันทึกไว้ ❤️</h1>
              <p className="page-subtitle">ชุดข้อสอบที่คุณชื่นชอบและเก็บไว้ฝึกซ้อมในภายหลัง</p>
            </div>
            
            {/* กล่องค้นหา */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" className="form-control" placeholder="ค้นหาชุดข้อสอบ..." style={{ width: '250px' }} />
              <button className="btn btn-outline">ค้นหา</button>
            </div>
          </div>

          {favorites.length === 0 ? (
            // กรณีไม่มีข้อสอบที่บันทึกไว้
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--brown)', marginBottom: '8px' }}>ยังไม่มีข้อสอบที่บันทึกไว้</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>ลองค้นหาข้อสอบที่คุณสนใจแล้วกดรูปหัวใจเพื่อบันทึกเก็บไว้ดูสิ!</p>
              <Link to="/dashboard" className="btn btn-primary">ไปที่คลังข้อสอบ</Link>
            </div>
          ) : (
            // กรณีมีข้อสอบ (แสดงเป็น Grid แบบเดียวกับ Dashboard)
            <div className="grid-4">
              
              {/* Card 1 */}
              {favorites.includes(1) && (
                <Link to="/exam-detail" className="exam-card" style={{ position: 'relative' }}>
                  {/* ปุ่มหัวใจ */}
                  <button 
                    onClick={(e) => toggleFavorite(e, 1)}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', zIndex: 2, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                  >
                    ❤️
                  </button>

                  <div className="exam-card-icon">🅰️</div>
                  <div className="exam-card-subject">ภาษาไทย</div>
                  <div className="exam-card-title">ภาษาไทยเบื้องต้น</div>
                  <div className="exam-card-desc">การสะกดคำ คำพ้องความหมาย สุภาษิตและสำนวนไทย</div>
                  <div className="exam-card-meta">
                    <span>📝 12 ข้อ</span>
                    <span>⏱️ 10 นาที</span>
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    👤 สร้างโดย: คุณครูสมใจ
                  </div>
                </Link>
              )}

              {/* Card 2 */}
              {favorites.includes(2) && (
                <Link to="/exam-detail" className="exam-card" style={{ position: 'relative' }}>
                  {/* ปุ่มหัวใจ */}
                  <button 
                    onClick={(e) => toggleFavorite(e, 2)}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', zIndex: 2, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                  >
                    ❤️
                  </button>

                  <div className="exam-card-icon">🌍</div>
                  <div className="exam-card-subject">ทั่วไป</div>
                  <div className="exam-card-title">ความรู้รอบตัวทั่วไป</div>
                  <div className="exam-card-desc">ภูมิศาสตร์ ประวัติศาสตร์ วิทยาศาสตร์ทั่วไป และสังคมศึกษาเบื้องต้น</div>
                  <div className="exam-card-meta">
                    <span>📝 20 ข้อ</span>
                    <span>⏱️ 15 นาที</span>
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    👤 สร้างโดย: แอดมิน
                  </div>
                </Link>
              )}

            </div>
          )}

        </div>
      </AnimatedPage>
    </>
  );
}

export default Favorite;