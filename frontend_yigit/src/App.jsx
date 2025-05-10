import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IndoorAnalysisPage from './Pages/IndoorAnalysisPage';

function HomePage() {
  return (
    <main className="home-container">
      <div className="hero">
        <h1 className="hero-title">Çevresel Ruh Hali Analizi Platformu</h1>
      </div>

      <section className="analysis-section">
        <h2 className="section-title">Hangi Analizi Başlatmak İstersiniz?</h2>
        <div className="option-cards">
          <Link to="/indoor" className="card">
            <h3>İç Alan Analizi</h3>
            <p>Kapalı ortamlarda ruhsal etkileri değerlendirin.</p>
          </Link>
          <div className="card">
            <h3>Dış Alan Analizi</h3>
            <p>Açık alanların duygu durumuna etkisini analiz edin.</p>
          </div>
        </div>
      </section>

      <section className="extra-section">
        <div className="info-box">
          🌳 <strong>Çevresel Etki Takibi:</strong> Konum tabanlı analizlerle ruh halinize etkileri ölçün.
        </div>
        <div className="info-box">
          😊 <strong>Yüz İfadesi Uyumu:</strong> Yüz ifadelerinize göre içerik önerileri alın.
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <Router>
      <header className="topbar">
        <div className="logo">
          <img src="/images/urban-logo.png" alt="Urban Aura Logo" />
        </div>
        <div className="auth-buttons">
          <button className="auth-btn">Giriş Yap</button>
          <button className="auth-btn outlined">Kayıt Ol</button>
        </div>
      </header>

      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/indoor" element={<IndoorAnalysisPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
