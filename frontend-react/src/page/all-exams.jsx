import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';


function AllExams() {
  // 1. ฐานข้อมูลจำลอง (เดี๋ยวพอส่งงานจริงค่อยเชื่อมกับหลังบ้าน)
  const [exams] = useState([
    { id: 1, title: "TGAT1 จำลอง ปี 67", category: "TGAT", sub: "สื่อสารภาษาอังกฤษ", qCount: 20, time: 30 },
    { id: 2, title: "TPAT3 พื้นฐานวิศวะ", category: "TPAT", sub: "วิทยาศาสตร์และเทคโนโลยี", qCount: 45, time: 60 },
    { id: 3, title: "คณิตศาสตร์ A-Level ชุดที่ 1", category: "A-Level", sub: "คณิตศาสตร์ประยุกต์ 1", qCount: 30, time: 90 },
  ]);

  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '900px', marginTop: '40px', paddingBottom: '80px' }}>
          
          {/* ส่วนหัว: ชื่อหน้าและปุ่มสร้างใหม่ */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <Link to="/dashboard" className="back-link">← กลับไปหน้าหลัก</Link>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--brown)', marginTop: '12px', marginBottom: '4px' }}>
                คลังข้อสอบทั้งหมด 📚
              </h1>
              <p style={{ color: 'var(--muted)', margin: 0 }}>รวมทุกชุดข้อสอบที่คุณสร้างขึ้นและจัดเก็บไว้</p>
            </div>
            <Link to="/create-exam" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              + สร้างข้อสอบใหม่
            </Link>
          </div>

          {/* แถบค้นหาและตัวกรอง (ทำให้ดูโปรขึ้น) */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="ค้นหาชื่อชุดข้อสอบ..." 
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <select className="form-control" style={{ width: '150px' }}>
              <option value="all">ทุกหมวด</option>
              <option value="tgat">TGAT</option>
              <option value="tpat">TPAT</option>
              <option value="alevel">A-Level</option>
            </select>
          </div>

          {/* ส่วนแสดงรายการข้อสอบ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {exams.length > 0 ? (
              exams.map((exam) => (
                <div key={exam.id} className="card exam-card-hover" style={{ padding: '20px', transition: '0.3s', cursor: 'pointer' }}>
                  {/* Badge หมวดหมู่ */}
                  <span className={`badge ${exam.category === 'TGAT' ? 'badge-honey' : 'badge-amber'}`} style={{ marginBottom: '12px' }}>
                    {exam.category}
                  </span>
                  
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--brown)', marginBottom: '8px' }}>
                    {exam.title}
                  </h3>
                  
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    📖 {exam.sub}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--cream)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--brown)', fontWeight: '600' }}>
                      🧩 {exam.qCount} ข้อ | 🕒 {exam.time} นาที
                    </div>
                    <Link to={`/exam-detail/${exam.id}`} style={{ color: 'var(--amber)', textDecoration: 'none', fontWeight: '800', fontSize: '0.9rem' }}>
                      เปิด ➔
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              /* กรณีไม่มีข้อสอบเลย (Empty State) */
              <div className="card" style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center' }}>
                 <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📄</div>
                 <h3 style={{ color: 'var(--brown)' }}>ยังไม่มีชุดข้อสอบในคลัง</h3>
                 <p style={{ color: 'var(--muted)' }}>เริ่มสร้างข้อสอบชุดแรกของคุณเพื่อเตรียมพร้อมสำหรับการสอบ!</p>
              </div>
            )}
          </div>

        </div>
      </AnimatedPage>
    </>
  );
}

export default AllExams;