// src/components/Topbar.jsx
export default function Topbar() {
    return (
      <div className="topbar">
        <div className="logo">Urban Aura</div>
        <div className="auth-buttons">
          <button className="auth-btn outlined">Hakkında</button>
          <button className="auth-btn outlined">Yardım</button>
          <button className="auth-btn">Giriş Yap</button>
          <button className="auth-btn">Kayıt Ol</button>
        </div>
      </div>
    );
  }
  