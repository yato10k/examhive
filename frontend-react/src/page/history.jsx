import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import AnimatedPage from '../component/AnimatedPage';

function History() {
  // สร้าง Mock Data จำลองประวัติการทำข้อสอบ
  const historyData = [
    {
      id: 1,
      subject: 'คณิตศาสตร์',
      title: 'คณิตศาสตร์พื้นฐาน ม.ต้น',
      score: 13,
      total: 15,
      accuracy: 86,
      timeSpent: '17:24',
      date: '29 พ.ค. 2026',
      status: 'ผ่าน',
      statusColor: '#16a34a' // สีเขียว
    },
    {
      id: 2,
      subject: 'วิทยาศาสตร์',
      title: 'วิทยาศาสตร์กายภาพ ป.6',
      score: 9,
      total: 10,
      accuracy: 90,
      timeSpent: '08:45',
      date: '24 พ.ค. 2026',
      status: 'ดีเยี่ยม',
      statusColor: '#2563eb' // สีน้ำเงิน
    },
    {
      id: 3,
      subject: 'ทั่วไป',
      title: 'ความรู้รอบตัวทั่วไป',
      score: 14,
      total: 20,
      accuracy: 70,
      timeSpent: '14:10',
      date: '28 พ.ค. 2026',
      status: 'พอใช้',
      statusColor: '#d97706' // สีส้ม
    }
  ];

  return (
    <>
      <Navbar isLoggedIn={true} />

      <AnimatedPage>
        <div className="page-wrapper" style={{ maxWidth: '900px' }}>
          
          <div className="page-header" style={{ marginBottom: '32px' }}>
            <div>
              <h1 className="page-title">ประวัติคะแนน 📊</h1>
              <p className="page-subtitle">ดูสถิติและพัฒนาการทำข้อสอบของคุณทั้งหมด</p>
            </div>
          </div>

          {/* กล่องสรุปสถิติภาพรวม */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div className="card" style={{ padding: '24px', textAlign: 'center', background: 'var(--cream)', border: '2px solid var(--honey)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--brown)', fontWeight: '600', marginBottom: '8px' }}>ข้อสอบที่ทำแล้วทั้งหมด</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--brown)', lineHeight: '1' }}>3 <span style={{ fontSize: '1rem', fontWeight: '600' }}>ชุด</span></div>
            </div>
            
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: '600', marginBottom: '8px' }}>คะแนนเฉลี่ยรวม</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#16a34a', lineHeight: '1' }}>82%</div>
            </div>

            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: '600', marginBottom: '8px' }}>เวลาที่ใช้ฝึกฝนรวม</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--amber)', lineHeight: '1' }}>40 <span style={{ fontSize: '1rem', fontWeight: '600' }}>นาที</span></div>
            </div>
          </div>

          {/* รายการประวัติ */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--brown)', marginBottom: '16px' }}>กิจกรรมล่าสุด</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {historyData.map((item) => (
              <div key={item.id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                
                {/* ข้อมูลข้อสอบ */}
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-honey">{item.subject}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>📅 {item.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--brown)', margin: 0 }}>
                    {item.title}
                  </h3>
                </div>

                {/* สถิติการทำรอบนั้น */}
                <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>คะแนน</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--brown)' }}>{item.score}/{item.total}</div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>ความแม่นยำ</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: item.statusColor }}>{item.accuracy}%</div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>เวลาที่ใช้</div>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--brown)' }}>⏱️ {item.timeSpent}</div>
                  </div>
                </div>

                {/* ปุ่ม Action */}
                <div style={{ paddingLeft: '16px', borderLeft: '1px solid var(--border)' }}>
                  <Link to="/exam-detail" className="btn btn-outline btn-sm">
                    ดูเฉลย
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>
      </AnimatedPage>
    </>
  );
}

export default History;