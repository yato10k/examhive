import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function Report() {
  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '600px', marginTop: '40px' }}>
          
          <div className="card" style={{ padding: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ fontSize: '2rem' }}>🚩</div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brown)', margin: 0 }}>รายงานปัญหา</h1>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>โปรดระบุรายละเอียดเพื่อให้แอดมินตรวจสอบ</p>
              </div>
            </div>

            {/* ข้อมูลข้อสอบที่ถูกรีพอร์ต */}
            <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: '600', marginBottom: '4px' }}>กำลังรายงานชุดข้อสอบ:</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--brown)' }}>คณิตศาสตร์พื้นฐาน ม.ต้น</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>สร้างโดย: คุณครูสมใจ</div>
            </div>

            {/* ฟอร์มรายงาน */}
            <form>
              <div className="form-group">
                <label className="form-label">หัวข้อปัญหา <span style={{ color: 'red' }}>*</span></label>
                <select className="form-control" required>
                  <option value="">-- เลือกหัวข้อที่ต้องการรายงาน --</option>
                  <option value="copyright">ละเมิดลิขสิทธิ์ / คัดลอกผลงาน</option>
                  <option value="wrong_content">เนื้อหาผิดพลาด / เฉลยผิด</option>
                  <option value="inappropriate">เนื้อหาไม่เหมาะสม / หยาบคาย</option>
                  <option value="spam">สแปม / โฆษณาแฝง</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">รายละเอียดเพิ่มเติม <span style={{ color: 'red' }}>*</span></label>
                <textarea 
                  className="form-control" 
                  rows="5" 
                  placeholder="กรุณาอธิบายปัญหาที่คุณพบ เช่น ข้อสอบนี้คัดลอกมาจากหนังสือเล่มไหน หรือข้อไหนเฉลยผิด..."
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">แนบลิงก์อ้างอิง (ถ้ามี)</label>
                <input type="url" className="form-control" placeholder="https://..." />
              </div>

              {/* ปุ่มกดยืนยัน */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <Link to="/exam-detail" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                  ยกเลิก
                </Link>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ flex: 1, justifyContent: 'center', background: '#ef4444', borderColor: '#ef4444' }}
                  onClick={() => {
                    alert("ส่งรายงานสำเร็จ! ขอบคุณที่ช่วยทำให้ EXAMHIVE เป็นสังคมแห่งการเรียนรู้ที่ดีขึ้นครับ 🐝");
                    window.location.href = "/dashboard";
                  }}
                >
                  ส่งรายงาน
                </button>
              </div>
            </form>
            
          </div>

        </div>
      </AnimatedPage>
    </>
  );
}

export default Report;