# -*- coding: utf-8 -*-
"""outdoor_analysis.py

Outdoor environment analysis using Gemini API.
"""

import pathlib
import google.generativeai as genai
import PIL.Image
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import io
import json
import base64

GOOGLE_API_KEY = "AIzaSyDSXdySoGPfQcxoD51vtFK2xxjhMMfczeY"
genai.configure(api_key=GOOGLE_API_KEY)

def analyze_environment_with_gemini(image):
    """Analyze the image using Gemini API."""
    if image is None:
        return None

    # Select Gemini's vision model
    model = genai.GenerativeModel('gemini-1.5-flash')

    # Prepare the analysis prompt
    prompt = """
    Analyze this urban/environmental image and evaluate the following factors on a 0-100 scale:

    1. Green Space: Trees, plants, parks, natural areas, etc.
    2. Traffic: Vehicles, roads, traffic density, etc.
    3. Crowd: Human density, crowdedness, etc.
    4. Water Features: Sea, lake, river, pool, etc.
    5. Urbanization: Buildings, structures, urban areas, etc.

    Provide output in the following JSON format:
    {
        "green_space": 0-100 score,
        "traffic": 0-100 score,
        "crowd": 0-100 score,
        "water_features": 0-100 score,
        "urbanization": 0-100 score,
        "detected_features": ["feature1", "feature2", ...],
        "overall_assessment": "Brief evaluation of this area's environmental characteristics"
    }

    Return only the JSON output, without any additional commentary.
    """

    try:
        # API call
        response = model.generate_content([prompt, image])

        # Extract JSON from response
        json_start = response.text.find('{')
        json_end = response.text.rfind('}') + 1
        json_str = response.text[json_start:json_end]

        return json_str
    except Exception as e:
        print(f"Error analyzing image: {str(e)}")
        return None

def parse_gemini_response(response_text):
    """Parse the Gemini API JSON response."""
    try:
        # Extract JSON section (response might contain extra text)
        json_str = response_text

        # If response is between ```json and ```
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        # If only ``` is used
        elif "```" in response_text:
            json_str = response_text.split("```")[1].strip()

        # Parse JSON
        result = json.loads(json_str)
        return result
    except Exception as e:
        print(f"JSON parse error: {e}")
        print(f"Raw response: {response_text}")
        return None

def main():
    """Main execution function."""
    print("Urban Aura - Environmental Analysis")
    print("=" * 50)

    # Get image path from user
    image_path = input("Enter the path to your image: ")
    try:
        image = PIL.Image.open(image_path)
    except Exception as e:
        print(f"Failed to load image: {str(e)}")
        return

    # Analyze with Gemini API
    print("Analyzing image with Gemini API...")
    response_text = analyze_environment_with_gemini(image)

    # Parse response
    env_results = parse_gemini_response(response_text)

    if env_results:
        # Display results
        print("\nEnvironmental Analysis Results:")
        print("-" * 30)

        # Print detected features
        if "detected_features" in env_results:
            print("\nDetected Features:")
            for feature in env_results["detected_features"]:
                print(f"- {feature}")

        # Print scores
        env_scores = {k: v for k, v in env_results.items()
                     if isinstance(v, (int, float)) and k not in ["detected_features", "overall_assessment"]}

        print("\nFactor Scores (0-100):")
        for category, score in env_scores.items():
            print(f"{category.replace('_', ' ').title()}: {score}/100")

        # Print overall assessment
        if "overall_assessment" in env_results:
            print("\nOverall Assessment:")
            print(env_results["overall_assessment"])

        # Save results
        print("\nSaving results in JSON format...")
        with open("urban_aura_analysis.json", "w", encoding="utf-8") as f:
            json.dump(env_results, f, ensure_ascii=False, indent=2)

        print("Analysis complete! Results saved to 'urban_aura_analysis.json'.")
    else:
        print("Failed to process Gemini API response.")

if __name__ == "__main__":
    main()

