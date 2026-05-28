import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function ExamDetail() {
  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper">
          <Link to="/dashboard" className="back-link">← กลับไปหน้า Dashboard</Link>

          {/* TWO-COLUMN LAYOUT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '28px', alignItems: 'start' }}>

            {/* LEFT COLUMN */}
            <div>
              {/* EXAM INFO CARD */}
              <div className="card mb-24">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                  <div className="exam-card-icon" style={{ width: '56px', height: '56px', fontSize: '26px', flexShrink: 0 }}>🔢</div>
                  <div style={{ flex: 1 }}>
                    <div className="exam-card-subject">คณิตศาสตร์</div>
                    <h1 className="page-title" style={{ fontSize: '1.4rem' }}>คณิตศาสตร์พื้นฐาน ม.ต้น</h1>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '4px', lineHeight: '1.6' }}>
                      บวก ลบ คูณ หาร ลำดับการดำเนินการ และโจทย์ปัญหาเบื้องต้น
                      เหมาะสำหรับนักเรียนชั้น ม.1–ม.3
                    </p>
                  </div>
                </div>

                {/* Meta info chips */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '999px', padding: '5px 14px', fontSize: '0.83rem', fontWeight: 600, color: 'var(--brown)' }}>
                    📝 15 คำถาม
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '999px', padding: '5px 14px', fontSize: '0.83rem', fontWeight: 600, color: 'var(--brown)' }}>
                    ⏱️ 20 นาที
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '999px', padding: '5px 14px', fontSize: '0.83rem', fontWeight: 600, color: 'var(--brown)' }}>
                    🔄 ปรนัย MCQ
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '999px', padding: '5px 14px', fontSize: '0.83rem', fontWeight: 600, color: 'var(--brown)' }}>
                    👤 โดย สมชาย
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link to="/exam-do" className="btn btn-primary btn-lg">
                    ▶ เริ่มทำข้อสอบ
                  </Link>
                  <Link to="#" className="btn btn-ghost">✏️ แก้ไข</Link>
                  <Link to="#" className="btn btn-danger">🗑 ลบ</Link>
                </div>
              </div>

              {/* QUESTION LIST */}
              <div className="section-block">
                <div className="section-block-title"><span>📋</span> รายการคำถามทั้งหมด</div>
                <div className="card" style={{ padding: '20px 24px' }}>
                  
                  <div className="question-item">
                    <div className="question-num">1</div>
                    <div className="question-body">
                      <div className="question-text">ผลลัพธ์ของ 3 + 5 × 2 มีค่าเท่ากับเท่าไร?</div>
                      <div className="question-type mt-4">
                        <span className="badge badge-blue">MCQ</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--muted)', marginLeft: '6px' }}>4 ตัวเลือก</span>
                      </div>
                    </div>
                  </div>

                  <div className="question-item">
                    <div className="question-num">2</div>
                    <div className="question-body">
                      <div className="question-text">เศษส่วน 3/4 มีค่าเท่ากับกี่เปอร์เซ็นต์?</div>
                      <div className="question-type mt-4">
                        <span className="badge badge-blue">MCQ</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--muted)', marginLeft: '6px' }}>4 ตัวเลือก</span>
                      </div>
                    </div>
                  </div>

                  <div className="question-item">
                    <div className="question-num">3</div>
                    <div className="question-body">
                      <div className="question-text">ตัวเลขที่หารด้วย 6 ลงตัว จะต้องหารด้วยทั้ง 2 และ 3 ลงตัวเสมอ</div>
                      <div className="question-type mt-4">
                        <span className="badge badge-purple">จริง/เท็จ</span>
                      </div>
                    </div>
                  </div>

                  {/* Collapsed indicator */}
                  <div style={{ textAlign: 'center', padding: '14px 0 4px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>และอีก 12 คำถาม...</span>
                  </div>

                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div style={{ position: 'sticky', top: '80px' }}>
              {/* Score Summary */}
              <div className="card mb-16">
                <div style={{ fontWeight: 800, color: 'var(--brown)', marginBottom: '16px', fontSize: '0.95rem' }}>
                  📈 สถิติของคุณ
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ textAlign: 'center', padding: '12px', background: 'var(--cream)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--amber)' }}>5</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 600 }}>รอบที่ทำ</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: 'var(--cream)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16a34a' }}>85%</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--muted)', fontWeight: 600 }}>คะแนนเฉลี่ย</div>
                  </div>
                </div>
                
                <hr className="divider" />
                
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brown)', marginBottom: '8px' }}>
                  คะแนน 3 รอบล่าสุด
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>รอบที่ 5</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar" style={{ width: '80px' }}>
                        <div className="progress-fill" style={{ width: '87%' }}></div>
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#16a34a', minWidth: '32px' }}>13/15</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>รอบที่ 4</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar" style={{ width: '80px' }}>
                        <div className="progress-fill" style={{ width: '80%' }}></div>
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--amber)', minWidth: '32px' }}>12/15</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Share */}
              <div className="card mt-16" style={{ padding: '16px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--brown)', marginBottom: '10px' }}>
                  🔗 แชร์ชุดข้อสอบ
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="form-control" style={{ fontSize: '0.78rem', padding: '7px 10px' }} type="text" defaultValue="examhive.app/set/math-01" readOnly />
                  <button className="btn btn-outline btn-sm">คัดลอก</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedPage>

      <footer className="footer">© 2026 EXAMHIVE</footer>
    </>
  );
}

export default ExamDetail;