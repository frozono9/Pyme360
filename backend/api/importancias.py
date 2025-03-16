
from fastapi import APIRouter, Body
import sys
import os
import json

# Add parent directory to path so we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from agents.importancias import query

router = APIRouter()

@router.post("/importancias")
async def get_importancias(data: str = Body(...), prompt: str = Body(...)):
    """
    API endpoint to query the importancias.py script
    
    Args:
        data: JSON string with the analysis data from analizador_importancias.py
        prompt: Text prompt to guide the AI analysis
        
    Returns:
        JSON with AI-generated insights and visualizations
    """
    try:
        # Call the query function from importancias.py
        result = query(
            user_message="Genera visualizaciones y recomendaciones basadas en estos datos de análisis", 
            data=data, 
            prompt=prompt
        )
        
        # Parse the text to extract the JSON
        if isinstance(result, dict) and "text" in result:
            text = result["text"]
            
            # Extract JSON from the text
            # This assumes the AI response contains JSON blocks that we can extract
            json_data = extract_json_from_text(text)
            return json_data
        
        return result
    except Exception as e:
        return {"error": str(e)}

def extract_json_from_text(text):
    """
    Extract JSON blocks from text string
    """
    result = {}
    
    try:
        # Try to find JSON blocks in the text (assuming they're enclosed in {})
        import re
        json_blocks = re.findall(r'\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\}', text)
        
        for block in json_blocks:
            try:
                # Try to parse the block as JSON
                json_data = json.loads(block)
                
                # If it's a dictionary, add its keys to the result
                if isinstance(json_data, dict):
                    for key, value in json_data.items():
                        result[key] = value
            except:
                continue
                
        # If we didn't find any valid JSON blocks, create a simplified structure
        if not result:
            # Extract feature importances (assuming format like "feature: 0.123")
            importances = re.findall(r'([a-zA-Z_]+): ([0-9.]+)', text)
            if importances:
                labels = [imp[0] for imp in importances[:5]]
                values = [float(imp[1]) for imp in importances[:5]]
                result["importancia_features"] = {
                    "labels": labels,
                    "values": values
                }
            
            # Extract recommendations as bullet points
            recommendations = re.findall(r'•\s*(.*?)(?=\n•|\n\n|$)', text)
            if recommendations:
                result["recomendaciones"] = recommendations
            
            # If we still don't have any structured data, return the text as-is
            if not result:
                result["text"] = text
                
    except Exception as e:
        result["error"] = str(e)
        result["text"] = text
        
    return result
