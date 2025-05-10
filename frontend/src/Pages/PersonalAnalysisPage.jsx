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
      title="Personal Analysis"
      description="Measure the impact of your personal space on your emotional well-being. This analysis evaluates the emotional effects of your personal living environment."
      onAnalyze={handleAnalyze}
      isPersonalAnalysis={true}
    />
  );
}

export default PersonalAnalysisPage; 