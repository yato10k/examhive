import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';

function Register() {
  return (
    <>
      <Navbar />

      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="logo-hex" style={{ width: '44px', height: '44px', fontSize: '20px' }}>🐝</div>
            <span className="logo-text" style={{ fontSize: '1.35rem' }}>EXAM<span>HIVE</span></span>
          </div>

          <h1 className="auth-title">สร้างบัญชีใหม่</h1>
          <p className="auth-subtitle">เริ่มสร้างคลังข้อสอบของคุณได้เลย ฟรี!</p>

          {/* Form */}
          <form>
            <div className="form-group">
              <label className="form-label" htmlFor="displayName">ชื่อที่แสดง</label>
              <input
                className="form-control"
                type="text"
                id="displayName"
                placeholder="เช่น สมชาย ใจดี"
              />
              <div className="form-hint">ชื่อนี้จะแสดงให้ผู้อื่นเห็น</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">อีเมล</label>
              <input
                className="form-control"
                type="email"
                id="email"
                placeholder="example@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">รหัสผ่าน</label>
              <input
                className="form-control"
                type="password"
                id="password"
                placeholder="อย่างน้อย 8 ตัวอักษร"
              />
              {/* Password strength bar */}
              <div style={{ marginTop: '8px' }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '60%', background: 'var(--honey)' }}></div>
                </div>
                <div style={{ fontSize: '0.77rem', color: 'var(--amber)', marginTop: '3px', fontWeight: '600' }}>
                  ความปลอดภัย: ปานกลาง
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
              <input
                className="form-control"
                type="password"
                id="confirmPassword"
                placeholder="กรอกรหัสผ่านอีกครั้ง"
              />
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
              <input
                type="checkbox"
                id="terms"
                style={{ accentColor: 'var(--honey)', width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }}
              />
              <label htmlFor="terms" style={{ fontSize: '0.85rem', color: 'var(--muted)', cursor: 'pointer', lineHeight: '1.5' }}>
                ฉันยอมรับ <Link to="#">เงื่อนไขการใช้งาน</Link> และ <Link to="#">นโยบายความเป็นส่วนตัว</Link> ของ EXAMHIVE
              </label>
            </div>

            {/* ปุ่มสมัครสมาชิกชั่วคราวให้ลิงก์ไปหน้า Dashboard ก่อนเชื่อม API */}
            <Link to="/dashboard" className="btn btn-primary btn-lg btn-full">
              สมัครสมาชิก
            </Link>
          </form>

          {/* Benefits */}
          <div style={{ marginTop: '24px', background: 'var(--cream)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--brown)', marginBottom: '8px' }}>
              ✅ สิ่งที่คุณจะได้รับ
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: 0 }}>
              <li style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>🐝 สร้างข้อสอบได้ไม่จำกัด</li>
              <li style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>⏱️ ระบบจับเวลาอัตโนมัติ</li>
              <li style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>📊 ติดตามประวัติคะแนนทุกรอบ</li>
            </ul>
          </div>

          <p className="auth-footer-link">
            มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;