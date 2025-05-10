# -*- coding: utf-8 -*-
"""indoor_analysis.py

Indoor space analysis using Gemini API.
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

def analyze_indoor_space_with_gemini(image):
    """Analyze the indoor space image using Gemini API."""
    if image is None:
        return None

    # Select Gemini's vision model
    model = genai.GenerativeModel('gemini-1.5-flash')

    # Prepare the analysis prompt
    prompt = """
    Analyze this indoor space image (room, office, or study area) and evaluate the following factors on a 0-100 scale:

    1. Natural Light: Amount and quality of natural light
    2. Clutter: Level of disorganization and clutter
    3. Ergonomics: Quality of furniture and workspace setup
    4. Plants: Presence of plants/natural elements
    5. Color Scheme: Appropriateness of colors for mental wellbeing
    6. Personalization: Level of personal touches and comfort items
    7. Noise Potential: Likely noise level based on visible features
    8. Air Quality: Apparent ventilation and air quality indicators

    Provide output in the following JSON format:
    {
        "natural_light": 0-100 score,
        "clutter": 0-100 score,
        "ergonomics": 0-100 score,
        "plants": 0-100 score,
        "color_scheme": 0-100 score,
        "personalization": 0-100 score,
        "noise_potential": 0-100 score,
        "air_quality": 0-100 score,
        "detected_features": ["feature1", "feature2", ...],
        "wellbeing_assessment": "Brief evaluation of this space's impact on mental health",
        "improvement_suggestions": ["suggestion1", "suggestion2", ...]
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

def visualize_indoor_scores(scores):
    """Visualize indoor space scores as a radar chart."""
    # Get only scores, exclude descriptions etc.
    indoor_scores = {k: v for k, v in scores.items()
                   if isinstance(v, (int, float)) and k not in ["detected_features", "wellbeing_assessment", "improvement_suggestions"]}

    # Create radar chart
    plt.figure(figsize=(8, 8))
    categories = list(indoor_scores.keys())
    values = list(indoor_scores.values())

    # Normalize values to 0-1 range for radar chart
    values_normalized = [v/100 for v in values]

    # Plot the chart
    angles = np.linspace(0, 2*np.pi, len(categories), endpoint=False).tolist()
    values_normalized += values_normalized[:1]  # Close the loop
    angles += angles[:1]  # Close the loop
    categories += categories[:1]  # Close the labels

    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
    ax.plot(angles, values_normalized, 'o-', linewidth=2)
    ax.fill(angles, values_normalized, alpha=0.25)
    ax.set_thetagrids(np.degrees(angles[:-1]), categories[:-1])
    ax.set_ylim(0, 1)
    ax.grid(True)
    ax.set_title("Indoor Space Wellbeing Analysis", size=15)
    plt.show()

def calculate_wellbeing_score(indoor_scores):
    """Calculate overall wellbeing score based on indoor space factors."""
    if not indoor_scores:
        return None

    # Define impact factors for each parameter
    impact_factors = {
        'natural_light': 0.9,    # Positive impact
        'clutter': -0.8,         # Negative impact
        'ergonomics': 0.7,       # Positive impact
        'plants': 0.6,           # Positive impact
        'color_scheme': 0.5,     # Positive impact
        'personalization': 0.4,  # Positive impact
        'noise_potential': -0.6, # Negative impact
        'air_quality': 0.7       # Positive impact
    }

    # Calculate base wellbeing score (0-100)
    wellbeing_score = 50  # Neutral starting point

    # Apply each factor
    for key, factor in impact_factors.items():
        if key in indoor_scores:
            # Normalize the score (0-100 to -1 to 1 range) before applying factor
            normalized_score = (indoor_scores[key] - 50) / 50
            wellbeing_score += normalized_score * factor * 25

    # Ensure score stays within bounds
    wellbeing_score = max(0, min(100, round(wellbeing_score, 1)))

    return wellbeing_score

def visualize_wellbeing_level(wellbeing_score):
    """Visualize wellbeing level as a gauge."""
    if wellbeing_score is None:
        return

    # Create gauge chart
    fig, ax = plt.subplots(figsize=(8, 4))

    # Gauge ranges
    categories = ['Poor', 'Fair', 'Good', 'Excellent']
    bounds = [0, 40, 70, 90, 100]
    colors = ['#FF6B6B', '#FFD166', '#06D6A0', '#118AB2']

    # Draw gauge ranges
    for i, (color, left, right) in enumerate(zip(colors, bounds[:-1], bounds[1:])):
        ax.barh(0, right-left, left=left, height=0.5, color=color)

    # Add pointer
    ax.barh(0, 0.5, left=wellbeing_score, height=0.5, color='black')

    # Style adjustments
    ax.set_yticks([])
    ax.set_xlim(0, 100)
    ax.set_xticks(bounds)
    ax.set_xticklabels(['0', '40', '70', '90', '100'])
    ax.set_title(f'Wellbeing Score: {wellbeing_score:.1f}/100', size=14)

    # Add category labels
    for i, category in enumerate(categories):
        ax.text((bounds[i] + bounds[i+1]) / 2, -0.2, category,
                horizontalalignment='center', size=12)

    plt.tight_layout()
    plt.show()

def main():
    """Main execution function."""
    print("Indoor Wellbeing Analysis - Environmental Impact on Mental Health")
    print("=" * 60)

    # Get image path from user
    image_path = input("Enter the path to your image: ")
    try:
        image = PIL.Image.open(image_path)
    except Exception as e:
        print(f"Failed to load image: {str(e)}")
        return

    # Analyze with Gemini API
    print("Analyzing image with Gemini API...")
    response_text = analyze_indoor_space_with_gemini(image)

    # Parse response
    analysis_results = parse_gemini_response(response_text)

    if analysis_results:
        # Display results
        print("\nIndoor Space Analysis Results:")
        print("-" * 40)

        # Print detected features
        if "detected_features" in analysis_results:
            print("\nDetected Features:")
            for feature in analysis_results["detected_features"]:
                print(f"- {feature}")

        # Print scores
        indoor_scores = {k: v for k, v in analysis_results.items()
                       if isinstance(v, (int, float)) and k not in ["detected_features", "wellbeing_assessment", "improvement_suggestions"]}

        print("\nFactor Scores (0-100):")
        for category, score in indoor_scores.items():
            print(f"{category.replace('_', ' ').title()}: {score}/100")

        # Print wellbeing assessment
        if "wellbeing_assessment" in analysis_results:
            print("\nWellbeing Assessment:")
            print(analysis_results["wellbeing_assessment"])

        # Print improvement suggestions
        if "improvement_suggestions" in analysis_results:
            print("\nImprovement Suggestions:")
            for i, suggestion in enumerate(analysis_results["improvement_suggestions"], 1):
                print(f"{i}. {suggestion}")

        # Save results
        print("\nSaving results in JSON format...")
        with open("indoor_wellbeing_analysis.json", "w", encoding="utf-8") as f:
            json.dump(analysis_results, f, ensure_ascii=False, indent=2)

        print("Analysis complete! Results saved to 'indoor_wellbeing_analysis.json'.")
    else:
        print("Failed to process Gemini API response.")

if __name__ == "__main__":
    main()

