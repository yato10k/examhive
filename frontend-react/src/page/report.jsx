import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function Report() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [topic, setTopic] = useState('');
  const [detail, setDetail] = useState('');
  const [link, setLink] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [examCreator, setExamCreator] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch exam info to display
  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch exam metadata
    fetch('/api/exam-sets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const exam = data.find(e => e.id === parseInt(id));
          if (exam) {
            setExamTitle(exam.title || 'ไม่ระบุชื่อ');
            setExamCreator(exam.creator_name || exam.created_by || 'ไม่ระบุผู้สร้าง');
          }
        }
      })
      .catch(() => {});
  }, [id]);

  // Submit report
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic || !detail) {
      setError('กรุณากรอกหัวข้อและรายละเอียด');
      return;
    }

    if (!id) {
      setError('ไม่พบข้อมูลชุดข้อสอบ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          exam_set_id: parseInt(id),
          topic,
          detail,
          reference_link: link
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        setLoading(false);
        return;
      }

      alert('ส่งรายงานสำเร็จ! ขอบคุณที่ช่วยทำให้ EXAMHIVE เป็นสังคมแห่งการเรียนรู้ที่ดีขึ้นครับ 🐝');
      navigate(`/exam-detail/${id}`);
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

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

            {/* Exam Info */}
            {examTitle && (
              <div style={{
                background: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius-sm)',
                marginBottom: '24px', border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: '600', marginBottom: '4px' }}>
                  กำลังรายงานชุดข้อสอบ:
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--brown)' }}>{examTitle}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>สร้างโดย: {examCreator}</div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{
                background: '#fee2e2', color: '#dc2626', padding: '12px 16px',
                borderRadius: '8px', marginBottom: '16px'
              }}>
                {error}
              </div>
            )}

            {/* Report Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  หัวข้อปัญหา <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  className="form-control"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                >
                  <option value="">-- เลือกหัวข้อที่ต้องการรายงาน --</option>
                  <option value="copyright">ละเมิดลิขสิทธิ์ / คัดลอกผลงาน</option>
                  <option value="wrong_content">เนื้อหาผิดพลาด / เฉลยผิด</option>
                  <option value="inappropriate">เนื้อหาไม่เหมาะสม / หยาบคาย</option>
                  <option value="spam">สแปม / โฆษณาแฝง</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  รายละเอียดเพิ่มเติม <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="กรุณาอธิบายปัญหาที่คุณพบ เช่น ข้อสอบนี้คัดลอกมาจากหนังสือเล่มไหน หรือข้อไหนเฉลยผิด..."
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">แนบลิงก์อ้างอิง (ถ้ามี)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <Link
                  to={id ? `/exam-detail/${id}` : '/dashboard'}
                  className="btn btn-outline"
                  style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                >
                  ยกเลิก
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center', background: '#ef4444', borderColor: '#ef4444' }}
                  disabled={loading}
                >
                  {loading ? 'กำลังส่ง...' : 'ส่งรายงาน'}
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