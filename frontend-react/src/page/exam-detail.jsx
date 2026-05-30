import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function ExamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExamData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false); // 🔴 แก้ไข: สั่งหยุด Loading ก่อนเด้งไปหน้า Login
        navigate('/login');
        return;
      }

      try {
        // 1. ดึงรายละเอียดชุดข้อสอบ (คำถาม)
        const detailsRes = await fetch(`/api/exam-sets/${id}/details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const detailsData = await detailsRes.json();

        if (!detailsRes.ok) {
          setError(detailsData.message || 'ไม่สามารถดึงข้อมูลคำถามได้');
          setLoading(false);
          return;
        }

        // 2. ดึงข้อมูลชุดข้อสอบหลัก
        const examRes = await fetch(`/api/exam-sets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const examData = await examRes.json();
        
        // 🔴 แก้ไข: ป้องกันกรณี examData ไม่ใช่ Array
        const safeExamData = Array.isArray(examData) ? examData : (examData.data || []);
        const examInfo = safeExamData.find(e => e.id === parseInt(id)) || null;

        // 3. ดึงประวัติการทำข้อสอบ
        const attemptsRes = await fetch('/api/me/attempts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const attemptsData = await attemptsRes.json();
        
        // 🔴 แก้ไข: ป้องกันกรณี attemptsData ไม่ใช่ Array
        const safeAttempts = Array.isArray(attemptsData) ? attemptsData : (attemptsData.data || []);
        const examAttempts = safeAttempts.filter(a => a.exam_set_id === parseInt(id));

        // 🔴 แก้ไข: ป้องกันคำถามไม่ใช่ Array (จุดที่ทำให้หน้าขาว)
        const safeQuestions = Array.isArray(detailsData) ? detailsData : (detailsData.questions || []);

        setExam(examInfo);
        setQuestions(safeQuestions);
        setAttempts(examAttempts);
        
      } catch (error) {
        setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ (กรุณาเช็กว่าเปิด Backend หรือยัง)');
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/exam-sets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        alert('ลบชุดข้อสอบเรียบร้อยแล้ว');
        navigate('/dashboard');
      } else {
        const data = await res.json();
        alert(data.message || 'ไม่สามารถลบชุดข้อสอบได้');
      }
    } catch {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar isLoggedIn={true} />
        <AnimatedPage>
          <div className="page-wrapper" style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--brown)', fontWeight: 'bold' }}>
            <span style={{ fontSize: '2rem' }}>🐝</span><br/>
            กำลังดึงข้อมูลข้อสอบ...
          </div>
        </AnimatedPage>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar isLoggedIn={true} />
        <AnimatedPage>
          <div className="page-wrapper" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '24px', borderRadius: '12px', border: '1px solid #fca5a5', maxWidth: '500px', margin: '0 auto' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚠️</div>
              <h3 style={{ margin: '0 0 8px 0' }}>เกิดข้อผิดพลาด</h3>
              <p style={{ margin: 0 }}>{error}</p>
            </div>
            <Link to="/all-exams" className="btn btn-primary" style={{ marginTop: '24px' }}>
              กลับไปคลังข้อสอบ
            </Link>
          </div>
        </AnimatedPage>
      </>
    );
  }

  // ป้องกัน examInfo เป็น null แล้ว error
  const examInfo = exam || {
    title: 'ไม่พบชื่อข้อสอบ',
    subject_name: 'ไม่พบหมวดหมู่',
    description: 'ไม่พบคำอธิบาย',
    duration: 0
  };
  
  const questionCount = questions.length;
  const averageScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.score / a.total) * 100, 0) / attempts.length)
    : 0;

  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper">
          <Link to="/all-exams" className="back-link">← กลับไปคลังข้อสอบ</Link>

          {/* TWO-COLUMN LAYOUT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px', alignItems: 'start', marginTop: '16px' }}>

            {/* LEFT COLUMN */}
            <div>
              {/* EXAM INFO CARD */}
              <div className="card mb-24" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                  <div className="exam-card-icon" style={{ width: '64px', height: '64px', fontSize: '32px', flexShrink: 0, background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px' }}>📝</div>
                  <div style={{ flex: 1 }}>
                    <span className="badge badge-honey" style={{ marginBottom: '8px' }}>{examInfo.subject_name}</span>
                    <h1 className="page-title" style={{ fontSize: '1.8rem', marginTop: '8px', marginBottom: '8px' }}>{examInfo.title}</h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                      {examInfo.description}
                    </p>
                  </div>
                </div>

                {/* Meta info chips */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 16px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--brown)' }}>
                    🧩 {questionCount} คำถาม
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 16px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--brown)' }}>
                    ⏱️ {examInfo.duration} นาที
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 16px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--brown)' }}>
                    🔄 ปรนัย MCQ
                  </div>
                </div>

                {/* Action buttons */}
                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link to={`/exam-do/${id}`} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '1.05rem' }}>▶ เริ่มทำข้อสอบ</Link>
                  
                  {/* ปุ่มแก้ไข: Hover แล้วเป็นสีเหลืองอ่อน */}
                  <Link 
                    to={`/edit-exam/${id}`} 
                    className="btn" 
                    style={{ 
                      padding: '10px 24px', 
                      background: 'transparent',
                      border: '1.5px solid var(--amber)',
                      color: 'var(--brown)',
                      fontWeight: '600',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'background-color 0.4s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    ✏️ แก้ไข
                  </Link>
                  
                  {/* ปุ่มลบ: Hover แล้วเป็นสีแดงอ่อน */}
                  <button
                    className="btn"
                    style={{ 
                      padding: '10px 24px',
                      background: 'transparent',
                      border: '1.5px solid #fca5a5', 
                      color: '#dc2626',
                      fontWeight: '600',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.4s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => {
                      if (window.confirm('🚨 ยืนยันการลบชุดข้อสอบนี้? ข้อมูลจะหายไปถาวร')) {
                        handleDelete();
                      }
                    }}
                  >
                    🗑️ ลบ
                  </button>
                </div>
              </div>

              {/* QUESTION LIST */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--brown)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📋</span> รายการคำถามทั้งหมด ({questionCount} ข้อ)
                </h3>
                
                <div className="card" style={{ padding: '24px' }}>
                  {questions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
                      <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '12px' }}>📭</div>
                      ไม่มีคำถามในชุดข้อสอบนี้
                    </div>
                  ) : (
                    questions.map((q, index) => (
                      <div key={q.id || index} style={{ display: 'flex', gap: '16px', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '12px', background: 'var(--bg)' }}>
                        <div style={{ width: '32px', height: '32px', background: 'var(--cream)', color: 'var(--brown)', fontWeight: '800', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--brown)', marginBottom: '8px', fontSize: '1.05rem' }}>{q.stem || 'ไม่มีโจทย์คำถาม'}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
                              {q.type === 'mcq' ? 'MCQ' : q.type === 'tf' ? 'จริง/เท็จ' : 'ปรนัย'}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                              {q.choices ? q.choices.length : 0} ตัวเลือก
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div style={{ position: 'sticky', top: '24px' }}>
              
              {/* Score Summary */}
              <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ fontWeight: 800, color: 'var(--brown)', marginBottom: '20px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📈 สถิติของคุณ
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ textAlign: 'center', padding: '16px', background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--amber)' }}>{attempts.length}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>รอบที่ทำ</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px', background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16a34a' }}>{averageScore}%</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>คะแนนเฉลี่ย</div>
                  </div>
                </div>

                {attempts.length > 0 && (
                  <>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }}></div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brown)', marginBottom: '12px' }}>
                      คะแนนล่าสุด
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {attempts.slice(0, 5).map((attempt, index) => {
                        const percent = (attempt.score / attempt.total) * 100;
                        const color = percent >= 80 ? '#16a34a' : percent >= 60 ? 'var(--amber)' : '#dc2626';
                        
                        return (
                          <div key={attempt.id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '600' }}>รอบที่ {attempts.length - index}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '80px', height: '8px', background: 'var(--cream)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${percent}%`, height: '100%', background: color, borderRadius: '4px' }}></div>
                              </div>
                              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: color, minWidth: '36px', textAlign: 'right' }}>
                                {attempt.score}/{attempt.total}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Share */}
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--brown)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🔗 แชร์ข้อสอบ
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    className="form-control"
                    style={{ fontSize: '0.85rem', padding: '10px' }}
                    type="text"
                    defaultValue={`examhive.app/exam/${id}`}
                    readOnly
                  />
                  <button
                    className="btn btn-outline"
                    style={{ padding: '0 16px' }}
                    onClick={() => {
                      navigator.clipboard.writeText(`examhive.app/exam/${id}`);
                      alert('คัดลอกลิงก์เรียบร้อยแล้ว!');
                    }}
                  >
                    คัดลอก
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </AnimatedPage>
    </>
  );
}

export default ExamDetail;