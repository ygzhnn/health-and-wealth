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
      title="Outdoor Space Analysis"
      description="Analyze the impact of outdoor spaces on emotional well-being. This analysis evaluates how natural and built environments affect your mood and mental state."
      onAnalyze={handleAnalyze}
      isPersonalAnalysis={true}
    />
  );
}

export default OutdoorAnalysisPage; 