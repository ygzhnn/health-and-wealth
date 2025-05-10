import AnalysisPage from '../Components/AnalysisPage';
import axios from 'axios';

function IndoorAnalysisPage() {
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
      title="Indoor Space Analysis"
      description="Evaluate the emotional impact of indoor environments. This analysis measures how your office or home environment affects your emotional well-being."
      onAnalyze={handleAnalyze}
      isPersonalAnalysis={true}
    />
  );
}

export default IndoorAnalysisPage;
  