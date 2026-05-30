import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function Favorite() {
  // Favorites stored as array of exam IDs
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch all exams and user's favorites on mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }

      try {
        // Fetch all exam sets
        const examRes = await fetch('/api/exam-sets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const examData = await examRes.json();

        if (Array.isArray(examData)) {
          setExams(examData);

          // Fetch user's favorites if endpoint exists
          try {
            const favRes = await fetch('/api/me/favorites', {
              headers: { Authorization: `Bearer ${token}` }
            });
            const favData = await favRes.json();
            if (Array.isArray(favData)) {
              setFavoriteIds(favData.map(f => f.exam_set_id || f.id));
            }
          } catch {
            // If /api/me/favorites doesn't exist, use localStorage or empty
            const stored = localStorage.getItem('favorites');
            if (stored) {
              setFavoriteIds(JSON.parse(stored));
            }
          }
        }
      } catch {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle favorite
  const toggleFavorite = async (e, examId) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    const isFav = favoriteIds.includes(examId);

    // Optimistic UI update
    if (isFav) {
      setFavoriteIds(prev => prev.filter(id => id !== examId));
    } else {
      setFavoriteIds(prev => [...prev, examId]);
    }

    // Persist to localStorage as backup
    const newFavs = isFav
      ? favoriteIds.filter(id => id !== examId)
      : [...favoriteIds, examId];
    localStorage.setItem('favorites', JSON.stringify(newFavs));

    // Try to sync with backend
    try {
      const method = isFav ? 'DELETE' : 'POST';
      await fetch(`/api/me/favorites/${examId}`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // Silently fail - localStorage already updated
    }
  };

  // Filter exams to only show favorites
  const favoriteExams = exams.filter(exam =>
    favoriteIds.includes(exam.id) &&
    (exam.title?.toLowerCase().includes(search.toLowerCase()) ||
     exam.description?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper">

          <div className="page-header" style={{ marginBottom: '32px' }}>
            <div>
              <h1 className="page-title">ข้อสอบที่บันทึกไว้</h1>
              <p className="page-subtitle">ชุดข้อสอบที่คุณชื่นชอบและเก็บไว้ฝึกซ้อมในภายหลัง</p>
            </div>

            {/* Search */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหาชุดข้อสอบ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '250px' }}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🐝</div>
              <p style={{ color: 'var(--muted)' }}>กำลังโหลด...</p>
            </div>
          ) : favoriteExams.length === 0 ? (
            /* Empty State */
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--brown)', marginBottom: '8px' }}>
                {search ? 'ไม่พบข้อสอบที่ค้นหา' : 'ยังไม่มีข้อสอบที่บันทึกไว้'}
              </h2>
              <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
                {search ? 'ลองเปลี่ยนคำค้นหา' : 'ลองค้นหาข้อสอบที่คุณสนใจแล้วกดรูปหัวใจเพื่อบันทึกเก็บไว้ดูสิ!'}
              </p>
              <Link to="/dashboard" className="btn btn-primary">ไปที่คลังข้อสอบ</Link>
            </div>
          ) : (
            /* Favorite Exam Grid */
            <div className="grid-4">
              {favoriteExams.map((exam) => (
                <Link
                  key={exam.id}
                  to={`/exam-detail/${exam.id}`}
                  className="exam-card"
                  style={{ position: 'relative' }}
                >
                  {/* Heart Button */}
                  <button
                    onClick={(e) => toggleFavorite(e, exam.id)}
                    style={{
                      position: 'absolute', top: '16px', right: '16px',
                      background: 'none', border: 'none', fontSize: '1.4rem',
                      cursor: 'pointer', zIndex: 2,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  >
                    ❤️
                  </button>

                  <div className="exam-card-icon">📝</div>
                  <div className="exam-card-subject">{exam.subject_name || 'ไม่ระบุ'}</div>
                  <div className="exam-card-title">{exam.title || 'ไม่มีชื่อ'}</div>
                  <div className="exam-card-desc">{exam.description || 'ไม่มีคำอธิบาย'}</div>
                  <div className="exam-card-meta">
                    <span>📝 {exam.question_count || 0} ข้อ</span>
                    <span>⏱️ {exam.duration || 0} นาที</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </AnimatedPage>
    </>
  );
}

export default Favorite;