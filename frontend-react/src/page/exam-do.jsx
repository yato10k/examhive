import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function ExamDo() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Exam data state
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false); // Changed from true to false
  const [error, setError] = useState('');

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: choiceIndex (0-3) }
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [submitted, setSubmitted] = useState(false);

  // Timer ref
  useEffect(() => {
    if (!id) return;

    const fetchExamData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      setLoading(true);
      try {
        // Fetch exam details with questions
        const res = await fetch(`/api/exam-sets/${id}/details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'ไม่สามารถดึงข้อมูลข้อสอบได้');
          setLoading(false);
          return;
        }

        // Handle both array and { questions: [] } formats
        const questionsData = Array.isArray(data) ? data : (data.questions || []);

        // Also fetch exam metadata for duration
        const examRes = await fetch('/api/exam-sets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const examList = await examRes.json();
        const examMeta = Array.isArray(examList)
          ? examList.find(e => e.id === parseInt(id))
          : null;

        // Use duration from exam metadata, default to 30 if not found
        const duration = examMeta?.duration || 30;

        setExam({ title: examMeta?.title || 'ข้อสอบ', duration, subject_name: examMeta?.subject_name });
        setQuestions(questionsData);
        setTimeLeft(duration * 60);
        setLoading(false);
      } catch {
        setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
        setLoading(false);
      }
    };

    fetchExamData();
  }, [id, navigate]);

  // Timer countdown
  useEffect(() => {
    if (loading || submitted || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleSubmit(true); // auto-submit when time runs out
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, submitted, timeLeft]);

  // Handle answer selection
  const handleSelect = (choiceIndex) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: choiceIndex
    }));
  };

  // Navigate between questions
  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  // Submit exam
  const handleSubmit = useCallback(async (auto = false) => {
    if (submitted) return;
    setSubmitted(true);

    // Calculate score
    let correct = 0;
    questions.forEach(q => {
      const selectedIdx = answers[q.id];
      if (selectedIdx !== undefined && q.choices && q.choices[selectedIdx]?.is_correct) {
        correct++;
      }
    });

    const score = correct;
    const total = questions.length;
    const timeUsed = (exam?.duration || 30) * 60 - timeLeft;

    try {
      const token = localStorage.getItem('token');

      // Submit attempt to backend
      await fetch('/api/me/attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          exam_set_id: parseInt(id),
          score,
          total,
          time_used: timeUsed
        })
      });

      // Navigate to result page with data
      navigate('/result', {
        state: {
          examId: parseInt(id),
          score,
          total,
          timeUsed,
          autoSubmitted: auto
        }
      });
    } catch {
      // Still navigate even if API fails
      navigate('/result', {
        state: {
          examId: parseInt(id),
          score,
          total,
          timeUsed,
          autoSubmitted: auto
        }
      });
    }
  }, [submitted, questions, answers, id, timeLeft, exam, navigate]);

  // Format time display
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Navbar isLoggedIn={true} />
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div style={{ fontSize: '2rem' }}>🐝</div>
          <p>กำลังโหลดข้อสอบ...</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Navbar isLoggedIn={true} />
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚠️</div>
          <p>{error || 'ไม่พบคำถามในชุดข้อสอบนี้'}</p>
          <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '16px' }}>
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* SLIM NAVBAR */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 24px', background: '#fff', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              if (window.confirm('ออกจากข้อสอบ? คะแนนจะไม่ถูกบันทึก')) {
                navigate('/dashboard');
              }
            }}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' }}
          >
            ✖ ออก
          </button>
          <div style={{ height: '24px', width: '1px', background: 'var(--border)' }}></div>
          <div style={{ fontWeight: '700', color: 'var(--brown)', fontSize: '0.95rem' }}>
            {exam?.title || 'ข้อสอบ'}
          </div>
        </div>

        {/* Timer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: timeLeft < 60 ? '#fee2e2' : 'var(--cream)',
          padding: '6px 16px', borderRadius: '999px',
          border: `1px solid ${timeLeft < 60 ? '#fca5a5' : 'var(--border)'}`,
          transition: 'all 0.3s'
        }}>
          <span style={{ fontSize: '1.1rem' }}>⏱️</span>
          <span style={{
            fontWeight: '800', fontSize: '1.1rem',
            fontVariantNumeric: 'tabular-nums',
            color: timeLeft < 60 ? '#dc2626' : 'var(--amber)'
          }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '800px', marginTop: '20px' }}>

          {/* PROGRESS BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--brown)' }}>
              ข้อ {currentIndex + 1} จาก {totalQuestions}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--muted)' }}>
              ทำไปแล้ว {answeredCount}/{totalQuestions} ข้อ
            </span>
          </div>
          <div className="progress-bar" style={{ marginBottom: '32px', height: '10px' }}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>

          {/* QUESTION CARD */}
          <div className="card" style={{ padding: '32px 40px', marginBottom: '24px' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--brown)', marginBottom: '24px', lineHeight: '1.6' }}>
              {currentIndex + 1}. {currentQ.stem || 'ไม่มีโจทย์คำถาม'}
            </div>

            {/* CHOICES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentQ.choices && currentQ.choices.map((choice, idx) => {
                const labels = ['ก', 'ข', 'ค', 'ง'];
                const isSelected = answers[currentQ.id] === idx;
                const isTF = currentQ.type === 'tf';

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    style={{
                      padding: '16px 20px',
                      border: isSelected ? '2px solid var(--amber)' : '2px solid var(--border)',
                      background: isSelected ? 'var(--cream)' : '#fff',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex', gap: '16px', alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isTF ? (
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: isSelected ? (idx === 0 ? '#16a34a' : '#dc2626') : 'var(--bg)',
                        color: isSelected ? '#fff' : 'var(--brown)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '700', fontSize: '0.9rem', flexShrink: 0
                      }}>
                        {idx === 0 ? 'T' : 'F'}
                      </div>
                    ) : (
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: isSelected ? 'var(--amber)' : 'var(--bg)',
                        color: isSelected ? '#fff' : 'var(--brown)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '700', flexShrink: 0
                      }}>
                        {labels[idx]}
                      </div>
                    )}
                    <div style={{ fontSize: '1.05rem', color: 'var(--brown)', fontWeight: '500' }}>
                      {isTF ? (idx === 0 ? 'True' : 'False') : choice.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QUESTION NAVIGATION */}
          <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '12px', fontWeight: '600' }}>
              ไปยังข้อ:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id || idx}
                    onClick={() => goToQuestion(idx)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      border: isCurrent ? '2px solid var(--amber)' : '1px solid var(--border)',
                      background: isAnswered ? 'var(--honey)' : isCurrent ? 'var(--cream)' : '#fff',
                      color: isAnswered ? '#fff' : 'var(--brown)',
                      fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn btn-outline"
              onClick={() => goToQuestion(currentIndex - 1)}
              disabled={currentIndex === 0}
              style={{ opacity: currentIndex === 0 ? 0.5 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
            >
              ← ข้อก่อนหน้า
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => goToQuestion(currentIndex + 1)}
                style={{ padding: '12px 32px' }}
              >
                ข้อถัดไป →
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => handleSubmit(false)}
                style={{ padding: '12px 32px', background: '#16a34a' }}
              >
                ✓ ส่งข้อสอบ
              </button>
            )}
          </div>

        </div>
      </AnimatedPage>
    </div>
  );
}

export default ExamDo;