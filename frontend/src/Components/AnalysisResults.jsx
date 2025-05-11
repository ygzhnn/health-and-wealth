import { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, LinearProgress, Button, CircularProgress, Divider } from '@mui/material';
import axios from 'axios';

function AnalysisResults({ results, isPersonalAnalysis = false, isChildSafetyAnalysis = false }) {
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageDescription, setImageDescription] = useState('');
  const [imageError, setImageError] = useState(null);
  const [generatingSafetyDesign, setGeneratingSafetyDesign] = useState(false);
  const [safetyDesignImage, setSafetyDesignImage] = useState(null);
  const [safetyDesignDescription, setSafetyDesignDescription] = useState('');

  if (!results) return null;

  // Extract scores for display - For normal analysis
  const scores = Object.entries(results)
    .filter(([key, value]) => 
      typeof value === 'number' && 
      !key.includes('score') && 
      !key.includes('Score') &&
      !key.includes('child_safety_score') &&
      !key.includes('wellbeing_score')
    )
    .map(([key, value]) => ({
      name: key.replace(/_/g, ' ').toUpperCase(),
      value: value,
    }));

  // Child safety specific scores
  const childSafetyScores = isChildSafetyAnalysis ? {
    sharp_corners: results.sharp_corners || results.keskin_koseler || 0,
    small_objects: results.small_objects || results.kucuk_nesneler || 0,
    electrical_hazards: results.electrical_hazards || results.elektrik_tehlikeleri || 0,
    chemicals: results.chemicals || results.kimyasallar || 0,
    fall_hazards: results.fall_hazards || results.dusme_tehlikesi || 0,
    pinch_hazards: results.pinch_hazards || results.sikisma_tehlikesi || 0,
    general_safety: results.general_safety || results.genel_guvenlik || 0,
    fire_safety: results.fire_safety || results.yangin_guvenligi || 0
  } : {};

  // Get child safety score if available
  const safetyScore = results.child_safety_score || 0;
  // Get wellbeing score if available (for non-child safety analysis)
  const wellbeingScore = !isChildSafetyAnalysis ? (results.wellbeing_score || 0) : 0;

  // Helper function to get color based on score
  const getScoreColor = (score) => {
    if (score >= 90) return '#118AB2'; // Excellent
    if (score >= 70) return '#06D6A0'; // Good
    if (score >= 40) return '#FFD166'; // Fair
    return '#FF6B6B'; // Poor
  };

  // Child safety category names in English
  const safetyCategoryNames = {
    sharp_corners: "Sharp Corners",
    small_objects: "Small Objects",
    electrical_hazards: "Electrical Hazards",
    chemicals: "Chemicals",
    fall_hazards: "Fall Hazards",
    pinch_hazards: "Pinch Hazards",
    general_safety: "General Safety",
    fire_safety: "Fire Safety"
  };

  // Function to generate reference image
  const handleGenerateImage = async () => {
    setGeneratingImage(true);
    setImageError(null);

    try {
      // Create form data with the analysis results
      const formData = new FormData();
      formData.append('analysis', JSON.stringify(results));
      
      // Use the last uploaded image from localStorage if available
      const lastImageData = localStorage.getItem('lastUploadedImage');
      if (lastImageData) {
        // Convert base64 to blob
        const response = await fetch(lastImageData);
        const blob = await response.blob();
        formData.append('file', blob, 'image.jpg');
      } else {
        setImageError('No image available for reference');
        setGeneratingImage(false);
        return;
      }

      // Call the API to generate reference image
      const response = await axios.post('http://localhost:8001/generate/reference-from-analysis/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if the image generation was successful
      if (response.data.success) {
        setGeneratedImage(`data:image/png;base64,${response.data.image_base64}`);
        setImageDescription(response.data.description || 'Generated reference image');
      } else {
        setImageError(response.data.error || 'Failed to generate image');
      }
    } catch (err) {
      setImageError(`Error generating image: ${err.message}`);
    } finally {
      setGeneratingImage(false);
    }
  };

  // Function to generate safety design image
  const handleGenerateSafetyDesign = async () => {
    setGeneratingSafetyDesign(true);
    
    try {
      // Create form data with child safety specific results
      const formData = new FormData();
      
      // Prepare data specifically for child safety improvements
      const safetyData = {
        improvement_suggestions: results.improvement_suggestions || results.iyilestirme_onerileri || [],
        safety_assessment: results.safety_assessment || results.guvenlik_degerlendirmesi || '',
        detected_hazards: results.detected_hazards || results.tespit_edilen_tehlikeler || []
      };
      
      formData.append('analysis', JSON.stringify(safetyData));
      
      // Use the last uploaded image from localStorage if available
      const lastImageData = localStorage.getItem('lastUploadedImage');
      if (lastImageData) {
        // Convert base64 to blob
        const response = await fetch(lastImageData);
        const blob = await response.blob();
        formData.append('file', blob, 'image.jpg');
      } else {
        setImageError('No image available for reference');
        setGeneratingSafetyDesign(false);
        return;
      }

      // Call the API to generate safety design using the dedicated endpoint
      const response = await axios.post('http://localhost:8001/generate/safety-design/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if the image generation was successful
      if (response.data.success) {
        setSafetyDesignImage(`data:image/png;base64,${response.data.image_base64}`);
        setSafetyDesignDescription(response.data.description || 'Generated safety environment design');
      } else {
        setImageError(response.data.error || 'Failed to generate safety design');
      }
    } catch (err) {
      setImageError(`Error generating safety design: ${err.message}`);
    } finally {
      setGeneratingSafetyDesign(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Summary Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {isChildSafetyAnalysis ? 'Child Safety Analysis Summary' : 'Analysis Summary'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {isChildSafetyAnalysis 
                  ? (results.safety_assessment || results.guvenlik_degerlendirmesi || 'Generating assessment...')
                  : (results.wellbeing_assessment || 'Generating assessment...')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Child Safety Scores - Horizontal alignment fixed */}
        {isChildSafetyAnalysis && (
          <>
            {/* First Row - First two cards side by side */}
            <Grid container item spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {safetyCategoryNames.sharp_corners}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{safetyCategoryNames.sharp_corners}</Typography>
                        <Typography variant="body2" sx={{ color: getScoreColor(childSafetyScores.sharp_corners) }}>
                          {childSafetyScores.sharp_corners}/100
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={childSafetyScores.sharp_corners}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getScoreColor(childSafetyScores.sharp_corners),
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {safetyCategoryNames.small_objects}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{safetyCategoryNames.small_objects}</Typography>
                        <Typography variant="body2" sx={{ color: getScoreColor(childSafetyScores.small_objects) }}>
                          {childSafetyScores.small_objects}/100
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={childSafetyScores.small_objects}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getScoreColor(childSafetyScores.small_objects),
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Second Row - Last two cards side by side */}
            <Grid container item spacing={3} sx={{ mt: 0 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {safetyCategoryNames.electrical_hazards}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{safetyCategoryNames.electrical_hazards}</Typography>
                        <Typography variant="body2" sx={{ color: getScoreColor(childSafetyScores.electrical_hazards) }}>
                          {childSafetyScores.electrical_hazards}/100
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={childSafetyScores.electrical_hazards}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getScoreColor(childSafetyScores.electrical_hazards),
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {safetyCategoryNames.chemicals}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{safetyCategoryNames.chemicals}</Typography>
                        <Typography variant="body2" sx={{ color: getScoreColor(childSafetyScores.chemicals) }}>
                          {childSafetyScores.chemicals}/100
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={childSafetyScores.chemicals}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getScoreColor(childSafetyScores.chemicals),
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Other Safety Scores */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Other Safety Factors
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(childSafetyScores)
                      .filter(([key]) => !['sharp_corners', 'small_objects', 'electrical_hazards', 'chemicals'].includes(key))
                      .map(([key, value]) => (
                        <Grid item xs={12} md={6} key={key}>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">{safetyCategoryNames[key] || key.replace(/_/g, ' ').toUpperCase()}</Typography>
                              <Typography variant="body2" sx={{ color: getScoreColor(value) }}>
                                {value}/100
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={value}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: getScoreColor(value),
                                },
                              }}
                            />
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Normal Analysis Scores - For non-child safety analysis */}
        {!isChildSafetyAnalysis && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detailed Scores
                </Typography>
                <Grid container spacing={2}>
                  {scores.map((score) => (
                    <Grid item xs={12} md={6} key={score.name}>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{score.name}</Typography>
                          <Typography variant="body2" sx={{ color: getScoreColor(score.value) }}>
                            {score.value}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={score.value}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getScoreColor(score.value),
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Detected Features/Hazards */}
        {!isPersonalAnalysis && !isChildSafetyAnalysis && results.detected_features && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detected Features
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {results.detected_features.map((feature, index) => (
                    <Typography component="li" key={index} sx={{ mb: 1 }}>
                      {feature}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {/* Detected Hazards - Child Safety */}
        {isChildSafetyAnalysis && (results.detected_hazards || results.tespit_edilen_tehlikeler) && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detected Hazards
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {(results.detected_hazards || results.tespit_edilen_tehlikeler).map((hazard, index) => (
                    <Typography component="li" key={index} sx={{ mb: 1 }}>
                      {hazard}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Improvement Suggestions */}
        {results.improvement_suggestions && !isChildSafetyAnalysis && (
          <Grid item xs={12} md={isPersonalAnalysis ? 12 : 6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Improvement Suggestions
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {results.improvement_suggestions.map((suggestion, index) => (
                    <Typography component="li" key={index} sx={{ mb: 1 }}>
                      {suggestion}
                    </Typography>
                  ))}
                </Box>
                
                {/* Generate Reference Image Button - Only for personal analysis */}
                {isPersonalAnalysis && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={handleGenerateImage}
                      disabled={generatingImage}
                      sx={{ mt: 2 }}
                    >
                      {generatingImage ? (
                        <>
                          <CircularProgress size={24} sx={{ mr: 1 }} />
                          Generating Reference Image...
                        </>
                      ) : 'Generate Reference Image'}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {/* Safety Improvements - Child Safety */}
        {isChildSafetyAnalysis && (results.improvement_suggestions || results.iyilestirme_onerileri) && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Safety Improvement Recommendations
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {(results.improvement_suggestions || results.iyilestirme_onerileri).map((suggestion, index) => (
                    <Typography component="li" key={index} sx={{ mb: 1 }}>
                      {suggestion}
                    </Typography>
                  ))}
                </Box>
                
                {/* Safety Environment Design Button */}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleGenerateSafetyDesign}
                    disabled={generatingSafetyDesign}
                    sx={{ mt: 2 }}
                  >
                    {generatingSafetyDesign ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        Creating Safe Environment Design...
                      </>
                    ) : 'Create Safe Environment Design'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {/* Generated Reference Image - Only show when available */}
        {isPersonalAnalysis && generatedImage && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Reference Image
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {imageDescription}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    mt: 2 
                  }}
                >
                  <Box
                    component="img"
                    src={generatedImage}
                    alt="Reference Room Design"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 500,
                      objectFit: 'contain',
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Generated Safety Design Image - Only show when available */}
        {isChildSafetyAnalysis && safetyDesignImage && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Safe Environment Design
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {safetyDesignDescription}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    mt: 2 
                  }}
                >
                  <Box
                    component="img"
                    src={safetyDesignImage}
                    alt="Safe Environment Design"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 500,
                      objectFit: 'contain',
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {/* Error message for image generation */}
        {imageError && (
          <Grid item xs={12}>
            <Box 
              sx={{ 
                bgcolor: '#FFF0F0', 
                color: '#D32F2F', 
                p: 2, 
                borderRadius: 1 
              }}
            >
              <Typography variant="body2">{imageError}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default AnalysisResults; 