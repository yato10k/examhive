import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../component/AnimatedPage';

function ExamDo() {
  // สร้าง State สำหรับเก็บว่าผู้ใช้กดเลือกข้อไหนอยู่ (ก, ข, ค, หรือ ง)
  const [selectedChoice, setSelectedChoice] = useState(null);

  // ฟังก์ชันจัดการตอนกดเลือกคำตอบ
  const handleSelect = (choice) => {
    setSelectedChoice(choice);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      
      {/* 🔴 SLIM NAVBAR (แถบด้านบนแบบพิเศษสำหรับโหมดทำข้อสอบ) */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '12px 24px', background: '#fff', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/exam-detail" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
            ✖ ออก
          </Link>
          <div style={{ height: '24px', width: '1px', background: 'var(--border)' }}></div>
          <div style={{ fontWeight: '700', color: 'var(--brown)', fontSize: '0.95rem' }}>
            คณิตศาสตร์พื้นฐาน ม.ต้น
          </div>
        </div>

        {/* ตัวจับเวลา */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--cream)', padding: '6px 16px', borderRadius: '999px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '1.1rem' }}>⏱️</span>
          <span style={{ fontWeight: '800', color: 'var(--amber)', fontSize: '1.1rem', fontVariantNumeric: 'tabular-nums' }}>
            19:45
          </span>
        </div>
      </div>

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '800px', marginTop: '20px' }}>
          
          {/* PROGRESS BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--brown)' }}>ข้อ 1 จาก 15</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--muted)' }}>ทำไปแล้ว 6%</span>
          </div>
          <div className="progress-bar" style={{ marginBottom: '32px', height: '10px' }}>
            <div className="progress-fill" style={{ width: '6.66%' }}></div>
          </div>

          {/* QUESTION CARD */}
          <div className="card" style={{ padding: '32px 40px', marginBottom: '24px' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--brown)', marginBottom: '24px', lineHeight: '1.6' }}>
              1. ผลลัพธ์ของสมการ 3 + 5 × 2 มีค่าเท่ากับเท่าไร?
            </div>

            {/* CHOICES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div 
                onClick={() => handleSelect('A')}
                style={{
                  padding: '16px 20px', border: selectedChoice === 'A' ? '2px solid var(--amber)' : '2px solid var(--border)',
                  background: selectedChoice === 'A' ? 'var(--cream)' : '#fff',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: selectedChoice === 'A' ? 'var(--amber)' : 'var(--bg)', color: selectedChoice === 'A' ? '#fff' : 'var(--brown)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>ก</div>
                <div style={{ fontSize: '1.05rem', color: 'var(--brown)', fontWeight: '500' }}>16</div>
              </div>

              <div 
                onClick={() => handleSelect('B')}
                style={{
                  padding: '16px 20px', border: selectedChoice === 'B' ? '2px solid var(--amber)' : '2px solid var(--border)',
                  background: selectedChoice === 'B' ? 'var(--cream)' : '#fff',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: selectedChoice === 'B' ? 'var(--amber)' : 'var(--bg)', color: selectedChoice === 'B' ? '#fff' : 'var(--brown)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>ข</div>
                <div style={{ fontSize: '1.05rem', color: 'var(--brown)', fontWeight: '500' }}>13</div>
              </div>

              <div 
                onClick={() => handleSelect('C')}
                style={{
                  padding: '16px 20px', border: selectedChoice === 'C' ? '2px solid var(--amber)' : '2px solid var(--border)',
                  background: selectedChoice === 'C' ? 'var(--cream)' : '#fff',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: selectedChoice === 'C' ? 'var(--amber)' : 'var(--bg)', color: selectedChoice === 'C' ? '#fff' : 'var(--brown)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>ค</div>
                <div style={{ fontSize: '1.05rem', color: 'var(--brown)', fontWeight: '500' }}>10</div>
              </div>

              <div 
                onClick={() => handleSelect('D')}
                style={{
                  padding: '16px 20px', border: selectedChoice === 'D' ? '2px solid var(--amber)' : '2px solid var(--border)',
                  background: selectedChoice === 'D' ? 'var(--cream)' : '#fff',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: selectedChoice === 'D' ? 'var(--amber)' : 'var(--bg)', color: selectedChoice === 'D' ? '#fff' : 'var(--brown)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>ง</div>
                <div style={{ fontSize: '1.05rem', color: 'var(--brown)', fontWeight: '500' }}>8</div>
              </div>

            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn btn-outline" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              ← ข้อก่อนหน้า
            </button>
            
            {/* ปุ่มข้อถัดไป: ตอนทำโปรเจกต์จริงปุ่มนี้จะสลับหน้าข้อไปเรื่อยๆ จนข้อสุดท้ายถึงจะเปลี่ยนเป็นคำว่า ส่งข้อสอบ */}
            <Link to="/result" className="btn btn-primary" style={{ padding: '12px 32px' }}>
              ข้อถัดไป →
            </Link>
          </div>

        </div>
      </AnimatedPage>
    </div>
  );
}

export default ExamDo;