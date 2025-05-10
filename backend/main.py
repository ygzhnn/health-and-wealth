from fastapi import FastAPI, File, UploadFile
from PIL import Image
import io
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your analysis functions
# Make sure the paths are correct based on your project structure
from model.indoor_analysis import analyze_indoor_space_with_gemini
from model.outdoor_analysis import analyze_environment_with_gemini, parse_gemini_response
from model.facerecog import analyze_faces


app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost",      # Replace with your frontend URL(s) during development
    "http://localhost:3000",
    "http://localhost:5173",
    # Add your production frontend URL(s) here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze/office/")
async def analyze_office(file: UploadFile = File(...)):
    """
    Analyze both the office environment and people's stress levels in the image.
    Combines indoor space analysis with face recognition analysis.
    """
    try:
        # Read the image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))

        # Perform both analyses
        face_analysis = analyze_faces(image)
        indoor_analysis = analyze_indoor_space_with_gemini(image)
        

        # Parse both JSON strings
        indoor_results = json.loads(indoor_analysis)
        face_results = json.loads(face_analysis)

        # Combine the results
        combined_analysis = {
            "environment_analysis": indoor_results,
            "people_analysis": face_results,
            "overall_assessment": {
                "environment_score": indoor_results.get("wellbeing_score", 0),
                "people_stress_score": face_results.get("average_stress_score", 0),
                "combined_wellbeing": calculate_combined_wellbeing(
                    indoor_results.get("wellbeing_score", 0),
                    face_results.get("average_stress_score", 0)
                )
            }
        }

        return combined_analysis
    except Exception as e:
        return {
            "error": f"Error in office analysis: {str(e)}",
            "environment_analysis": None,
            "people_analysis": None,
            "overall_assessment": None
        }

def calculate_combined_wellbeing(environment_score: float, stress_score: float) -> str:
    """
    Calculate overall wellbeing based on both environment and people's stress levels.
    
    Args:
        environment_score: Score from indoor analysis (0-100)
        stress_score: Average stress score from face analysis (-2 to 3)
    
    Returns:
        str: Overall wellbeing assessment
    """
    # Normalize stress score to 0-100 scale (inverse relationship)
    # Stress score of -2 (happy) becomes 100, stress score of 3 (high stress) becomes 0
    normalized_stress = ((stress_score + 2) / 5) * 100
    
    # Calculate combined score (weighted average)
    # Giving more weight to environment (60%) than stress (40%)
    combined_score = (environment_score * 0.6) + (normalized_stress * 0.4)
    
    # Determine overall wellbeing category
    if combined_score >= 80:
        return "Excellent"
    elif combined_score >= 60:
        return "Good"
    elif combined_score >= 40:
        return "Fair"
    else:
        return "Needs Improvement"

@app.post("/analyze/personal/")
async def analyze_personal(file: UploadFile = File(...)):
    # Read the image file
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))

    # Call the indoor analysis model
    analysis_results_json = analyze_indoor_space_with_gemini(image)

    # Since the model returns a JSON string, we should parse it before returning
    analysis_results = json.loads(analysis_results_json)
    return analysis_results

@app.post("/analyze/outdoor/")
async def analyze_outdoor(file: UploadFile = File(...)):
    """
    Analyze outdoor environment using Gemini API.
    Evaluates factors like natural elements, air quality, and overall environmental wellbeing.
    """
    try:
        # Read the image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))

        # Call the outdoor analysis model
        analysis_results_json = analyze_environment_with_gemini(image)

        # Parse the JSON response using the parse_gemini_response function
        analysis_results = parse_gemini_response(analysis_results_json)
        
        if analysis_results is None:
            return {
                "error": "Failed to parse analysis results",
                "analysis_results": None
            }

        return analysis_results
    except Exception as e:
        return {
            "error": f"Error in outdoor analysis: {str(e)}",
            "analysis_results": None
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)