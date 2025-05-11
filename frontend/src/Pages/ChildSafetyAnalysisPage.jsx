import AnalysisPage from '../Components/AnalysisPage';
import axios from 'axios';

function ChildSafetyAnalysisPage() {
  const handleAnalyze = async (formData) => {
    const response = await axios.post('http://localhost:8001/analyze/child-safety/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  return (
    <AnalysisPage
      title="Child Safety Analysis"
      description="Evaluates the room image for child safety. This analysis identifies potential hazards in the room and provides recommendations for creating a safer environment for children."
      onAnalyze={handleAnalyze}
      isChildSafetyAnalysis={true}
    />
  );
}

export default ChildSafetyAnalysisPage; 