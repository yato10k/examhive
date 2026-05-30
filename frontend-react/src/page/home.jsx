import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar'; // ดึง Navbar มาใช้

function Home() {
    return (
        <>
            <Navbar />

            {/* HERO SECTION */}
            <section className="hero">
                {/* ของตกแต่งพื้นหลัง */}
                <div style={{ position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
                    <div style={{ position: 'absolute', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', background: 'var(--honey)', opacity: 0.07, width: '220px', height: '220px', top: '-60px', left: '-40px' }}></div>
                    <div style={{ position: 'absolute', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', background: 'var(--honey)', opacity: 0.07, width: '140px', height: '140px', top: '40px', right: '80px' }}></div>
                    <div style={{ position: 'absolute', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', background: 'var(--honey)', opacity: 0.07, width: '100px', height: '100px', bottom: '-20px', left: '60px' }}></div>
                    <div style={{ position: 'absolute', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', background: 'var(--honey)', opacity: 0.07, width: '180px', height: '180px', bottom: '-50px', right: '-30px' }}></div>
                </div>

                <div className="hero-badge" style={{ position: 'relative', zIndex: 1 }}>🐝 &nbsp; Share, Test ,Succeed </div>
                <h1 className="hero-title" style={{ position: 'relative', zIndex: 1 }}>EXAMHIVE</h1>
                <p className="hero-slogan" style={{ position: 'relative', zIndex: 1 }}>"Create your personal test bank.<br />Practice smarter, beat the clock, and track your growth."</p>

                <div className="hero-cta" style={{ position: 'relative', zIndex: 1 }}>
                    <Link to="/register" className="btn btn-primary btn-lg">sign up for free</Link>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '52px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--amber)' }}>500+</div>
                        <div style={{ fontSize: '0.83rem', color: 'var(--muted)', fontWeight: '600' }}>ข้อสอบในระบบ</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--amber)' }}>1,200+</div>
                        <div style={{ fontSize: '0.83rem', color: 'var(--muted)', fontWeight: '600' }}>ผู้ใช้งาน</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--amber)' }}>8,400+</div>
                        <div style={{ fontSize: '0.83rem', color: 'var(--muted)', fontWeight: '600' }}>รอบที่ทำข้อสอบ</div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="features-section" style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ textAlign: 'center', fontSize: '0.82rem', fontWeight: '700', letterSpacing: '0.1em', color: 'var(--amber)', textTransform: 'uppercase', margin: '60px 0 24px' }}>ทำไมต้อง EXAMHIVE?</p>
                <div className="grid-3" style={{ marginBottom: 0 }}>
                    <div className="feature-card">
                        <span className="feature-icon">📚</span>
                        <div className="feature-title">สร้างข้อสอบเอง</div>
                        <div className="feature-desc">เพิ่มข้อสอบปรนัย MCQ และจริง-เท็จ ได้ไม่จำกัด จัดเป็นชุดตามหมวดวิชาที่คุณต้องการ</div>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">⏱️</span>
                        <div className="feature-title">จับเวลาอัตโนมัติ</div>
                        <div className="feature-desc">ตั้งเวลาทำข้อสอบได้ตามต้องการ ฝึกทักษะการบริหารเวลาอย่างมืออาชีพ</div>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">📊</span>
                        <div className="feature-title">เก็บประวัติคะแนน</div>
                        <div className="feature-desc">ดูพัฒนาการผ่านคะแนนแต่ละรอบ รู้ว่าข้อไหนยังต้องปรับปรุง และทำซ้ำจนชำนาญ</div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                © 2026 EXAMHIVE — สร้างโดยทีม DSI104&nbsp;&nbsp;·&nbsp;&nbsp;
                <Link to="/login">เข้าสู่ระบบ</Link>&nbsp;&nbsp;·&nbsp;&nbsp;
                <Link to="/register">สมัครสมาชิก</Link>
            </footer>
        </>
    );
}

export default Home;