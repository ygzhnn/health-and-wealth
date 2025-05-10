import { Box, Card, CardContent, Typography, Grid, LinearProgress } from '@mui/material';

function AnalysisResults({ results, isPersonalAnalysis = false }) {
  if (!results) return null;

  // Extract scores for display
  const scores = Object.entries(results)
    .filter(([key, value]) => typeof value === 'number' && !key.includes('score'))
    .map(([key, value]) => ({
      name: key.replace(/_/g, ' ').toUpperCase(),
      value: value,
    }));

  // Get wellbeing score if available
  const wellbeingScore = results.wellbeing_score || 0;

  // Helper function to get color based on score
  const getScoreColor = (score) => {
    if (score >= 90) return '#118AB2'; // Excellent
    if (score >= 70) return '#06D6A0'; // Good
    if (score >= 40) return '#FFD166'; // Fair
    return '#FF6B6B'; // Poor
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Summary Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Analysis Summary
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {results.wellbeing_assessment || 'Generating assessment...'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Wellbeing Score Card - Only show for non-personal analysis */}
        {!isPersonalAnalysis && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Wellbeing Score
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h3" align="center" sx={{ color: getScoreColor(wellbeingScore) }}>
                    {wellbeingScore}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={wellbeingScore}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getScoreColor(wellbeingScore),
                      },
                    }}
                  />
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Poor</Typography>
                    <Typography variant="caption" color="text.secondary">Fair</Typography>
                    <Typography variant="caption" color="text.secondary">Good</Typography>
                    <Typography variant="caption" color="text.secondary">Excellent</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Detailed Scores */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detailed Scores
              </Typography>
              <Box sx={{ mt: 2 }}>
                {scores.map((score) => (
                  <Box key={score.name} sx={{ mb: 2 }}>
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
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Detected Features - Only show for non-personal analysis */}
        {!isPersonalAnalysis && results.detected_features && (
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

        {/* Improvement Suggestions */}
        {results.improvement_suggestions && (
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
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default AnalysisResults; 