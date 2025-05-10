import google.generativeai as genai
import json
import re
from PIL import Image
from typing import Dict, List, Tuple, Union

# Configure Gemini API
GOOGLE_API_KEY = "AIzaSyDSXdySoGPfQcxoD51vtFK2xxjhMMfczeY"
genai.configure(api_key=GOOGLE_API_KEY)

# Emotion to stress score mapping
EMOTION_SCORES = {
    "happy": -2,
    "smiling": -2,
    "relaxed": -1,
    "neutral": 0,
    "surprised": 1,
    "sad": 2,
    "melancholic": 2,
    "angry": 3,
    "furious": 3,
    "fearful": 3,
    "anxious": 3,
    "tense": 2,
    "tired": 1
}

def analyze_face_with_gemini(image: Image.Image) -> str:
    """
    Analyze facial expressions in the image using Gemini API.
    
    Args:
        image (PIL.Image.Image): Input image containing faces
        
    Returns:
        str: Gemini API response text describing emotions
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = "Analyze the facial expressions and emotional states of people in this image. Describe their emotions in detail."
        
        response = model.generate_content([prompt, image], stream=False)
        return response.text
    except Exception as e:
        print(f"Error in Gemini API call: {str(e)}")
        return None

def analyze_stress_from_text(gemini_output: str) -> Dict[str, Union[List[Tuple[str, int]], float, str]]:
    """
    Analyze stress levels from Gemini's text output about facial expressions.
    
    Args:
        gemini_output (str): Text output from Gemini API describing emotions
        
    Returns:
        Dict containing:
            - detected_emotions: List of tuples (emotion, score)
            - average_stress_score: Float representing average stress level
            - stress_level: String indicating overall stress level
    """
    if not gemini_output:
        return {
            "error": "No emotion analysis data available",
            "detected_emotions": [],
            "average_stress_score": 0,
            "stress_level": "Unknown"
        }

    lower_text = gemini_output.lower()
    stress_total = 0
    matched_emotions = []

    for emotion, score in EMOTION_SCORES.items():
        if re.search(rf"\b{emotion}\b", lower_text):
            matched_emotions.append((emotion, score))
            stress_total += score

    if not matched_emotions:
        return {
            "detected_emotions": [],
            "average_stress_score": 0,
            "stress_level": "No emotions detected"
        }

    # Calculate average stress level
    avg_stress = stress_total / len(matched_emotions)

    # Determine stress level category
    if avg_stress <= 0:
        stress_level = "Relaxed"
    elif avg_stress <= 1.5:
        stress_level = "Mild Stress"
    else:
        stress_level = "High Stress"

    return {
        "detected_emotions": matched_emotions,
        "average_stress_score": round(avg_stress, 2),
        "stress_level": stress_level
    }

def analyze_faces(image: Image.Image) -> str:
    """
    Main function to analyze faces in an image and return stress analysis.
    
    Args:
        image (PIL.Image.Image): Input image containing faces
        
    Returns:
        str: JSON string containing stress analysis results
    """
    try:
        # Get emotion analysis from Gemini
        gemini_output = analyze_face_with_gemini(image)
        if not gemini_output:
            return json.dumps({
                "error": "Failed to analyze image",
                "detected_emotions": [],
                "average_stress_score": 0,
                "stress_level": "Unknown"
            })

        # Analyze stress levels
        analysis_results = analyze_stress_from_text(gemini_output)
        
        # Add raw Gemini output for reference
        analysis_results["raw_analysis"] = gemini_output
        
        return json.dumps(analysis_results)
    except Exception as e:
        return json.dumps({
            "error": f"Error in face analysis: {str(e)}",
            "detected_emotions": [],
            "average_stress_score": 0,
            "stress_level": "Error"
        })

def main():
    """Main execution function."""
    print("Face Analysis - Stress Level Detection")
    print("=" * 50)

    # Get image path from user
    image_path = input("Enter the path to your image: ")
    try:
        image = Image.open(image_path)
    except Exception as e:
        print(f"Failed to load image: {str(e)}")
        return

    # Analyze faces
    print("Analyzing faces with Gemini API...")
    analysis_results = analyze_faces(image)
    results = json.loads(analysis_results)

    # Print results
    print("\nAnalysis Results:")
    print("-" * 30)
    print("Raw Analysis:", results.get("raw_analysis", "No raw analysis available"))
    print("\nDetected Emotions:", results.get("detected_emotions", []))
    print("Average Stress Score:", results.get("average_stress_score", 0))
    print("Stress Level:", results.get("stress_level", "Unknown"))

if __name__ == "__main__":
    main()
