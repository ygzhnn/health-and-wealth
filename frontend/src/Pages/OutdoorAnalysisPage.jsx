import AnalysisPage from '../Components/AnalysisPage';
import axios from 'axios';

function OutdoorAnalysisPage() {
  const handleAnalyze = async (formData) => {
    const response = await axios.post('http://localhost:8001/analyze/outdoor/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  return (
    <AnalysisPage
      title="Dış Alan Analizi"
      description="Açık alanların duygu durumuna etkisini analiz edin. Bu analiz, doğal ve yapay çevrenin ruh halinize etkisini ölçer."
      onAnalyze={handleAnalyze}
    />
  );
}

export default OutdoorAnalysisPage; 