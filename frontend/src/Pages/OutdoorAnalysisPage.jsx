import AnalysisPage from '../Components/AnalysisPage';
import axios from 'axios';

function OutdoorAnalysisPage() {
  const handleAnalyze = async (formData) => {
    try {
      console.log('Starting outdoor analysis...');
      const response = await axios.post('http://localhost:8001/analyze/outdoor/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Analysis response:', response.data);
      
      if (response.data.error) {
        console.error('Analysis error:', response.data.error);
        throw new Error(response.data.error);
      }
      
      if (!response.data || Object.keys(response.data).length === 0) {
        console.error('Empty response from server');
        throw new Error('No analysis results received');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in outdoor analysis:', error);
      throw error;
    }
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