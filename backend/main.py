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
from model.generator import ReferenceImageGenerator

app = FastAPI()

# Initialize the reference image generator
reference_generator = ReferenceImageGenerator()

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
        print("Starting outdoor analysis...")
        # Read the image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        print("Image loaded successfully")

        # Call the outdoor analysis model
        print("Calling Gemini API...")
        analysis_results_json = analyze_environment_with_gemini(image)
        print(f"Raw API response: {analysis_results_json}")

        if analysis_results_json is None:
            print("Error: No response from Gemini API")
            return {
                "error": "No response from analysis model",
                "analysis_results": None
            }

        # Parse the JSON response using the parse_gemini_response function
        print("Parsing response...")
        analysis_results = parse_gemini_response(analysis_results_json)
        print(f"Parsed results: {analysis_results}")
        
        if analysis_results is None:
            print("Error: Failed to parse analysis results")
            return {
                "error": "Failed to parse analysis results",
                "analysis_results": None
            }

        # Calculate wellbeing score if not present
        if "wellbeing_score" not in analysis_results:
            print("Calculating wellbeing score...")
            scores = {k: v for k, v in analysis_results.items() 
                     if isinstance(v, (int, float)) and k not in ["wellbeing_score"]}
            analysis_results["wellbeing_score"] = calculate_outdoor_wellbeing_score(scores)

        # Ensure all required fields are present
        print("Validating required fields...")
        required_fields = {
            "wellbeing_assessment": "Analysis of the outdoor environment's impact on wellbeing",
            "improvement_suggestions": ["Consider adding more green spaces", "Reduce traffic density"],
            "detected_features": ["Natural elements", "Urban features"]
        }

        for field, default_value in required_fields.items():
            if field not in analysis_results or not analysis_results[field]:
                print(f"Adding default value for missing field: {field}")
                analysis_results[field] = default_value

        print("Analysis complete, returning results")
        return analysis_results
    except Exception as e:
        print(f"Error in outdoor analysis: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return {
            "error": f"Error in outdoor analysis: {str(e)}",
            "analysis_results": None
        }

def calculate_outdoor_wellbeing_score(scores):
    """Calculate overall wellbeing score based on outdoor space factors."""
    if not scores:
        return 50  # Default neutral score

    # Define impact factors for each parameter
    impact_factors = {
        'green_space': 0.3,      # Positive impact
        'water_features': 0.2,   # Positive impact
        'traffic': -0.2,         # Negative impact
        'crowd': -0.15,          # Negative impact
        'urbanization': -0.15    # Mixed impact
    }

    # Calculate base wellbeing score (0-100)
    wellbeing_score = 50  # Neutral starting point

    # Apply each factor
    for key, factor in impact_factors.items():
        if key in scores:
            # Normalize the score (0-100 to -1 to 1 range) before applying factor
            normalized_score = (scores[key] - 50) / 50
            wellbeing_score += normalized_score * factor * 25

    # Ensure score stays within bounds
    wellbeing_score = max(0, min(100, round(wellbeing_score, 1)))

    return wellbeing_score

@app.post("/generate/reference-image/")
async def generate_reference(file: UploadFile = File(...)):
    """
    Generate a reference image based on the original image
    and improvement suggestions from indoor analysis.
    """
    try:
        # Read the image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # First, analyze the image to get improvement suggestions
        analysis_results_json = analyze_indoor_space_with_gemini(image)
        analysis_results = json.loads(analysis_results_json)
        
        # Generate reference image based on analysis
        reference_result = reference_generator.generate_from_image_and_analysis(image, analysis_results)
        
        return reference_result
    except Exception as e:
        return {
            "error": f"Error generating reference image: {str(e)}",
            "success": False
        }

@app.post("/generate/reference-from-analysis/")
async def generate_reference_from_analysis(
    file: UploadFile = File(...), 
    analysis: str = File(...)
):
    """
    Generate a reference image using an image and pre-existing analysis data.
    This avoids analyzing the image twice if analysis was already done.
    
    Args:
        file: The original image file
        analysis: JSON string containing analysis data with improvement suggestions
    """
    try:
        # Read the image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Parse the provided analysis JSON
        analysis_results = json.loads(analysis)
        
        # Generate reference image based on analysis
        reference_result = reference_generator.generate_from_image_and_analysis(image, analysis_results)
        
        return reference_result
    except Exception as e:
        return {
            "error": f"Error generating reference image: {str(e)}",
            "success": False
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)