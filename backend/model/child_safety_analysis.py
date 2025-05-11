# -*- coding: utf-8 -*-
"""child_safety_analysis.py

Child room safety analysis - Using Gemini API to detect
potential hazards in a room and provide recommendations for a safe environment.
"""

import google.generativeai as genai
import PIL.Image
import json
import os

# API key configuration
GOOGLE_API_KEY = "AIzaSyDSXdySoGPfQcxoD51vtFK2xxjhMMfczeY"
genai.configure(api_key=GOOGLE_API_KEY)

def analyze_child_safety_with_gemini(image):
    """Uses Gemini API for child room safety analysis."""
    if image is None:
        return None

    # Gemini image model
    model = genai.GenerativeModel('gemini-1.5-flash')

    # Prepare prompt for analysis
    prompt = """
    Analyze this room image for child safety and evaluate the following factors on a 0-100 scale:

    1. Sharp Corners: Sharp corners and edges on furniture
    2. Small Objects: Small parts that could pose choking hazards
    3. Electrical Hazards: Outlets, cords, electrical devices
    4. Chemicals: Cleaning materials or toxic substances
    5. Fall Hazards: Tall furniture, steep stairs, or slippery surfaces
    6. Pinch Hazards: Finger pinching or door hazards
    7. General Safety: General environment organization and safety
    8. Fire Safety: Elements that could pose fire hazards

    Provide the output in the following JSON format:
    {
        "sharp_corners": score 0-100 (higher score means fewer sharp corners),
        "small_objects": score 0-100 (higher score means fewer choking hazards),
        "electrical_hazards": score 0-100 (higher score means safer electrical condition),
        "chemicals": score 0-100 (higher score means fewer chemical hazards),
        "fall_hazards": score 0-100 (higher score means fewer fall hazards),
        "pinch_hazards": score 0-100 (higher score means fewer pinch hazards),
        "general_safety": score 0-100 (higher score means better general safety),
        "fire_safety": score 0-100 (higher score means better fire safety),
        "detected_hazards": ["hazard1", "hazard2", ...],
        "safety_assessment": "A brief assessment of the room's child safety",
        "improvement_suggestions": ["suggestion1", "suggestion2", ...]
    }

    Return only the JSON output, no additional comments.
    """

    try:
        # API call
        response = model.generate_content([prompt, image])
        
        # Extract JSON from response
        json_start = response.text.find('{')
        json_end = response.text.rfind('}') + 1
        json_str = response.text[json_start:json_end]
        
        # Calculate safety score
        try:
            data = json.loads(json_str)
            # Calculate average safety score (8 categories)
            safety_scores = [
                data.get("sharp_corners", 0),
                data.get("small_objects", 0),
                data.get("electrical_hazards", 0),
                data.get("chemicals", 0),
                data.get("fall_hazards", 0),
                data.get("pinch_hazards", 0),
                data.get("general_safety", 0),
                data.get("fire_safety", 0)
            ]
            
            # Take average of non-empty scores
            valid_scores = [score for score in safety_scores if score > 0]
            if valid_scores:
                safety_score = sum(valid_scores) / len(valid_scores)
                data["child_safety_score"] = round(safety_score, 1)
            else:
                data["child_safety_score"] = 0
                
            # Update JSON and convert to string
            json_str = json.dumps(data)
        except:
            # In case of JSON parse error, use original JSON
            pass
            
        return json_str
    except Exception as e:
        print(f"Image analysis error: {str(e)}")
        return None

def parse_gemini_response(response_text):
    """Parse Gemini API JSON response."""
    try:
        # Extract JSON section (response may contain extra text)
        json_str = response_text

        # If response is between ```json and ```
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        # If only ``` is used
        elif "```" in response_text:
            json_str = response_text.split("```")[1].strip()

        # Parse JSON
        result = json.loads(json_str)
        
        # Map Turkish field names to English if they exist
        field_mapping = {
            "keskin_koseler": "sharp_corners",
            "kucuk_nesneler": "small_objects",
            "elektrik_tehlikeleri": "electrical_hazards",
            "kimyasallar": "chemicals",
            "dusme_tehlikesi": "fall_hazards",
            "sikisma_tehlikesi": "pinch_hazards",
            "genel_guvenlik": "general_safety",
            "yangin_guvenligi": "fire_safety",
            "tespit_edilen_tehlikeler": "detected_hazards",
            "guvenlik_degerlendirmesi": "safety_assessment",
            "iyilestirme_onerileri": "improvement_suggestions"
        }
        
        # Create a new result with English field names
        english_result = {}
        for key, value in result.items():
            english_key = field_mapping.get(key, key)
            english_result[english_key] = value
        
        return english_result
    except Exception as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw response: {response_text}")
        return None

# Main function for testing
if __name__ == "__main__":
    test_image_path = input("Enter the path to the image to analyze: ")
    image = PIL.Image.open(test_image_path)
    
    # Analysis with Gemini
    response_text = analyze_child_safety_with_gemini(image)
    
    # Parse response
    results = parse_gemini_response(response_text)
    
    if results:
        # Show results
        print("\nChild Safety Analysis Results:")
        print("-" * 40)
        
        # Show safety score
        if "child_safety_score" in results:
            print(f"\nOverall Child Safety Score: {results['child_safety_score']}/100")
        
        # Show hazards
        if "detected_hazards" in results:
            print("\nDetected Hazards:")
            for hazard in results["detected_hazards"]:
                print(f"- {hazard}")
        
        # Show scores
        safety_categories = {
            "sharp_corners": "Sharp Corners",
            "small_objects": "Small Objects (Choking)",
            "electrical_hazards": "Electrical Hazards",
            "chemicals": "Chemicals",
            "fall_hazards": "Fall Hazards",
            "pinch_hazards": "Pinch Hazards",
            "general_safety": "General Safety",
            "fire_safety": "Fire Safety"
        }
        
        print("\nCategory Scores (0-100):")
        for key, label in safety_categories.items():
            if key in results:
                print(f"{label}: {results[key]}/100")
        
        # Show assessment
        if "safety_assessment" in results:
            print("\nSafety Assessment:")
            print(results["safety_assessment"])
        
        # Show improvement suggestions
        if "improvement_suggestions" in results:
            print("\nImprovement Suggestions:")
            for i, suggestion in enumerate(results["improvement_suggestions"], 1):
                print(f"{i}. {suggestion}")
        
        # Save results
        with open("child_safety_analysis.json", "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        print("\nAnalysis complete! Results saved to 'child_safety_analysis.json' file.")
    else:
        print("Could not process Gemini API response.") 