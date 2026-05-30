import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function Result() {
  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '600px', marginTop: '40px' }}>
          
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            {/* ดาวตกแต่ง */}
            <div style={{ fontSize: '4rem', marginBottom: '16px', lineHeight: '1' }}>🎉</div>
            
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--brown)', marginBottom: '8px' }}>
              ทำภารกิจสำเร็จ!
            </h1>
            <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>
              ชุดข้อสอบ: คณิตศาสตร์พื้นฐาน ม.ต้น
            </p>

            {/* วงแหวนคะแนน (Mockup) */}
            <div style={{ 
              width: '180px', height: '180px', borderRadius: '50%', 
              background: 'conic-gradient(#16a34a 86%, var(--cream) 0)', 
              margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(22, 163, 74, 0.2)'
            }}>
              <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#16a34a', lineHeight: '1' }}>13</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--muted)' }}>จาก 15 ข้อ</div>
              </div>
            </div>

            {/* สถิติ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '600', marginBottom: '4px' }}>ความแม่นยำ</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brown)' }}>86%</div>
              </div>
              <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '600', marginBottom: '4px' }}>เวลาที่ใช้</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brown)' }}>17:24</div>
              </div>
            </div>

            {/* ปุ่ม Action */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/exam-detail" className="btn btn-primary btn-lg btn-full" style={{ justifyContent: 'center' }}>
                ดูเฉลยละเอียด
              </Link>
              <Link to="/dashboard" className="btn btn-outline btn-lg btn-full" style={{ justifyContent: 'center' }}>
                กลับสู่หน้าหลัก
              </Link>
            </div>
            
          </div>

        </div>
      </AnimatedPage>
    </>
  );
}

export default Result;