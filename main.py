from fastapi import FastAPI, File, UploadFile
from PIL import Image
import io
import json

# Import your analysis functions
# Make sure the paths are correct based on your project structure
from model.indoor_analysis import analyze_indoor_space_with_gemini
from model.outdoor_analysis import analyze_environment_with_gemini
from model.facerecog import analyze_stress_from_text # This one requires Gemini text output first

app = FastAPI()

@app.post("/analyze/office/")
async def analyze_office(file: UploadFile = File(...)):
    # Read the image file
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))

    # TODO: Send the image to Gemini API for face analysis to get text output
    # You will need to use the google.generativeai library to interact with Gemini.
    # The output of this step should be a string containing the emotion descriptions in Turkish.
    gemini_text_output = "placeholder for Gemini text output" # Replace with actual Gemini call

    # Call the face recognition model with the Gemini text output
    analysis_results = analyze_stress_from_text(gemini_text_output)

    return analysis_results

@app.post("/analyze/personal/")
async def analyze_personal(file: UploadFile = File(...)):
    # Read the image file
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))

    # Call the indoor analysis model
    analysis_results_json = analyze_indoor_space_with_gemini(image)

    # Since the model returns a JSON string, we should parse it before returning
    analysis_results = json.loads(analysis_results_json)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
@app.post("/analyze/outdoor/")
async def analyze_outdoor(file: UploadFile = File(...)):
    # Read the image file
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))

    # Call the outdoor analysis model
    analysis_results_json = analyze_environment_with_gemini(image)

    # Since the model returns a JSON string, we should parse it before returning
    analysis_results = json.loads(analysis_results_json)

    return analysis_results