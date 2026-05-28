import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function Dashboard() {
    return (
        <>
            {/* 🔴 ไฮไลต์เด็ด: ส่ง isLoggedIn={true} ไป เพื่อให้ Navbar เปลี่ยนโหมด! */}
            <Navbar isLoggedIn={true} />
            <AnimatedPage>
                <div className="page-wrapper">
                    {/* PAGE HEADER */}
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">สวัสดี, น้องเฌอ! 👋</h1>
                            <p className="page-subtitle">พร้อมฝึกซ้อมวันนี้หรือยัง? คุณมีชุดข้อสอบรออยู่ 4 ชุด</p>
                        </div>
                        <Link to="/create-exam" className="btn btn-primary">
                            <span>+ </span> สร้างชุดข้อสอบใหม่
                        </Link>
                    </div>

                    {/* STATS ROW */}
                    <div className="stats-row">
                        <div className="stat-box">
                            <div className="stat-number">4</div>
                            <div className="stat-label">ชุดข้อสอบทั้งหมด</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number">57</div>
                            <div className="stat-label">คำถามรวม</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number">12</div>
                            <div className="stat-label">รอบที่ทำแล้ว</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number" style={{ color: '#16a34a' }}>82%</div>
                            <div className="stat-label">คะแนนเฉลี่ย</div>
                        </div>
                    </div>

                    {/* EXAM CARDS GRID */}
                    <div className="section-block">
                        <div className="flex-between mb-16">
                            <div className="section-block-title">
                                <span>📋</span> ชุดข้อสอบของฉัน
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <select className="form-control" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}>
                                    <option>ทั้งหมด</option>
                                    <option>คณิตศาสตร์</option>
                                    <option>วิทยาศาสตร์</option>
                                    <option>ภาษาไทย</option>
                                    <option>ทั่วไป</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid-4">
                            {/* Card 1 */}
                            <Link to="/exam-detail" className="exam-card">
                                <div className="exam-card-icon">🔢</div>
                                <div className="exam-card-subject">คณิตศาสตร์</div>
                                <div className="exam-card-title">คณิตศาสตร์พื้นฐาน ม.ต้น</div>
                                <div className="exam-card-desc">บวก ลบ คูณ หาร ลำดับการดำเนินการ และโจทย์ปัญหาเบื้องต้น</div>
                                <div className="exam-card-meta">
                                    <span>📝 15 ข้อ</span>
                                    <span>⏱️ 20 นาที</span>
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '4px' }}>
                                        <span>ทำล่าสุด: ผ่านมา 2 วัน</span>
                                        <span style={{ color: '#16a34a', fontWeight: '700' }}>85%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 2 */}
                            <Link to="/exam-detail" className="exam-card">
                                <div className="exam-card-icon">🌍</div>
                                <div className="exam-card-subject">ทั่วไป</div>
                                <div className="exam-card-title">ความรู้รอบตัวทั่วไป</div>
                                <div className="exam-card-desc">ภูมิศาสตร์ ประวัติศาสตร์ วิทยาศาสตร์ทั่วไป และสังคมศึกษาเบื้องต้น</div>
                                <div className="exam-card-meta">
                                    <span>📝 20 ข้อ</span>
                                    <span>⏱️ 15 นาที</span>
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '4px' }}>
                                        <span>ทำล่าสุด: วานนี้</span>
                                        <span style={{ color: 'var(--amber)', fontWeight: '700' }}>70%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '70%', background: 'var(--amber)' }}></div>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 3 */}
                            <Link to="/exam-detail" className="exam-card">
                                <div className="exam-card-icon">🔬</div>
                                <div className="exam-card-subject">วิทยาศาสตร์</div>
                                <div className="exam-card-title">วิทยาศาสตร์กายภาพ ป.6</div>
                                <div className="exam-card-desc">แรง พลังงาน สสาร และปรากฏการณ์ธรรมชาติเบื้องต้น</div>
                                <div className="exam-card-meta">
                                    <span>📝 10 ข้อ</span>
                                    <span>⏱️ 12 นาที</span>
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '4px' }}>
                                        <span>ทำล่าสุด: 5 วันก่อน</span>
                                        <span style={{ color: '#16a34a', fontWeight: '700' }}>90%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '90%', background: '#22c55e' }}></div>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 4 */}
                            <Link to="/exam-detail" className="exam-card">
                                <div className="exam-card-icon">🅰️</div>
                                <div className="exam-card-subject">ภาษาไทย</div>
                                <div className="exam-card-title">ภาษาไทยเบื้องต้น</div>
                                <div className="exam-card-desc">การสะกดคำ คำพ้องความหมาย สุภาษิตและสำนวนไทย</div>
                                <div className="exam-card-meta">
                                    <span>📝 12 ข้อ</span>
                                    <span>⏱️ 10 นาที</span>
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '4px' }}>
                                        <span>ยังไม่เคยทำ</span>
                                        <span style={{ color: 'var(--muted)', fontWeight: '700' }}>—</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '0%' }}></div>
                                    </div>
                                </div>
                            </Link>
                        </div>
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
                                        <tr>
                                            <td>
                                                <div style={{ fontWeight: '600' }}>คณิตศาสตร์พื้นฐาน ม.ต้น</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>คณิตศาสตร์</div>
                                            </td>
                                            <td><span className="badge badge-green">13/15</span></td>
                                            <td style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>17:24</td>
                                            <td style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>24 พ.ค. 2026</td>
                                            <td><Link to="/result" className="btn btn-ghost btn-sm">ดูผล</Link></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div style={{ fontWeight: '600' }}>ความรู้รอบตัวทั่วไป</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>ทั่วไป</div>
                                            </td>
                                            <td><span className="badge badge-honey">14/20</span></td>
                                            <td style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>12:05</td>
                                            <td style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>25 พ.ค. 2026</td>
                                            <td><Link to="/result" className="btn btn-ghost btn-sm">ดูผล</Link></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '10px' }}>
                            <Link to="/history" style={{ fontSize: '0.87rem', fontWeight: '600', color: 'var(--amber)' }}>
                                ดูประวัติทั้งหมด →
                            </Link>
                        </div>
                    </div>
                </div>
            </AnimatedPage>
            <footer className="footer">© 2026 EXAMHIVE</footer>
        </>

    );
}

export default Dashboard;