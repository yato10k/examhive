import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';


function AllExams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for exam data
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Search and filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

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

    // Persist to localStorage
    const newFavs = isFav
      ? favoriteIds.filter(id => id !== examId)
      : [...favoriteIds, examId];
    localStorage.setItem('favorites', JSON.stringify(newFavs));

    // Sync with backend
    try {
      const method = isFav ? 'DELETE' : 'POST';
      await fetch(`/api/me/favorites/${examId}`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {}
  };

  // Fetch exams from API
  useEffect(() => {
    const fetchExams = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/exam-sets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'ไม่สามารถดึงข้อมูลได้');
          setLoading(false);
          return;
        }

        setExams(Array.isArray(data) ? data : []);

        // Apply category from URL params if present
        const cat = searchParams.get('category');
        if (cat) {
          setCategory(cat);
        }

        // Load favorites from localStorage
        const storedFavs = localStorage.getItem('favorites');
        if (storedFavs) {
          try {
            setFavoriteIds(JSON.parse(storedFavs));
          } catch {}
        }
      } catch {
        setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [searchParams]);

  // Filter exams based on search and category
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title?.toLowerCase().includes(search.toLowerCase()) ||
                         exam.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !category ||
                           exam.subject_name?.toUpperCase().includes(category.toUpperCase()) ||
                           exam.subject_name?.includes(category);

    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(exams.map(e => {
    if (e.subject_name?.startsWith('T-GAT')) return 'TGAT';
    if (e.subject_name?.startsWith('T-PAT')) return 'TPAT';
    if (e.subject_name?.startsWith('A-LEVEL')) return 'A-LEVEL';
    return e.subject_name?.split(' ')[0] || '';
  }).filter(Boolean))];

  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '900px', marginTop: '40px', paddingBottom: '80px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <Link to="/dashboard" className="back-link">← กลับไปหน้าหลัก</Link>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--brown)', marginTop: '12px', marginBottom: '4px' }}>
                คลังข้อสอบทั้งหมด 📚
              </h1>
              <p style={{ color: 'var(--muted)', margin: 0 }}>
                รวมทุกชุดข้อสอบที่คุณสร้างขึ้นและจัดเก็บไว้ ({filteredExams.length} ชุด)
              </p>
            </div>
            <Link to="/create-exam" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              + สร้างข้อสอบใหม่
            </Link>
          </div>

          {/* Search and Filter */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหาชื่อชุดข้อสอบ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="">ทุกหมวด</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🐝</div>
              <p style={{ color: 'var(--muted)' }}>กำลังโหลด...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          {/* Exam List */}
          {!loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => {
                  const isFav = favoriteIds.includes(exam.id);
                  return (
                    <Link
                      key={exam.id}
                      to={`/exam-detail/${exam.id}`}
                      className="exam-card"
                      style={{ position: 'relative', textDecoration: 'none' }}
                    >
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(e, exam.id)}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'none',
                          border: 'none',
                          fontSize: '1.3rem',
                          cursor: 'pointer',
                          zIndex: 2,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                          transition: 'transform 0.15s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        {isFav ? '❤️' : '🤍'}
                      </button>

                      {/* Badge */}
                      <span className="badge badge-honey" style={{ marginBottom: '12px' }}>
                        {exam.subject_name || 'ไม่ระบุหมวด'}
                      </span>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--brown)', marginBottom: '8px' }}>
                        {exam.title || 'ไม่มีชื่อ'}
                      </h3>

                      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '16px', minHeight: '40px' }}>
                        {exam.description || 'ไม่มีคำอธิบาย'}
                      </p>

                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        paddingTop: '12px', borderTop: '1px solid var(--cream)'
                      }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--brown)', fontWeight: '600' }}>
                          🧩 {exam.question_count || 0} ข้อ | ⏱️ {exam.duration || 0} นาที
                        </div>
                        <span style={{ color: 'var(--amber)', textDecoration: 'none', fontWeight: '800', fontSize: '0.9rem' }}>
                          เปิด ➔
                        </span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                /* Empty State */
                <div className="card" style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📄</div>
                  <h3 style={{ color: 'var(--brown)' }}>ไม่พบชุดข้อสอบ</h3>
                  <p style={{ color: 'var(--muted)' }}>
                    {search || category ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง' : 'เริ่มสร้างข้อสอบชุดแรกของคุณเพื่อเตรียมพร้อมสำหรับการสอบ!'}
                  </p>
                  {!search && !category && (
                    <Link to="/create-exam" className="btn btn-primary" style={{ marginTop: '16px', textDecoration: 'none' }}>
                      + สร้างข้อสอบใหม่
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </AnimatedPage>
    </>
  );
}

export default AllExams;