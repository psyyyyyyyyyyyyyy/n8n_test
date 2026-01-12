import { useState, useEffect } from 'react'
import './App.css'
import { trackPageView, trackButtonClick } from './lib/supabase'

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 23,
    minutes: 59,
    seconds: 59
  })
  
  const [isParticipated, setIsParticipated] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // 페이지 방문수 트래킹
  useEffect(() => {
    trackPageView()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
        }
        if (minutes < 0) {
          minutes = 59
          hours--
        }
        if (hours < 0) {
          hours = 23
          days--
        }
        if (days < 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        }
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleParticipate = () => {
    // 버튼 클릭 트래킹
    trackButtonClick('participate')
    setIsParticipated(true)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const prizes = [
    { emoji: '🎁', title: '1등', prize: 'MacBook Pro M3', probability: '1명' },
    { emoji: '🎮', title: '2등', prize: 'PlayStation 5', probability: '3명' },
    { emoji: '🎧', title: '3등', prize: 'AirPods Pro', probability: '10명' },
    { emoji: '☕', title: '참가상', prize: '스타벅스 기프티콘', probability: '100명' },
  ]

  return (
    <div className="event-container">
      {/* 배경 효과 */}
      <div className="bg-gradient"></div>
      <div className="bg-pattern"></div>
      <div 
        className="spotlight" 
        style={{ 
          left: mousePos.x, 
          top: mousePos.y 
        }}
      ></div>
      
      {/* 떠다니는 파티클 */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--delay': `${i * 0.5}s`,
            '--x': `${Math.random() * 100}%`,
            '--duration': `${15 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>

      {/* 컨페티 효과 */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="confetti"
              style={{
                '--x': `${Math.random() * 100}vw`,
                '--delay': `${Math.random() * 0.5}s`,
                '--color': ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bd6'][Math.floor(Math.random() * 5)]
              }}
            ></div>
          ))}
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        {/* 헤더 배지 */}
        <div className="badge-container">
          <span className="badge">🔥 LIMITED TIME</span>
        </div>

        {/* 타이틀 */}
        <h1 className="title">
          <span className="title-line">신년맞이</span>
          <span className="title-main">
            <span className="gradient-text">MEGA</span>
            <span className="outline-text">EVENT</span>
          </span>
        </h1>

        <p className="subtitle">
          새해를 맞아 준비한 특별한 이벤트!<br/>
          참여만 해도 <span className="highlight">100% 당첨</span> 찬스!
        </p>

        {/* 카운트다운 */}
        <div className="countdown-section">
          <p className="countdown-label">이벤트 종료까지</p>
          <div className="countdown">
            <div className="time-box">
              <span className="time-value">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="time-label">DAYS</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-box">
              <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="time-label">HOURS</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-box">
              <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="time-label">MINS</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-box">
              <span className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="time-label">SECS</span>
            </div>
          </div>
        </div>

        {/* 상품 카드 */}
        <div className="prizes-grid">
          {prizes.map((item, index) => (
            <div key={index} className="prize-card" style={{ '--index': index }}>
              <div className="prize-emoji">{item.emoji}</div>
              <div className="prize-rank">{item.title}</div>
              <div className="prize-name">{item.prize}</div>
              <div className="prize-count">{item.probability}</div>
            </div>
          ))}
        </div>

        {/* 참여하기 버튼 */}
        <div className="cta-section">
          {!isParticipated ? (
            <button className="participate-btn" onClick={handleParticipate}>
              <span className="btn-bg"></span>
              <span className="btn-text">
                🎉 참여하기
              </span>
              <span className="btn-shine"></span>
            </button>
          ) : (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <p className="success-text">참여 완료!</p>
              <p className="success-sub">당첨 결과는 이벤트 종료 후 발표됩니다</p>
            </div>
          )}
        </div>

        {/* 추가 정보 */}
        <div className="info-section">
          <div className="info-card">
            <div className="info-icon">📅</div>
            <div className="info-content">
              <h3>이벤트 기간</h3>
              <p>2026.01.08 ~ 2026.01.15</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">🎯</div>
            <div className="info-content">
              <h3>참여 방법</h3>
              <p>참여하기 버튼 클릭!</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">📢</div>
            <div className="info-content">
              <h3>당첨 발표</h3>
              <p>2026.01.16 오후 6시</p>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <footer className="footer">
          <p>* 본 이벤트는 1인 1회 참여 가능합니다</p>
          <p>* 당첨자 발표는 개별 연락 드립니다</p>
        </footer>
      </main>
    </div>
  )
}

export default App
