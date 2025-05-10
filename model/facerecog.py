import google.generativeai as genai

genai.configure(api_key="AIzaSyDSXdySoGPfQcxoD51vtFK2xxjhMMfczeY")

model = genai.GenerativeModel('gemini-1.5-flash')

from PIL import Image

# Replace with your image path
image_path = "your_image.jpg"  # Change this to your image file path
image = Image.open(image_path)
image.show()

STRESS_SCORES = {
    "mutlu": -2,
    "gülümseyen": -2,
    "rahat": -1,
    "nötr": 0,
    "şaşkın": 1,
    "üzgün": 2,
    "hüzünlü": 2,
    "kızgın": 3,
    "öfke": 3,
    "korkmuş": 3,
    "endişeli": 3,
    "gergin": 2,
    "yorgun": 1
}

import re

def analyze_stress_from_text(gemini_output):
    lower_text = gemini_output.lower()
    stress_total = 0
    matched_emotions = []

    for emotion, score in STRESS_SCORES.items():
        if re.search(rf"\b{emotion}\b", lower_text):
            matched_emotions.append((emotion, score))
            stress_total += score

    if not matched_emotions:
        return "Stres durumu tespit edilemedi."

    # Ortalama stres seviyesi
    avg_stress = stress_total / len(matched_emotions)

    if avg_stress <= 0:
        stress_level = "Rahat"
    elif avg_stress <= 1.5:
        stress_level = "Hafif Stresli"
    else:
        stress_level = "Yüksek Stresli"

    return {
        "detected_emotions": matched_emotions,
        "average_stress_score": avg_stress,
        "stress_level": stress_level
    }

response = model.generate_content(
    ["Bu fotoğrafta insanların yüz ifadelerine göre ruh halleri nedir?", image],
    stream=False
)
result = analyze_stress_from_text(response.text)
print(response.text)

print("Algılanan Duygular:", result["detected_emotions"])
print("Ortalama Stres Skoru:", result["average_stress_score"])
print("Stres Seviyesi:", result["stress_level"])
