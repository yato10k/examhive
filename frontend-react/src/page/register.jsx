import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.display_name || !formData.email || !formData.password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (formData.password.length < 8) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          display_name: formData.display_name
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'เกิดข้อผิดพลาด');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('display_name', data.user.display_name);
      navigate('/dashboard', { state: { display_name: data.user.display_name } });
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="display_name">Display Name</label>
              <input
                className="form-control"
                type="text"
                id="display_name"
                placeholder="เช่น สมชาย ใจดี"
                value={formData.display_name}
                onChange={handleChange}
              />
              <div className="form-hint">ชื่อนี้จะแสดงให้ผู้อื่นเห็น</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                className="form-control"
                type="email"
                id="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                className="form-control"
                type="password"
                id="password"
                placeholder="อย่างน้อย 8 ตัวอักษร"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="form-control"
                type="password"
                id="confirmPassword"
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
              <input
                type="checkbox"
                id="terms"
                style={{ accentColor: 'var(--honey)', width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }}
                required
              />
              <label htmlFor="terms" style={{ fontSize: '0.85rem', color: 'var(--muted)', cursor: 'pointer', lineHeight: '1.5' }}>
                ฉันยอมรับ <Link to="#">เงื่อนไขการใช้งาน</Link> และ <Link to="#">นโยบายความเป็นส่วนตัว</Link> ของ EXAMHIVE
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
            </button>
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