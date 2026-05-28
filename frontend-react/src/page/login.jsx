import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar'; 

function Login() {
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

          <h1 className="auth-title">ยินดีต้อนรับกลับมา</h1>
          <p className="auth-subtitle">เข้าสู่ระบบเพื่อเข้าถึงคลังข้อสอบของคุณ</p>

          {/* Form */}
          <form>
            <div className="form-group">
              <label className="form-label" htmlFor="email">อีเมล</label>
              <input
                className="form-control"
                type="email"
                id="email"
                placeholder="example@email.com"
                defaultValue="somchai@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                รหัสผ่าน
                <Link to="#" style={{ float: 'right', fontSize: '0.8rem', fontWeight: '500' }}>ลืมรหัสผ่าน?</Link>
              </label>
              <input
                className="form-control"
                type="password"
                id="password"
                placeholder="••••••••"
              />
            </div>

            {/* Remember me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <input
                type="checkbox"
                id="remember"
                style={{ accentColor: 'var(--honey)', width: '16px', height: '16px' }}
                defaultChecked
              />
              <label htmlFor="remember" style={{ fontSize: '0.87rem', color: 'var(--muted)', cursor: 'pointer' }}>
                จดจำการเข้าสู่ระบบ
              </label>
            </div>

            {/* ตอนนี้ใช้ Link ไปก่อน เดี๋ยวเราค่อยมาเปลี่ยนเป็นปุ่ม Submit ตอนเชื่อม API หลังบ้านครับ */}
            <Link to="/dashboard" className="btn btn-primary btn-lg btn-full">
              เข้าสู่ระบบ
            </Link>
          </form>

          <hr className="divider" />

          {/* Demo shortcut (mockup only) */}
          <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '4px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--amber)', marginBottom: '6px' }}>
              🔑 Demo Account (Mockup)
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', color: 'var(--muted)' }}>
              <span>somchai@example.com</span>
              <span>password123</span>
            </div>
          </div>

          <p className="auth-footer-link">
            ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิกฟรี</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;