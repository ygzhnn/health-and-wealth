import AnalysisPage from '../Components/AnalysisPage';
import axios from 'axios';

function PersonalAnalysisPage() {
  const handleAnalyze = async (formData) => {
    const response = await axios.post('http://localhost:8001/analyze/personal/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  return (
    <AnalysisPage
      title="Kişisel Analiz"
      description="Kişisel alanınızın ruh halinize etkisini ölçün. Bu analiz, kişisel yaşam alanınızın duygusal etkisini değerlendirir."
      onAnalyze={handleAnalyze}
    />
  );
}

export default PersonalAnalysisPage; 