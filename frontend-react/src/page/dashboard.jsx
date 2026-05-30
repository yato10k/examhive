import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function Dashboard() {
    const location = useLocation();
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
    const [loading, setLoading] = useState(true);

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
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {/* 🔴 ไฮไลต์เด็ด: ส่ง isLoggedIn={true} ไป เพื่อให้ Navbar เปลี่ยนโหมด! */}
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
                            {/* =======================================
              ส่วนหัวของ Section: ชุดข้อสอบของฉัน
              ======================================= */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>

                                {/* ฝั่งซ้าย: ไอคอนและชื่อหัวข้อ */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1.4rem' }}>📋</span>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--brown)', margin: 0 }}>
                                        ชุดข้อสอบของฉัน
                                    </h2>
                                </div>

                                {/* ฝั่งขวา: ปุ่มดูทั้งหมดแบบคลีนๆ */}
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
                                {examSets.map((exam) => (
                                    <Link key={exam.id} to={`/exam-detail/${exam.id}`} className="exam-card">
                                        <div className="exam-card-icon">📝</div>
                                        <div className="exam-card-subject">{exam.subject_name || 'ไม่ระบุ'}</div>
                                        <div className="exam-card-title">{exam.title}</div>
                                        <div className="exam-card-desc">{exam.description || 'ไม่มีคำอธิบาย'}</div>
                                        <div className="exam-card-meta">
                                            <span>📝 {exam.question_count || 0} ข้อ</span>
                                        </div>
                                    </Link>
                                ))}
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
                                            recentActivity.map((activity, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div style={{ fontWeight: '600' }}>{activity.exam_title}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{activity.subject || ''}</div>
                                                    </td>
                                                    <td><span className="badge badge-green">{activity.score}/{activity.total}</span></td>
                                                    <td style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{activity.time_used || '—'}</td>
                                                    <td style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{activity.date || '—'}</td>
                                                    <td><Link to="/result" className="btn btn-ghost btn-sm">ดูผล</Link></td>
                                                </tr>
                                            ))
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