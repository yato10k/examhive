import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState(location.state?.display_name || localStorage.getItem('display_name') || 'น้องเฌอ');

    // State สำหรับข้อมูลที่จะมาจาก API
    const [stats, setStats] = useState({
        totalExams: 0,
        totalQuestions: 0,
        totalAttempts: 0,
        averageScore: 0
    });
    const [examSets, setExamSets] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [loading, setLoading] = useState(true);

    // Toggle favorite
    const toggleFavorite = (e, examId) => {
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
            fetch(`/api/me/favorites/${examId}`, {
                method,
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch {}
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // ดึงข้อมูลโปรไฟล์
                const profileRes = await fetch('/api/me/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const profileData = await profileRes.json();
                if (profileData && profileData.display_name) {
                    setUserName(profileData.display_name);
                    localStorage.setItem('display_name', profileData.display_name);
                }

                // ดึงรายการชุดข้อสอบ
                const examRes = await fetch('/api/exam-sets', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const examData = await examRes.json();

                if (Array.isArray(examData)) {
                    setExamSets(examData);

                    // คำนวณ stats
                    const totalQuestions = examData.reduce((sum, exam) => sum + (exam.question_count || 0), 0);
                    setStats(prev => ({
                        ...prev,
                        totalExams: examData.length,
                        totalQuestions: totalQuestions
                    }));
                }

                // ดึงประวัติการทำข้อสอบ
                const attemptRes = await fetch('/api/me/attempts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const attemptData = await attemptRes.json();

                if (Array.isArray(attemptData)) {
                    setRecentActivity(attemptData.slice(0, 5)); // แสดง 5 รายการล่าสุด

                    // คำนวณคะแนนเฉลี่ย
                    if (attemptData.length > 0) {
                        const totalScore = attemptData.reduce((sum, a) => sum + (a.score || 0), 0);
                        const totalMax = attemptData.reduce((sum, a) => sum + (a.total || 0), 0);
                        const avgScore = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
                        setStats(prev => ({
                            ...prev,
                            totalAttempts: attemptData.length,
                            averageScore: avgScore
                        }));
                    }
                }

                // ดึง favorites
                try {
                    const storedFavs = localStorage.getItem('favorites');
                    if (storedFavs) {
                        setFavoriteIds(JSON.parse(storedFavs));
                    }
                } catch {}
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Format time for display
    const formatTime = (seconds) => {
        if (!seconds) return '—';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Format date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
        } catch {
            return dateStr;
        }
    };

    return (
        <>
            <Navbar isLoggedIn={true} />
            <AnimatedPage>
                <div className="page-wrapper">
                    {/* PAGE HEADER */}
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">สวัสดี, {userName}! 👋</h1>
                            <p className="page-subtitle">พร้อมฝึกซ้อมวันนี้หรือยัง? คุณมีชุดข้อสอบรออยู่ {stats.totalExams} ชุด</p>
                        </div>
                        <Link to="/create-exam" className="btn btn-primary">
                            <span>+ </span> สร้างชุดข้อสอบใหม่
                        </Link>
                    </div>

                    {/* STATS ROW */}
                    <div className="stats-row">
                        <div className="stat-box">
                            <div className="stat-number">{stats.totalExams}</div>
                            <div className="stat-label">ชุดข้อสอบทั้งหมด</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number">{stats.totalQuestions}</div>
                            <div className="stat-label">คำถามรวม</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number">{stats.totalAttempts}</div>
                            <div className="stat-label">รอบที่ทำแล้ว</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number" style={{ color: '#16a34a' }}>{stats.averageScore}%</div>
                            <div className="stat-label">คะแนนเฉลี่ย</div>
                        </div>
                    </div>

                    {/* EXAM CARDS GRID */}
                    <div className="section-block">
                        <div className="flex-between mb-16">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1.4rem' }}>📋</span>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--brown)', margin: 0 }}>
                                        ชุดข้อสอบของฉัน
                                    </h2>
                                </div>

                                <Link
                                    to="/all-exams"
                                    style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--amber)',
                                        fontWeight: '400',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '4px 8px',
                                        borderRadius: '5px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    ดูทั้งหมด <span style={{ fontSize: '1rem' }}>➔</span>
                                </Link>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
                                กำลังโหลด...
                            </div>
                        ) : examSets.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📝</div>
                                <p>ยังไม่มีชุดข้อสอบ</p>
                            </div>
                        ) : (
                            <div className="grid-4">
                                {examSets.map((exam) => {
                                    const isFav = favoriteIds.includes(exam.id);
                                    return (
                                        <Link
                                            key={exam.id}
                                            to={`/exam-detail/${exam.id}`}
                                            className="exam-card"
                                            style={{ position: 'relative' }}
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

                                            <div className="exam-card-icon">📝</div>
                                            <div className="exam-card-subject">{exam.subject_name || 'ไม่ระบุ'}</div>
                                            <div className="exam-card-title">{exam.title}</div>
                                            <div className="exam-card-desc">{exam.description || 'ไม่มีคำอธิบาย'}</div>
                                            <div className="exam-card-meta">
                                                <span>📝 {exam.question_count || 0} ข้อ</span>
                                                <span>⏱️ {exam.duration || 0} นาที</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* RECENT ACTIVITY */}
                    <div className="section-block">
                        <div className="section-block-title"><span>🕐</span> กิจกรรมล่าสุด</div>
                        <div className="card" style={{ padding: 0 }}>
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ชุดข้อสอบ</th>
                                            <th>คะแนน</th>
                                            <th>เวลาที่ใช้</th>
                                            <th>วันที่</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentActivity.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px' }}>
                                                    ยังไม่มีกิจกรรมการทำข้อสอบ
                                                </td>
                                            </tr>
                                        ) : (
                                            recentActivity.map((activity, index) => {
                                                const percent = activity.total > 0 ? Math.round((activity.score / activity.total) * 100) : 0;
                                                const badgeColor = percent >= 80 ? 'badge-green' : percent >= 60 ? 'badge-honey' : 'badge-red';
                                                return (
                                                    <tr key={activity.id || index}>
                                                        <td>
                                                            <div style={{ fontWeight: '600' }}>{activity.exam_title || 'ไม่ระบุชื่อ'}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>📅 {formatDate(activity.finished_at)}</div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${badgeColor}`}>{activity.score}/{activity.total}</span>
                                                        </td>
                                                        <td style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                                                            ⏱️ {formatTime(activity.time_used)}
                                                        </td>
                                                        <td style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                                                            {formatDate(activity.finished_at)}
                                                        </td>
                                                        <td>
                                                            <Link
                                                                to="/result"
                                                                state={{
                                                                    examId: activity.exam_set_id,
                                                                    score: activity.score,
                                                                    total: activity.total,
                                                                    timeUsed: activity.time_used
                                                                }}
                                                                className="btn btn-ghost btn-sm"
                                                            >
                                                                ดูผล
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {recentActivity.length > 0 && (
                            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                <Link to="/history" style={{ fontSize: '0.87rem', fontWeight: '600', color: 'var(--amber)' }}>
                                    ดูประวัติทั้งหมด →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </AnimatedPage>
            <footer className="footer">© 2026 EXAMHIVE</footer>
        </>
    );
}

export default Dashboard;