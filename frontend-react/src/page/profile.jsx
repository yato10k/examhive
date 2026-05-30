import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ display_name: '', email: '', created_at: '' });
  const [stats, setStats] = useState({ examsCreated: 0, examsTaken: 0, favoritesCount: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch profile and stats from API
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch user profile
        const profileRes = await fetch('/api/me/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = await profileRes.json();

        if (profileRes.ok && profileData) {
          setUser({
            display_name: profileData.display_name || profileData.name || 'ผู้ใช้',
            email: profileData.email || '',
            created_at: profileData.created_at || ''
          });
        }

        // Fetch exam sets for stats
        const examRes = await fetch('/api/exam-sets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const examData = await examRes.json();

        // Fetch attempts for stats
        const attemptRes = await fetch('/api/me/attempts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const attemptData = await attemptRes.json();

        // Calculate stats
        const examsCreated = Array.isArray(examData) ? examData.length : 0;
        const examsTaken = Array.isArray(attemptData) ? attemptData.length : 0;
        const favoritesStr = localStorage.getItem('favorites');
        const favoritesCount = favoritesStr ? JSON.parse(favoritesStr).length : 0;

        setStats({ examsCreated, examsTaken, favoritesCount });
      } catch {
        // Silently handle error
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Get first character for avatar
  const avatarChar = user.display_name?.charAt(0) || 'ช';

  // Format join date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'ไม่ระบุ';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('ออกจากระบบ?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('display_name');
      localStorage.removeItem('email');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '700px', marginTop: '40px' }}>
          <Link to="/dashboard" className="back-link">← กลับไปหน้า Dashboard</Link>

          {/* Profile Header */}
          <div
            className="card"
            style={{
              padding: '40px', textAlign: 'center', marginBottom: '24px',
              position: 'relative', overflow: 'hidden'
            }}
          >
            {/* Decorative top bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '100px',
              background: 'var(--honey)', opacity: '0.2'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                background: 'var(--amber)', color: '#fff',
                fontSize: '3rem', fontWeight: '800',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', border: '4px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {avatarChar}
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--brown)', marginBottom: '4px' }}>
                {loading ? 'กำลังโหลด...' : user.display_name}
              </h1>
              <div className="badge badge-honey" style={{ marginBottom: '16px' }}>
                {user.email || 'ผู้ใช้งานทั่วไป'}
              </div>
            </div>
          </div>

          {/* Stats and Settings */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>

            {/* Personal Info Card */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{
                fontSize: '1.1rem', fontWeight: '700', color: 'var(--brown)',
                marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px'
              }}>
                ข้อมูลส่วนตัว
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>อีเมล</div>
                  <div style={{ fontWeight: '600', color: 'var(--brown)' }}>
                    {loading ? '...' : user.email || 'ไม่ระบุ'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>เข้าร่วมเมื่อ</div>
                  <div style={{ fontWeight: '600', color: 'var(--brown)' }}>
                    {loading ? '...' : formatDate(user.created_at)}
                  </div>
                </div>
              </div>
              <Link
                to="/edit-profile"
                className="btn btn-outline btn-sm"
                style={{ marginTop: '20px', width: '100%', justifyContent: 'center', textDecoration: 'none' }}
              >
                ✏️ แก้ไขข้อมูลส่วนตัว
              </Link>
            </div>

            {/* Activity Overview Card */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{
                fontSize: '1.1rem', fontWeight: '700', color: 'var(--brown)',
                marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px'
              }}>
                ภาพรวมกิจกรรม
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--muted)' }}>ชุดข้อสอบที่สร้าง</span>
                  <span style={{ fontWeight: '800', color: 'var(--brown)' }}>
                    {loading ? '...' : stats.examsCreated}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--muted)' }}>ข้อสอบที่ทำไปแล้ว</span>
                  <span style={{ fontWeight: '800', color: 'var(--brown)' }}>
                    {loading ? '...' : stats.examsTaken}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--muted)' }}>ข้อสอบที่บันทึกไว้</span>
                  <span style={{ fontWeight: '800', color: 'var(--brown)' }}>
                    {loading ? '...' : stats.favoritesCount}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Logout Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              className="btn btn-danger btn-lg"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', cursor: 'pointer' }}
              onClick={handleLogout}
            >
              🚪 ออกจากระบบ (Logout)
            </button>
          </div>

        </div>
      </AnimatedPage>
    </>
  );
}

export default Profile;