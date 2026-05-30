import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function CreateExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // ==========================================
  // 1. ฐานข้อมูลหมวดวิชา - T-GAT, T-PAT, A-LEVEL
  // ==========================================
  const subjectsData = {
    "T-GAT": [
      "T-GAT1 การสื่อสารภาษาอังกฤษ",
      "T-GAT2 การคิดอย่างมีเหตุผล",
      "T-GAT3 สมรรถนะการทำงาน"
    ],
    "T-PAT": [
      "T-PAT1 ความถนัดแพทย์",
      "T-PAT2 ความถนัดศิลปกรรมศาสตร์",
      "T-PAT3 ความถนัดวิทยาศาสตร์ เทคโนโลยีฯ",
      "T-PAT4 ความถนัดสถาปัตยกรรมศาสตร์",
      "T-PAT5 ความถนัดครุศาสตร์-ศึกษาศาสตร์"
    ],
    "A-LEVEL": [
      "A-LEVEL คณิตศาสตร์ประยุกต์ 1",
      "A-LEVEL คณิตศาสตร์ประยุกต์ 2",
      "A-LEVEL วิทยาศาสตร์ประยุกต์",
      "A-LEVEL ฟิสิกส์",
      "A-LEVEL เคมี",
      "A-LEVEL ชีววิทยา",
      "A-LEVEL ภาษาไทย",
      "A-LEVEL สังคมศึกษา",
      "A-LEVEL ภาษาอังกฤษ"
    ]
  };

  // 2. State สำหรับฟอร์ม
  const [title, setTitle] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [duration, setDuration] = useState(30);
  const [description, setDescription] = useState("");
  const [examSetId, setExamSetId] = useState(null);
  const [fetching, setFetching] = useState(false);

  // 3. State สำหรับคำถาม — supports type: 'mcq' or 'tf'
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: 'mcq',
      stem: '',
      choices: [
        { id: 1, text: '', is_correct: false },
        { id: 2, text: '', is_correct: false },
        { id: 3, text: '', is_correct: false },
        { id: 4, text: '', is_correct: false }
      ]
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 4. Load exam data in edit mode
  useEffect(() => {
    if (!id) return;

    const fetchExamData = async () => {
      const token = localStorage.getItem('token');
      setFetching(true);
      try {
        // ดึงข้อมูลชุดข้อสอบ
        const examRes = await fetch('/api/exam-sets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const examData = await examRes.json();
        const examInfo = Array.isArray(examData) ? examData.find(e => e.id === parseInt(id)) : null;

        if (!examInfo) {
          setError('ไม่พบชุดข้อสอบนี้');
          return;
        }

        // ดึงรายละเอียดคำถาม
        const detailsRes = await fetch(`/api/exam-sets/${id}/details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const questionsData = await detailsRes.json();

        // Set form values
        setTitle(examInfo.title || '');
        setDescription(examInfo.description || '');
        setDuration(examInfo.duration || 30);
        setExamSetId(examInfo.id);

        // แยก mainCategory และ subCategory จาก subject_name
        const subjectName = examInfo.subject_name || '';
        const foundMain = Object.keys(subjectsData).find(main =>
          subjectsData[main].some(sub => sub === subjectName)
        );
        if (foundMain) {
          setMainCategory(foundMain);
          setSubCategory(subjectName);
        }

        // Set questions
        const safeQuestionsData = Array.isArray(questionsData) ? questionsData : (questionsData.questions || []);
        if (safeQuestionsData.length > 0) {
          setQuestions(safeQuestionsData.map((q, idx) => {
            const questionType = q.type === 'tf' ? 'tf' : 'mcq';
            const choices = q.choices && q.choices.length > 0
              ? q.choices.map((c, cIdx) => ({
                  id: cIdx + 1,
                  text: c.text || '',
                  is_correct: Boolean(c.is_correct)
                }))
              : questionType === 'tf'
                ? [
                    { id: 1, text: 'True', is_correct: false },
                    { id: 2, text: 'False', is_correct: false }
                  ]
                : [
                    { id: 1, text: '', is_correct: false },
                    { id: 2, text: '', is_correct: false },
                    { id: 3, text: '', is_correct: false },
                    { id: 4, text: '', is_correct: false }
                  ];
            return {
              id: idx + 1,
              type: questionType,
              stem: q.stem || '',
              choices
            };
          }));
        }
      } catch {
        setError('ไม่สามารถดึงข้อมูลชุดข้อสอบได้');
      } finally {
        setFetching(false);
      }
    };

    fetchExamData();
  }, [id]);

  // 5. Handler functions
  const handleQuestionChange = (questionId, field, value) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const handleChoiceChange = (questionId, choiceId, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id !== questionId) return q;
      return {
        ...q,
        choices: q.choices.map(c => {
          if (c.id !== choiceId) return c;
          if (field === 'is_correct' && value === true) {
            return { ...c, is_correct: true };
          }
          return { ...c, [field]: value };
        })
      };
    }));
  };

  // Change question type
  const handleQuestionTypeChange = (questionId, newType) => {
    setQuestions(questions.map(q => {
      if (q.id !== questionId) return q;
      if (newType === 'tf') {
        return {
          ...q,
          type: 'tf',
          choices: [
            { id: 1, text: 'True', is_correct: false },
            { id: 2, text: 'False', is_correct: false }
          ]
        };
      } else {
        return {
          ...q,
          type: 'mcq',
          choices: [
            { id: 1, text: '', is_correct: false },
            { id: 2, text: '', is_correct: false },
            { id: 3, text: '', is_correct: false },
            { id: 4, text: '', is_correct: false }
          ]
        };
      }
    }));
  };

  // Add new question with type selector
  const addQuestion = (type = 'mcq') => {
    const newId = Math.max(...questions.map(q => q.id), 0) + 1;
    const newQuestion = {
      id: newId,
      type,
      stem: '',
      choices: type === 'tf'
        ? [
            { id: 1, text: 'True', is_correct: false },
            { id: 2, text: 'False', is_correct: false }
          ]
        : [
            { id: 1, text: '', is_correct: false },
            { id: 2, text: '', is_correct: false },
            { id: 3, text: '', is_correct: false },
            { id: 4, text: '', is_correct: false }
          ]
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId) => {
    if (questions.length === 1) {
      setError('ต้องมีอย่างน้อย 1 คำถาม');
      return;
    }
    setQuestions(questions.filter(q => q.id !== questionId));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('กรุณากรอกชื่อชุดข้อสอบ');
      return;
    }

    if (!isEditMode) {
      if (!mainCategory) {
        setError('กรุณาเลือกหมวดวิชาหลัก');
        return;
      }
      if (!subCategory) {
        setError('กรุณาเลือกวิชาย่อย');
        return;
      }
    }

    // Validate questions
    const validQuestions = questions.filter(q => q.stem.trim() !== '');
    if (validQuestions.length === 0) {
      setError('กรุณาเพิ่มอย่างน้อย 1 คำถาม');
      return;
    }

    // Check each question has at least one correct answer
    for (let i = 0; i < validQuestions.length; i++) {
      const q = validQuestions[i];
      const hasCorrect = q.choices.some(c => c.is_correct);
      if (!hasCorrect) {
        setError(`คำถามข้อที่ ${i + 1} ยังไม่มีคำตอบที่ถูกต้อง`);
        return;
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = isEditMode ? `/api/exam-sets/${id}` : '/api/exam-sets';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          subject_name: subCategory,
          duration,
          questions: validQuestions.map((q, qIdx) => ({
            stem: q.stem,
            type: q.type,
            choices: q.type === 'tf'
              ? q.choices.map(c => ({ text: c.text, is_correct: c.is_correct }))
              : q.choices.filter(c => c.text.trim() !== '').map(c => ({
                  text: c.text,
                  is_correct: c.is_correct
                }))
          }))
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'เกิดข้อผิดพลาด');
        return;
      }

      navigate('/dashboard');
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <>
        <Navbar isLoggedIn={true} />
        <AnimatedPage>
          <div className="page-wrapper" style={{ textAlign: 'center', padding: '100px 20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🐝</div>
            <p>กำลังดึงข้อมูล...</p>
          </div>
        </AnimatedPage>
      </>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '800px', paddingBottom: '80px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <Link to="/dashboard" className="back-link">← ยกเลิกและกลับ</Link>
              <h1 className="page-title" style={{ marginTop: '8px' }}>
                {isEditMode ? 'แก้ไขชุดข้อสอบ ✏️' : 'สร้างชุดข้อสอบใหม่ 📝'}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" onClick={handleSubmit} disabled={loading}>
                {loading ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง'}
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                เผยแพร่ข้อสอบ
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {/* ส่วนที่ 1: ข้อมูลทั่วไปของชุดข้อสอบ */}
          <div className="card mb-24" style={{ padding: '32px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--brown)', marginBottom: '20px', borderBottom: '2px solid var(--cream)', paddingBottom: '12px' }}>
              1. ข้อมูลทั่วไป
            </h2>

            <div className="form-group">
              <label className="form-label">ชื่อชุดข้อสอบ</label>
              <input
                type="text"
                className="form-control"
                placeholder="เช่น ข้อสอบจำลอง TGAT1 ปี 67"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Dropdown 2 ชั้น T-GAT, T-PAT, A-LEVEL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">หมวดวิชาหลัก</label>
                <select
                  className="form-control"
                  value={mainCategory}
                  onChange={(e) => {
                    setMainCategory(e.target.value);
                    setSubCategory("");
                  }}
                >
                  <option value="">-- เลือกหมวดหลัก --</option>
                  {Object.keys(subjectsData).map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">วิชาย่อย</label>
                <select
                  className="form-control"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!mainCategory}
                  style={{
                    backgroundColor: !mainCategory ? '#f5f5f5' : 'white',
                    cursor: !mainCategory ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="">-- เลือกวิชาย่อย --</option>
                  {mainCategory && subjectsData[mainCategory].map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ maxWidth: '50%' }}>
              <label className="form-label">เวลาที่ใช้ทำ (นาที)</label>
              <input
                type="number"
                className="form-control"
                placeholder="เช่น 30"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">คำอธิบายชุดข้อสอบ</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="อธิบายสั้นๆ ว่าข้อสอบชุดนี้เกี่ยวกับอะไร..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* ส่วนที่ 2: จัดการคำถาม */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid var(--cream)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--brown)', margin: 0 }}>
                2. จัดการคำถาม
              </h2>
              <span className="badge badge-honey">มีแล้ว {questions.length} ข้อ</span>
            </div>

            {questions.map((question, qIndex) => (
              <div key={question.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '16px', background: 'var(--bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--brown)' }}>ข้อที่ {qIndex + 1}</span>
                    {/* Question Type Selector */}
                    <select
                      value={question.type}
                      onChange={(e) => handleQuestionTypeChange(question.id, e.target.value)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'white',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'var(--brown)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="mcq">ปรนัย (MCQ)</option>
                      <option value="tf">จริง/เท็จ (T/F)</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                  >
                    ลบข้อนี้
                  </button>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="พิมพ์คำถามของคุณที่นี่..."
                    value={question.stem}
                    onChange={(e) => handleQuestionChange(question.id, 'stem', e.target.value)}
                  />
                </div>

                {/* MCQ: 4 choices */}
                {question.type === 'mcq' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {question.choices.map((choice, cIndex) => (
                      <div key={choice.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={choice.is_correct}
                          onChange={() => handleChoiceChange(question.id, choice.id, 'is_correct', true)}
                          style={{ accentColor: 'var(--honey)', width: '18px', height: '18px', flexShrink: 0 }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`ตัวเลือก ${['ก', 'ข', 'ค', 'ง'][cIndex]}`}
                          value={choice.text}
                          onChange={(e) => handleChoiceChange(question.id, choice.id, 'text', e.target.value)}
                          style={choice.is_correct ? { border: '2px solid var(--amber)' } : {}}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* T/F: True/False options */}
                {question.type === 'tf' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {question.choices.map((choice, cIndex) => {
                      const labels = ['True ✓', 'False ✗'];
                      const colors = ['#16a34a', '#dc2626'];
                      return (
                        <div
                          key={choice.id}
                          onClick={() => handleChoiceChange(question.id, choice.id, 'is_correct', true)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '14px 20px',
                            border: `2px solid ${choice.is_correct ? colors[cIndex] : 'var(--border)'}`,
                            background: choice.is_correct ? `${colors[cIndex]}15` : 'white',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            border: `2px solid ${choice.is_correct ? colors[cIndex] : 'var(--border)'}`,
                            background: choice.is_correct ? colors[cIndex] : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '0.9rem', fontWeight: '800',
                            flexShrink: 0
                          }}>
                            {choice.is_correct ? '✓' : ''}
                          </div>
                          <div style={{
                            fontSize: '1.1rem', fontWeight: '700',
                            color: choice.is_correct ? colors[cIndex] : 'var(--brown)'
                          }}>
                            {labels[cIndex]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '8px' }}>
                  {question.type === 'mcq'
                    ? '* เลือกวงกลมด้านหน้าเพื่อกำหนดเป็นคำตอบที่ถูกต้อง'
                    : '* คลิกเลือกคำตอบที่ถูกต้อง'}
                </div>
              </div>
            ))}

            {/* Add Question Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, padding: '12px', color: 'var(--brown)', borderStyle: 'dashed' }}
                onClick={() => addQuestion('mcq')}
              >
                + เพิ่มคำถามปรนัย (MCQ)
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, padding: '12px', color: 'var(--brown)', borderStyle: 'dashed' }}
                onClick={() => addQuestion('tf')}
              >
                + เพิ่มคำถามจริง/เท็จ (T/F)
              </button>
            </div>
          </div>

        </div>
      </AnimatedPage>
    </>
  );
}

export default CreateExam;