import AnalysisPage from '../Components/AnalysisPage';
import axios from 'axios';

function SafetyAnalysisPage() {
  const handleAnalyze = async (formData) => {
    const response = await axios.post('http://localhost:8001/analyze/safety/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  return (
    <AnalysisPage
      title="Safety Analysis"
      description="Evaluates the room image for safety hazards. This analysis identifies potential hazards and provides recommendations for creating a safer environment."
      onAnalyze={handleAnalyze}
      isSafetyAnalysis={true}
    />
  );
}

export default SafetyAnalysisPage; 