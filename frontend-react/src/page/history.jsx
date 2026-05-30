import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch attempt history from API
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/me/attempts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'ไม่สามารถดึงประวัติได้');
          setLoading(false);
          return;
        }

        setHistoryData(Array.isArray(data) ? data : []);
      } catch {
        setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Calculate stats from history
  const totalAttempts = historyData.length;
  const averageScore = totalAttempts > 0
    ? Math.round(historyData.reduce((sum, item) => sum + (item.score / item.total) * 100, 0) / totalAttempts)
    : 0;

  // Estimate total time from history (sum of time_used)
  const totalTimeSeconds = historyData.reduce((sum, item) => sum + (item.time_used || 0), 0);
  const totalMinutes = Math.round(totalTimeSeconds / 60);

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Get status info based on score percentage
  const getStatusInfo = (score, total) => {
    const percent = (score / total) * 100;
    if (percent >= 80) return { label: 'ดีเยี่ยม', color: '#16a34a' };
    if (percent >= 60) return { label: 'ดี', color: '#2563eb' };
    if (percent >= 40) return { label: 'พอใช้', color: '#d97706' };
    return { label: 'ต้องปรับปรุง', color: '#dc2626' };
  };

  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '900px' }}>

          <div className="page-header" style={{ marginBottom: '32px' }}>
            <div>
              <h1 className="page-title">ประวัติคะแนน 📊</h1>
              <p className="page-subtitle">ดูสถิติและพัฒนาการทำข้อสอบของคุณทั้งหมด</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px', marginBottom: '32px'
          }}>
            <div className="card" style={{
              padding: '24px', textAlign: 'center',
              background: 'var(--cream)', border: '2px solid var(--honey)'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--brown)', fontWeight: '600', marginBottom: '8px' }}>
                ข้อสอบที่ทำแล้วทั้งหมด
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--brown)', lineHeight: '1' }}>
                {totalAttempts} <span style={{ fontSize: '1rem', fontWeight: '600' }}>ชุด</span>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: '600', marginBottom: '8px' }}>
                คะแนนเฉลี่ยรวม
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#16a34a', lineHeight: '1' }}>
                {averageScore}%
              </div>
            </div>

            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: '600', marginBottom: '8px' }}>
                เวลาที่ใช้ฝึกฝนรวม
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--amber)', lineHeight: '1' }}>
                {totalMinutes} <span style={{ fontSize: '1rem', fontWeight: '600' }}>นาที</span>
              </div>
            </div>
          </div>

          {/* History List */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--brown)', marginBottom: '16px' }}>
            กิจกรรมล่าสุด
          </h2>

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🐝</div>
              <p style={{ color: 'var(--muted)' }}>กำลังโหลด...</p>
            </div>
          )}

          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          {!loading && historyData.length === 0 && (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
              <h3 style={{ color: 'var(--brown)', marginBottom: '8px' }}>ยังไม่มีประวัติการทำข้อสอบ</h3>
              <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
                เริ่มทำข้อสอบเพื่อติดตามพัฒนาการของคุณ!
              </p>
              <Link to="/dashboard" className="btn btn-primary">ไปที่คลังข้อสอบ</Link>
            </div>
          )}

          {!loading && historyData.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {historyData.map((item) => {
                const status = getStatusInfo(item.score, item.total);
                const accuracy = item.total > 0 ? Math.round((item.score / item.total) * 100) : 0;

                // Format time used
                const formatTime = (seconds) => {
                  if (!seconds) return '—';
                  const m = Math.floor(seconds / 60);
                  const s = seconds % 60;
                  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                };

                return (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      padding: '20px', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', flexWrap: 'wrap', gap: '16px'
                    }}
                  >
                    {/* Exam Info */}
                    <div style={{ flex: '1', minWidth: '250px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span className="badge badge-honey">{item.subject_name || 'ไม่ระบุ'}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>📅 {formatDate(item.created_at)}</span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--brown)', margin: 0 }}>
                        {item.exam_title || item.title || 'ข้อสอบ'}
                      </h3>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>คะแนน</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--brown)' }}>
                          {item.score}/{item.total}
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>ความแม่นยำ</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: status.color }}>
                          {accuracy}%
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>เวลาที่ใช้</div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--brown)' }}>
                          ⏱️ {formatTime(item.time_used)}
                        </div>
                      </div>

                      <div style={{
                        padding: '6px 12px', borderRadius: '999px',
                        background: `${status.color}15`, color: status.color,
                        fontSize: '0.8rem', fontWeight: '700'
                      }}>
                        {status.label}
                      </div>
                    </div>

                    {/* Action */}
                    {item.exam_set_id && (
                      <div style={{ paddingLeft: '16px', borderLeft: '1px solid var(--border)' }}>
                        <Link to={`/exam-detail/${item.exam_set_id}`} className="btn btn-outline btn-sm">
                          ดูเฉลย
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </AnimatedPage>
    </>
  );
}

export default History;