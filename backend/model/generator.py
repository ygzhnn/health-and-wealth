# -*- coding: utf-8 -*-
"""
Generator module for creating reference images based on suggestions.
"""

from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import json
import base64
import os

class ReferenceImageGenerator:
    def __init__(self, api_key=None):
        """Initialize the generator with the given API key."""
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY", "AIzaSyDSXdySoGPfQcxoD51vtFK2xxjhMMfczeY")
        self.client = genai.Client(api_key=self.api_key)
        
    def generate_from_image_and_analysis(self, image, analysis_json):
        """
        Generate a reference image based on the original image and improvement suggestions.
        
        Args:
            image (PIL.Image): The input image
            analysis_json (dict): The analysis JSON containing improvement suggestions
            
        Returns:
            dict: Result containing image_base64, description, and success flag
        """
        try:
            # Convert PIL image to bytes
            img_byte_arr = BytesIO()
            image.save(img_byte_arr, format='JPEG')
            image_bytes = img_byte_arr.getvalue()
            
            # Create image part
            image_part = types.Part(
                inline_data=types.Blob(
                    mime_type="image/jpeg",
                    data=image_bytes
                )
            )
            
            # Determine if this is child safety analysis based on the json content
            is_child_safety = 'iyilestirme_onerileri' in analysis_json or 'tespit_edilen_tehlikeler' in analysis_json
            
            # Extract suggestions
            if is_child_safety:
                suggestions = analysis_json.get('improvement_suggestions', []) or analysis_json.get('iyilestirme_onerileri', [])
                hazards = analysis_json.get('detected_hazards', []) or analysis_json.get('tespit_edilen_tehlikeler', [])
                
                prompt_text = (
                    "This is a photo of a real room. Create a safe environment design for children "
                    "by addressing the following detected hazards:\n"
                )
                if hazards:
                    prompt_text += '\n'.join(f"- {h}" for h in hazards) + "\n\n"
                
                prompt_text += "Apply the following safety recommendations to make the room safer:\n"
                prompt_text += '\n'.join(f"- {s}" for s in suggestions)
                
                prompt_text += "\n\nPlease design a child-safe room/space and eliminate dangerous situations."
            else:
                suggestions = analysis_json.get('improvement_suggestions', [])
                suggestion_text = "Please generate a reference image for a room with the following improvements:\n"
                suggestion_text += '\n'.join(f"- {s}" for s in suggestions)
                
                prompt_text = (
                    "This is a photo of a real room. Based on the suggestions below, "
                    "create a new reference image that incorporates these improvements:\n"
                    f"{suggestion_text}"
                )
            
            # Create text part
            text_part = types.Part(text=prompt_text)
            
            # Send request to Gemini
            response = self.client.models.generate_content(
                model="gemini-2.0-flash-preview-image-generation",
                contents=[types.Content(parts=[text_part, image_part])],
                config=types.GenerateContentConfig(
                    response_modalities=["TEXT", "IMAGE"]
                )
            )
            
            # Process the response
            result = {
                "description": "",
                "image_base64": "",
                "success": False
            }
            
            for part in response.candidates[0].content.parts:
                if hasattr(part, "text") and part.text:
                    result["description"] = part.text
                elif hasattr(part, "inline_data") and part.inline_data:
                    result["image_base64"] = base64.b64encode(part.inline_data.data).decode('utf-8')
                    result["success"] = True
            
            return result
            
        except Exception as e:
            print(f"Error generating reference image: {str(e)}")
            return {
                "error": f"Error generating reference image: {str(e)}",
                "success": False
            }
    
    def generate_safety_design(self, image, analysis_json):
        """
        Generate a safety-focused reference image specifically for child safety.
        
        Args:
            image (PIL.Image): The input image
            analysis_json (dict): The analysis JSON containing safety hazards and recommendations
            
        Returns:
            dict: Result containing image_base64, description, and success flag
        """
        try:
            # Convert PIL image to bytes
            img_byte_arr = BytesIO()
            image.save(img_byte_arr, format='JPEG')
            image_bytes = img_byte_arr.getvalue()
            
            # Create image part
            image_part = types.Part(
                inline_data=types.Blob(
                    mime_type="image/jpeg",
                    data=image_bytes
                )
            )
            
            # Extract safety-specific information
            hazards = analysis_json.get('detected_hazards', []) or analysis_json.get('tespit_edilen_tehlikeler', [])
            suggestions = analysis_json.get('improvement_suggestions', []) or analysis_json.get('iyilestirme_onerileri', [])
            assessment = analysis_json.get('safety_assessment', '') or analysis_json.get('guvenlik_degerlendirmesi', '')
            
            # Create a comprehensive prompt for child safety design
            prompt_text = (
                "This is a photo of a real room. Transform this room into a safe environment for children.\n\n"
                "Assessment: " + assessment + "\n\n"
            )
            
            if hazards:
                prompt_text += "Detected hazards:\n"
                prompt_text += '\n'.join(f"- {h}" for h in hazards) + "\n\n"
            
            prompt_text += "Apply these safety improvements:\n"
            prompt_text += '\n'.join(f"- {s}" for s in suggestions) + "\n\n"
            
            prompt_text += (
                "Please transform this room into a completely safe environment for children. "
                "Soften sharp corners, remove small and dangerous objects, "
                "eliminate electrical hazards, place chemicals in locked cabinets, "
                "remove fall hazards, and add fire safety measures. "
                "The design should be both safe and aesthetically pleasing."
            )
            
            # Create text part
            text_part = types.Part(text=prompt_text)
            
            # Send request to Gemini with specific safety focus
            response = self.client.models.generate_content(
                model="gemini-2.0-flash-preview-image-generation",
                contents=[types.Content(parts=[text_part, image_part])],
                config=types.GenerateContentConfig(
                    response_modalities=["TEXT", "IMAGE"]
                )
            )
            
            # Process the response
            result = {
                "description": "",
                "image_base64": "",
                "success": False
            }
            
            for part in response.candidates[0].content.parts:
                if hasattr(part, "text") and part.text:
                    result["description"] = part.text
                elif hasattr(part, "inline_data") and part.inline_data:
                    result["image_base64"] = base64.b64encode(part.inline_data.data).decode('utf-8')
                    result["success"] = True
            
            return result
            
        except Exception as e:
            print(f"Error generating safety design: {str(e)}")
            return {
                "error": f"Error generating safety design: {str(e)}",
                "success": False
            }
    
    def generate_from_file(self, image_path, json_path):
        """
        Generate a reference image using files from the disk.
        
        Args:
            image_path (str): Path to the image file
            json_path (str): Path to the JSON file
            
        Returns:
            dict: Result containing image_base64, description, and success flag
        """
        try:
            # Load image
            with open(image_path, "rb") as img_file:
                image_bytes = img_file.read()
            input_image = Image.open(BytesIO(image_bytes))
            
            # Load JSON
            with open(json_path, 'r') as f:
                analysis_json = json.load(f)
                
            # Generate image
            return self.generate_from_image_and_analysis(input_image, analysis_json)
            
        except Exception as e:
            print(f"Error in generate_from_file: {str(e)}")
            return {
                "error": f"Error loading files for generation: {str(e)}",
                "success": False
            }

# For demonstration purposes when run as a script
if __name__ == "__main__":
    generator = ReferenceImageGenerator()
    
    # Paths to test files
    image_path = "test.jpg"
    json_path = "indoor_wellbeing_analysis.json"
    
    # Generate image
    result = generator.generate_from_file(image_path, json_path)
    
    # Display results
    if result["success"]:
        print("Successfully generated reference image")
        print("Description:", result["description"])
        
        # Save the image
        if result["image_base64"]:
            image_data = base64.b64decode(result["image_base64"])
            with open("output_reference_image.png", "wb") as f:
                f.write(image_data)
            print("Image saved as output_reference_image.png")
    else:
        print("Failed to generate image:", result.get("error", "Unknown error"))

