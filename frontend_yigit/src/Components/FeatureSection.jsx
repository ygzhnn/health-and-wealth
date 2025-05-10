export default function FeatureSection() {
    return (
      <section style={sectionStyle}>
        <h2 style={titleStyle}>Urban Aura Ne Sunar?</h2>
        <div style={featuresWrapperStyle}>
          <FeatureBox
            emoji="🌡️"
            title="Ruh Hali Algısı"
            description="Yazdıklarını analiz ederek ortamın seni nasıl etkilediğini tespit eder."
          />
          <FeatureBox
            emoji="🧭"
            title="Yönlendirme"
            description="Sana uygun alanları (örneğin daha sakin bölgeler) önerir."
          />
          <FeatureBox
            emoji="🧠"
            title="Yapay Zekâ Desteği"
            description="LLM modelleri ile duygusal içeriği anlar ve kişiselleştirilmiş öneri sunar."
          />
        </div>
      </section>
    );
  }
  
  function FeatureBox({ emoji, title, description }) {
    return (
      <div style={boxStyle}>
        <div style={{ fontSize: "1.5rem" }}>{emoji}</div>
        <strong style={{ display: "block", margin: "10px 0 5px" }}>{title}</strong>
        <p style={descStyle}>{description}</p>
      </div>
    );
  }
  
  // Styles
  const sectionStyle = {
    maxWidth: "1000px",
    margin: "0 auto", // ORTALAMAYI BU SAĞLIYOR ✅
    textAlign: "center",
    padding: "40px 20px",
  };
  
  const titleStyle = {
    fontSize: "1.8rem",
    marginBottom: "30px",
  };
  
  const featuresWrapperStyle = {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "20px",
  };
  
  const boxStyle = {
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    padding: "20px",
    maxWidth: "280px",
    width: "100%",
    color: "#1a1a1a",
    textAlign: "center",
  };
  
  const descStyle = {
    marginTop: "8px",
    fontSize: "0.95rem",
    lineHeight: 1.5,
  };
  