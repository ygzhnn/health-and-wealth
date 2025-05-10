// src/components/AnalysisSelector.jsx
export default function AnalysisSelector() {
    return (
      <section className="analysis-section">
        <h2 className="section-title">Hangi Analizi Başlatmak İstersiniz?</h2>
        <div className="option-cards">
          <div className="card">
            <h3>İç Alan Analizi</h3>
            <p>Kapalı ortamlarda ruhsal etkileri değerlendirin.</p>
          </div>
          <div className="card">
            <h3>Dış Alan Analizi</h3>
            <p>Açık alanların duygu durumuna etkisini analiz edin.</p>
          </div>
        </div>
      </section>
    );
  }
  