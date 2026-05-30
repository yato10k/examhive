import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data passed from exam-do page
  const { score = 0, total = 0, timeUsed = 0, examId = null, autoSubmitted = false } = location.state || {};

  // Try to fetch more details about this attempt if we have examId
  const [examTitle, setExamTitle] = useState('');

  useEffect(() => {
    if (!examId) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch exam metadata for display
    fetch('/api/exam-sets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const exam = data.find(e => e.id === examId);
          if (exam) setExamTitle(exam.title);
        }
      })
      .catch(() => {});
  }, [examId]);

  // Calculate percentage
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  // Determine grade color and label
  const getGradeInfo = () => {
    if (percent >= 80) return { color: '#16a34a', label: 'ดีเยี่ยม', emoji: '🌟' };
    if (percent >= 60) return { color: '#2563eb', label: 'ดี', emoji: '👍' };
    if (percent >= 40) return { color: '#d97706', label: 'พอใช้', emoji: '💪' };
    return { color: '#dc2626', label: 'ต้องปรับปรุง', emoji: '📚' };
  };

  const grade = getGradeInfo();

  // Format time used
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '600px', marginTop: '40px' }}>

          {/* Auto submit warning */}
          {autoSubmitted && (
            <div style={{
              background: '#fef3c7', color: '#92400e', padding: '12px 16px',
              borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '600',
              textAlign: 'center'
            }}>
              ⏱️ หมดเวลาทำข้อสอบ ระบบบันทึกคำตอบที่เลือกไว้อัตโนมัติ
            </div>
          )}

          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            {/* Grade emoji */}
            <div style={{ fontSize: '4rem', marginBottom: '16px', lineHeight: '1' }}>
              {grade.emoji}
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--brown)', marginBottom: '8px' }}>
              ทำภารกิจสำเร็จ!
            </h1>
            <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>
              {examTitle ? `ชุดข้อสอบ: ${examTitle}` : 'ชุดข้อสอบ'}
            </p>

            {/* Score Ring */}
            <div style={{
              width: '180px', height: '180px', borderRadius: '50%',
              background: `conic-gradient(${grade.color} ${percent}%, var(--cream) 0%)`,
              margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 20px ${grade.color}30`
            }}>
              <div style={{
                width: '150px', height: '150px', borderRadius: '50%', background: '#fff',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: grade.color, lineHeight: '1' }}>
                  {score}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--muted)' }}>
                  จาก {total} ข้อ
                </div>
              </div>
            </div>

            {/* Grade Label */}
            <div style={{
              display: 'inline-block', padding: '8px 24px', borderRadius: '999px',
              background: `${grade.color}15`, color: grade.color, fontWeight: '700',
              fontSize: '1.1rem', marginBottom: '24px'
            }}>
              {grade.label}
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div style={{
                background: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '600', marginBottom: '4px' }}>
                  ความแม่นยำ
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: grade.color }}>
                  {percent}%
                </div>
              </div>
              <div style={{
                background: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '600', marginBottom: '4px' }}>
                  เวลาที่ใช้
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brown)' }}>
                  {formatTime(timeUsed)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {examId && (
                <Link to={`/exam-detail/${examId}`} className="btn btn-primary btn-lg btn-full" style={{ justifyContent: 'center' }}>
                  ดูเฉลยละเอียด
                </Link>
              )}
              <Link to="/dashboard" className="btn btn-outline btn-lg btn-full" style={{ justifyContent: 'center' }}>
                กลับสู่หน้าหลัก
              </Link>
              <button
                className="btn btn-ghost btn-lg btn-full"
                style={{ justifyContent: 'center' }}
                onClick={() => navigate(`/exam-do/${examId}`)}
              >
                🔄 ทำข้อสอบอีกครั้ง
              </button>
            </div>

          </div>

        </div>
      </AnimatedPage>
    </>
  );
}

export default Result;