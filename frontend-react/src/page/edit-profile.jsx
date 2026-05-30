import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function EditProfile() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(localStorage.getItem('display_name') || 'ผู้ใช้');
  const [email] = useState(localStorage.getItem('email') || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Theme and language state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'th');

  // Handle save profile
  const handleSave = async () => {
    if (!displayName.trim()) {
      setSuccess('กรุณากรอกชื่อที่ใช้แสดง');
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/me/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ display_name: displayName })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('display_name', displayName);
        setSuccess('บันทึกข้อมูลโปรไฟล์เรียบร้อย! ✨');
        setTimeout(() => navigate('/profile'), 1500);
      } else {
        setSuccess(data.message || 'ไม่สามารถบันทึกได้');
      }
    } catch {
      setSuccess('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    // Apply theme (basic implementation)
    document.documentElement.setAttribute('data-theme', newTheme === 'dark' ? 'dark' : 'light');
  };

  // Handle language change
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '🚨 คำเตือน: คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี?\n\nข้อมูลทั้งหมดจะหายไปและไม่สามารถกู้คืนได้!'
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/me/account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        alert('บัญชีของคุณถูกลบออกจากระบบแล้ว 🐝');
        localStorage.clear();
        navigate('/login');
      } else {
        const data = await res.json();
        alert(data.message || 'ไม่สามารถลบบัญชีได้');
      }
    } catch {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '640px', marginTop: '40px', paddingBottom: '80px' }}>
          <Link to="/dashboard" className="back-link">← กลับไปหน้า Dashboard</Link>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--brown)', marginBottom: '8px' }}>
              Settings
            </h1>
          </div>

          {/* Profile Information */}
          <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--brown)', marginBottom: '24px' }}>
              Profile Information
            </h2>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'var(--amber)', color: '#fff',
                fontSize: '2.5rem', fontWeight: '800',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {displayName.charAt(0) || 'ช'}
              </div>
              <button className="btn btn-outline btn-sm">📸 เปลี่ยนรูปภาพ</button>
            </div>

            {success && (
              <div style={{
                background: success.includes('เรียบร้อย') ? '#dcfce7' : '#fee2e2',
                color: success.includes('เรียบร้อย') ? '#166534' : '#dc2626',
                padding: '12px 16px', borderRadius: '8px', marginBottom: '16px'
              }}>
                {success}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">ชื่อที่ใช้แสดง (Display Name)</label>
              <input
                type="text"
                className="form-control"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="กรอกชื่อที่ใช้แสดง"
              />
            </div>

            <div className="form-group">
              <label className="form-label">อีเมล (ไม่สามารถเปลี่ยนได้)</label>
              <input
                type="email"
                className="form-control"
                value={email}
                disabled
                style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'กำลังบันทึก...' : 'Save changes'}
              </button>
            </div>
          </div>

          {/* Appearance */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--brown)', marginBottom: '16px' }}>
            Appearance
          </h2>

          <div className="card" style={{ padding: '0', marginBottom: '40px', overflow: 'hidden' }}>

            {/* Theme Dropdown */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '24px', borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ fontWeight: '600', color: 'var(--brown)' }}>Theme</div>
              <select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value)}
                style={{
                  background: '#f8fafc', border: 'none', padding: '10px 16px', borderRadius: '8px',
                  fontWeight: '600', color: 'var(--brown)', cursor: 'pointer', outline: 'none'
                }}
              >
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Language Dropdown */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '24px'
            }}>
              <div style={{ fontWeight: '600', color: 'var(--brown)' }}>Language</div>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                style={{
                  background: '#f8fafc', border: 'none', padding: '10px 16px', borderRadius: '8px',
                  fontWeight: '600', color: 'var(--brown)', cursor: 'pointer', outline: 'none'
                }}
              >
                <option value="th">ภาษาไทย (Thai)</option>
                <option value="en">English (UK)</option>
              </select>
            </div>

          </div>

          {/* Danger Zone */}
          <div className="card" style={{ padding: '24px', border: '1px solid #fecaca' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '16px'
            }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                  Delete your account
                </h3>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
                  This will delete all your data and cannot be undone.
                </p>
              </div>

              <button
                style={{
                  background: '#b91c1c', color: 'white', border: 'none', padding: '10px 24px',
                  borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: '0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#991b1b'}
                onMouseOut={(e) => e.target.style.background = '#b91c1c'}
                onClick={handleDeleteAccount}
              >
                Delete account
              </button>
            </div>
          </div>

        </div>
      </AnimatedPage>
    </>
  );
}

export default EditProfile;