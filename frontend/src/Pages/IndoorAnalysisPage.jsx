import AnalysisPage from '../Components/AnalysisPage';
import axios from 'axios';

function IndoorAnalysisPage() {
  const handleAnalyze = async (formData) => {
    const response = await axios.post('http://localhost:8001/analyze/office/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  return (
    <AnalysisPage
      title="İç Alan Analizi"
      description="Kapalı ortamlarda ruhsal etkileri değerlendirin. Bu analiz, ofis veya ev ortamınızın ruh halinize etkisini ölçer."
      onAnalyze={handleAnalyze}
    />
  );
}

export default IndoorAnalysisPage;
  