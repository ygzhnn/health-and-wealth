# Health & Wealth: Environmental Wellness Analysis Platform

A comprehensive web application that analyzes indoor and outdoor environments to evaluate their impact on wellbeing, safety, and emotional state. The platform uses advanced AI to provide personalized recommendations and generate improved environment visualizations.

## Features

- **Multiple Analysis Types**:
  - **Indoor Analysis**: Evaluate psychological effects of indoor environments
  - **Outdoor Analysis**: Analyze impacts of outdoor spaces on emotional wellbeing
  - **Personal Analysis**: Measure how personal spaces affect mood
  - **Safety Analysis**: Identify potential hazards and safety recommendations

- **AI-Powered Visualization**:
  - Generate improvement visualizations based on analysis recommendations
  - Create visual representations of safer environments
  - Visualize recommended changes for better wellbeing

- **Comprehensive Metrics**:
  - Detailed scoring for various environmental factors
  - Safety hazard detection and assessment
  - Wellbeing impact evaluation

## Technology Stack

### Backend
- **FastAPI**: High-performance web framework
- **Google Gemini API**: Advanced AI for image analysis and text generation
- **Pillow**: Image processing library
- **Python 3.10+**: Modern Python features

### Frontend
- **React**: Component-based UI library
- **Material UI**: Modern, responsive component library
- **Axios**: Promise-based HTTP client
- **Vite**: Next generation frontend tooling

## Setup and Installation

### Prerequisites
- Node.js 16+
- Python 3.10+
- Google Gemini API key

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install required packages:
   ```
   pip install -r requirements.txt
   ```

3. Configure your Gemini API key:
   - Create a `.env` file in the backend directory
   - Add your API key: `GEMINI_API_KEY=your_api_key_here`

4. Start the backend server:
   ```
   python main.py
   ```
   The server will start on http://localhost:8001

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The application will be available at http://localhost:5173

## Usage Guide

1. **Select Analysis Type**: Choose from Indoor, Outdoor, Personal, Safety, or Office analysis
2. **Upload Image**: Select an image of the environment you want to analyze
3. **View Results**: Examine detailed analysis results
4. **Generate Improvement Visualization**: Create a visual representation of recommended improvements

## Troubleshooting

- **API Connection Issues**: Ensure backend server is running on port 8001
- **Image Upload Problems**: Verify image format is supported (JPG, PNG)
- **Visualization Generation Errors**: Check console logs for specific error messages

## Project Structure

```
health-and-wealth/
├── backend/
│   ├── main.py                 # FastAPI server and endpoints
│   ├── requirements.txt        # Python dependencies
│   └── model/                  # Analysis modules
│       ├── indoor_analysis.py  # Indoor environment analysis
│       ├── outdoor_analysis.py # Outdoor environment analysis
│       ├── facerecog.py        # Face recognition for stress analysis
│       └── generator.py        # Reference image generation
│
└── frontend/
    ├── src/
    │   ├── Components/         # Reusable UI components
    │   ├── Pages/              # Application pages
    │   └── app.jsx             # Main application component
    ├── public/                 # Static assets
    ├── package.json            # Node dependencies
    └── vite.config.js          # Vite configuration
```

## Development Notes

- **Safety Analysis**: The safety analysis module needs to be rebuilt. Current implementation relies on safety_analyser.py which is no longer available.

- **API Endpoints**:
  - `/analyze/indoor/`: Indoor environment analysis
  - `/analyze/outdoor/`: Outdoor environment analysis
  - `/analyze/personal/`: Personal space analysis
  - `/analyze/safety/`: Safety hazard analysis
  - `/analyze/office/`: Office environment and staff stress analysis
  - `/generate/reference-from-analysis/`: Generate improvement visualizations
  - `/generate/safety-improvement/`: Generate safety improvement visualizations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or suggestions, please contact the development team at [your-email@example.com](mailto:your-email@example.com). 