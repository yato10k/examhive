import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ id: data.user_id, email: formData.email, display_name: data.display_name, role: data.role }));
      localStorage.setItem('display_name', data.display_name);
      navigate('/dashboard', { state: { display_name: data.display_name } });
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

          <h1 className="auth-title">ยินดีต้อนรับกลับมา</h1>
          <p className="auth-subtitle">เข้าสู่ระบบเพื่อเข้าถึงคลังข้อสอบของคุณ</p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">อีเมล</label>
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
              <label className="form-label" htmlFor="password">
                รหัสผ่าน
                <Link to="#" style={{ float: 'right', fontSize: '0.8rem', fontWeight: '500' }}>ลืมรหัสผ่าน?</Link>
              </label>
              <input
                className="form-control"
                type="password"
                id="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Remember me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <input
                type="checkbox"
                id="remember"
                style={{ accentColor: 'var(--honey)', width: '16px', height: '16px' }}
              />
              <label htmlFor="remember" style={{ fontSize: '0.87rem', color: 'var(--muted)', cursor: 'pointer' }}>
                จดจำการเข้าสู่ระบบ
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
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