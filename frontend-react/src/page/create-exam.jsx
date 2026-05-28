import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function CreateExam() {
  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '800px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <Link to="/dashboard" className="back-link">← ยกเลิกและกลับ</Link>
              <h1 className="page-title" style={{ marginTop: '8px' }}>สร้างชุดข้อสอบใหม่ 📝</h1>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline">บันทึกฉบับร่าง</button>
              <button className="btn btn-primary">เผยแพร่ข้อสอบ</button>
            </div>
          </div>

          {/* ส่วนที่ 1: ข้อมูลทั่วไปของชุดข้อสอบ */}
          <div className="card mb-24" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--brown)', marginBottom: '20px', borderBottom: '2px solid var(--cream)', paddingBottom: '12px' }}>
              1. ข้อมูลทั่วไป
            </h2>
            
            <div className="form-group">
              <label className="form-label">ชื่อชุดข้อสอบ</label>
              <input type="text" className="form-control" placeholder="เช่น วิทยาศาสตร์กายภาพ ม.3" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">หมวดวิชา</label>
                <select className="form-control">
                  <option value="">-- เลือกหมวดวิชา --</option>
                  <option value="math">คณิตศาสตร์</option>
                  <option value="science">วิทยาศาสตร์</option>
                  <option value="thai">ภาษาไทย</option>
                  <option value="general">ความรู้ทั่วไป</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">เวลาที่ใช้ทำ (นาที)</label>
                <input type="number" className="form-control" placeholder="เช่น 30" />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">คำอธิบายชุดข้อสอบ</label>
              <textarea className="form-control" rows="3" placeholder="อธิบายสั้นๆ ว่าข้อสอบชุดนี้เกี่ยวกับอะไร..."></textarea>
            </div>
          </div>

          {/* ส่วนที่ 2: เพิ่มคำถาม */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid var(--cream)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--brown)', margin: 0 }}>
                2. จัดการคำถาม
              </h2>
              <span className="badge badge-honey">มีแล้ว 1 ข้อ</span>
            </div>

            {/* กล่องคำถามข้อที่ 1 (ตัวอย่าง) */}
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '16px', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: '700', color: 'var(--brown)' }}>ข้อที่ 1</span>
                <button style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>ลบข้อนี้</button>
              </div>
              
              <div className="form-group">
                <input type="text" className="form-control" placeholder="พิมพ์คำถามของคุณที่นี่..." defaultValue="ผลลัพธ์ของ 3 + 5 × 2 มีค่าเท่ากับเท่าไร?" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* ตัวเลือก ก */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="radio" name="correct1" style={{ accentColor: 'var(--honey)', width: '18px', height: '18px' }} />
                  <input type="text" className="form-control" placeholder="ตัวเลือก ก" defaultValue="16" />
                </div>
                {/* ตัวเลือก ข */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="radio" name="correct1" defaultChecked style={{ accentColor: 'var(--honey)', width: '18px', height: '18px' }} />
                  <input type="text" className="form-control" placeholder="ตัวเลือก ข" defaultValue="13" style={{ border: '2px solid var(--amber)' }} />
                </div>
                {/* ตัวเลือก ค */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="radio" name="correct1" style={{ accentColor: 'var(--honey)', width: '18px', height: '18px' }} />
                  <input type="text" className="form-control" placeholder="ตัวเลือก ค" defaultValue="10" />
                </div>
                {/* ตัวเลือก ง */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="radio" name="correct1" style={{ accentColor: 'var(--honey)', width: '18px', height: '18px' }} />
                  <input type="text" className="form-control" placeholder="ตัวเลือก ง" defaultValue="8" />
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '8px' }}>* เลือกวงกลมด้านหน้าเพื่อกำหนดเป็นคำตอบที่ถูกต้อง</div>
            </div>

            {/* ปุ่มเพิ่มข้อ */}
            <button className="btn btn-outline btn-full" style={{ borderStyle: 'dashed', padding: '16px', color: 'var(--brown)' }}>
              + เพิ่มคำถามใหม่
            </button>
          </div>

        </div>
      </AnimatedPage>
    </>
  );
}

export default CreateExam;